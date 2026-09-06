import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readRegistry } from './registry.mjs';
const file = process.argv[2] ?? resolve(dirname(fileURLToPath(import.meta.url)), '../registry/templates.json');
const registry = readRegistry(file);
console.log(`Registry valid: ${registry.templates.length} templates.`);
