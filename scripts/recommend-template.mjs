import { readFileSync, existsSync, realpathSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readRegistry, availableTemplates } from './registry.mjs';

// The host AI extracts requirements. This helper checks constraints, not natural language.
export function recommend(registry, requirements) {
  const allowed = new Set(['requiredCapabilities', 'preferredCapabilities', 'excludedCapabilities', 'existingProject']);
  if (!requirements || Object.keys(requirements).some(k => !allowed.has(k))) throw new Error('Invalid requirements fields.');
  if (requirements.existingProject !== undefined && typeof requirements.existingProject !== 'boolean') throw new Error('existingProject must be boolean.');
  for (const key of ['requiredCapabilities', 'preferredCapabilities', 'excludedCapabilities']) {
    if (!Array.isArray(requirements[key]) || requirements[key].some(x => typeof x !== 'string' || !/^[a-z0-9-]+$/.test(x))) throw new Error(`Invalid ${key}.`);
  }
  if (requirements.existingProject) return { status: 'existing-project', candidates: [], reason: 'Inspect and modify existing code; do not scaffold over it.' };
  const required = [...new Set(requirements.requiredCapabilities)];
  const excluded = new Set(requirements.excludedCapabilities);
  if (required.some(x => excluded.has(x))) return { status: 'conflicting-requirements', candidates: [] };
  const preferred = [...new Set(requirements.preferredCapabilities)];
  const considered = availableTemplates(registry).map(entry => ({
    entry,
    missing: required.filter(x => !entry.selection.capabilities.includes(x)),
    conflicts: entry.selection.capabilities.filter(x => excluded.has(x)),
    preferenceMatches: preferred.filter(x => entry.selection.capabilities.includes(x)).length,
  }));
  const candidates = considered.filter(x => !x.missing.length && !x.conflicts.length).sort((a, b) => b.preferenceMatches - a.preferenceMatches || a.entry.selection.complexity - b.entry.selection.complexity);
  const details = candidates.map(x => ({ id: x.entry.id, preferenceMatches: x.preferenceMatches, complexity: x.entry.selection.complexity, limitations: x.entry.selection.limitations }));
  if (!details.length) return { status: 'no-match', candidates: [], rejected: considered.map(x => ({ id: x.entry.id, missing: x.missing, conflicts: x.conflicts })) };
  const [first, second] = details;
  const tied = second && first.preferenceMatches === second.preferenceMatches && first.complexity === second.complexity;
  return { status: tied ? 'ambiguous' : 'selected', ...(tied ? {} : { template: first.id }), candidates: details };
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage: node scripts/recommend-template.mjs <requirements.json>');
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    console.log(JSON.stringify(recommend(readRegistry(resolve(root, 'registry/templates.json')), JSON.parse(readFileSync(process.argv[2], 'utf8'))), null, 2));
  } catch (error) { console.error(`ERROR: ${error.message}`); process.exitCode = 1; }
}
