import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const registryPath = resolve(process.argv[2] ?? 'registry/templates.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

if (registry.version !== 1 || !Array.isArray(registry.templates)) {
  throw new Error('Registry must contain version: 1 and templates: [].');
}

const ids = new Set();
let placeholders = 0;

for (const template of registry.templates) {
  if (!template.id || !/^[a-z0-9-]+$/.test(template.id)) {
    throw new Error('Each template id must use lowercase letters, digits, and hyphens.');
  }
  if (ids.has(template.id)) {
    throw new Error('Duplicate template id: ' + template.id);
  }
  ids.add(template.id);

  if (!template.name || !template.description) {
    throw new Error('Template ' + template.id + ' must have name and description.');
  }

  if (!Array.isArray(template.stack) || template.stack.length === 0) {
    throw new Error('Template ' + template.id + ' must declare a non-empty stack array.');
  }
  if (!template.profile || !/^[a-z0-9-]+$/.test(template.profile)) {
    throw new Error('Template ' + template.id + ' must declare a valid AI profile.');
  }

  const configured = Boolean(template.repository || template.ref);
  if (configured && (!template.repository || !template.ref)) {
    throw new Error('Template ' + template.id + ' must define both repository and ref.');
  }
  if (!configured) placeholders += 1;
  if (template.ref && !/^v\d+\.\d+\.\d+$/.test(template.ref)) {
    throw new Error('Template ' + template.id + ' ref must be an immutable semver tag.');
  }
}

console.log('Registry valid: ' + registry.templates.length + ' template(s), ' + placeholders + ' placeholder(s).');
