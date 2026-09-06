import { readFileSync } from 'node:fs';

const token = value => typeof value === 'string' && /^[a-z0-9-]+$/.test(value);
const strings = value => Array.isArray(value) && value.every(x => typeof x === 'string' && x.trim());
const tokens = value => strings(value) && value.every(token) && new Set(value).size === value.length;
export const safePath = value => typeof value === 'string' && value.length > 0 && !value.includes('\\') && !value.startsWith('/') && !value.includes(':') && value.split('/').every(p => p && !['.', '..', '.git'].includes(p));

function validRepository(value) {
  if (/^\.\.?\/[^\s]+$/.test(value)) return true; // Explicit local test/development source.
  if (/^git@[a-zA-Z0-9.-]+:[\w./-]+$/.test(value)) return !value.includes('/../');
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password && !url.search && !url.hash && url.pathname !== '/' && !/\s/.test(value);
  } catch { return false; }
}

export function readRegistry(file) {
  const registry = JSON.parse(readFileSync(file, 'utf8'));
  if (registry.version !== 2 || !Array.isArray(registry.templates)) throw new Error('Registry requires version 2 and templates array.');
  const ids = new Set();
  const allowed = new Set(['id', 'name', 'description', 'profile', 'repository', 'ref', 'commit', 'stack', 'skills', 'enabled', 'selection', 'project']);
  for (const entry of registry.templates) {
    if (!entry || typeof entry !== 'object' || !token(entry.id) || ids.has(entry.id)) throw new Error('Invalid/duplicate template ID.');
    ids.add(entry.id);
    if (Object.keys(entry).some(key => !allowed.has(key))) throw new Error('Unknown registry field; executable hooks are forbidden.');
    for (const key of ['name', 'description', 'profile', 'repository', 'ref']) {
      if (typeof entry[key] !== 'string' || !entry[key].trim()) throw new Error(`Missing ${key}: ${entry.id}`);
    }
    if (typeof entry.enabled !== 'boolean') throw new Error('enabled must be boolean.');
    if (!/^v\d+\.\d+\.\d+$/.test(entry.ref)) throw new Error('Use a versioned release tag.');
    if (entry.commit !== undefined && !/^[a-f0-9]{40}$/.test(entry.commit)) throw new Error('Invalid commit pin.');
    if (!entry.repository.startsWith('.') && !entry.commit) throw new Error('Remote releases require a commit pin.');
    if (!tokens(entry.stack) || !entry.stack.length || !tokens(entry.skills) || !entry.skills.length || !token(entry.profile)) throw new Error('Invalid stack, skills or profile.');
    if (!validRepository(entry.repository)) throw new Error('Use HTTPS, Git SSH or an explicit relative development source; never embedded credentials.');
    const s = entry.selection;
    if (!s || Object.keys(s).some(k => !['capabilities', 'useWhen', 'avoidWhen', 'limitations', 'complexity'].includes(k)) || !tokens(s.capabilities) || !s.capabilities.length || !strings(s.useWhen) || !s.useWhen.length || !strings(s.avoidWhen) || !strings(s.limitations) || !Number.isInteger(s.complexity) || s.complexity < 1) throw new Error('Invalid selection metadata.');
    const p = entry.project;
    if (!p || Object.keys(p).some(k => !['renamePackage', 'requiredFiles'].includes(k)) || typeof p.renamePackage !== 'boolean' || !Array.isArray(p.requiredFiles) || !p.requiredFiles.every(safePath)) throw new Error('Invalid project contract.');
    if (p.renamePackage && !p.requiredFiles.includes('package.json')) throw new Error('Renaming requires root package.json in requiredFiles.');
  }
  return registry;
}

export const availableTemplates = registry => registry.templates.filter(entry => entry.enabled);
