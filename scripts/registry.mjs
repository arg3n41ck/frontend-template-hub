import { readFileSync } from 'node:fs';

export function readRegistry(file) {
  const registry = JSON.parse(readFileSync(file, 'utf8'));
  if (registry.version !== 1 || !Array.isArray(registry.templates) || !registry.templates.length) {
    throw new Error('Registry requires version 1 and a non-empty templates array.');
  }
  const ids = new Set();
  for (const entry of registry.templates) {
    if (!/^[a-z0-9-]+$/.test(entry.id ?? '') || ids.has(entry.id)) throw new Error('Invalid/duplicate template ID.');
    ids.add(entry.id);
    for (const key of ['name', 'description', 'profile', 'repository', 'ref']) {
      if (typeof entry[key] !== 'string' || !entry[key].trim()) throw new Error(`Missing ${key}: ${entry.id}`);
    }
    if (!/^v\d+\.\d+\.\d+$/.test(entry.ref)) throw new Error('Use a versioned release tag.');
    if (entry.commit !== undefined && !/^[a-f0-9]{40}$/.test(entry.commit)) throw new Error('Invalid commit pin.');
    if (!entry.repository.startsWith('.') && !entry.commit) throw new Error('Remote releases require a commit pin.');
    if (!Array.isArray(entry.stack) || !entry.stack.length || entry.stack.some(x => typeof x !== 'string')) throw new Error('Invalid stack.');
    if (!Array.isArray(entry.skills) || !entry.skills.length || entry.skills.some(x => !/^[a-z0-9-]+$/.test(x))) throw new Error('Invalid skills.');
    if (!/^[a-z0-9-]+$/.test(entry.profile)) throw new Error('Invalid profile.');
    if (!/^(git@github\.com:[\w.-]+\/[\w.-]+\.git|https:\/\/github\.com\/[\w.-]+\/[\w.-]+(?:\.git)?|\.\.?\/[^\s]+)$/.test(entry.repository)) {
      throw new Error('Repository must be a GitHub SSH/HTTPS URL or explicit relative development path.');
    }
    for (const key of ['postInstall', 'hooks', 'command', 'commands']) {
      if (key in entry) throw new Error('Executable registry fields are forbidden.');
    }
  }
  return registry;
}
