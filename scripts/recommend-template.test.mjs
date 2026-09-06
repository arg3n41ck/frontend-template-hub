import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readRegistry, availableTemplates } from './registry.mjs';
import { recommend } from './recommend-template.mjs';
import { fileURLToPath } from 'node:url';

const registry = readRegistry(fileURLToPath(new URL('../registry/templates.json', import.meta.url)));
const requirements = (required = [], excluded = [], preferred = []) => ({ requiredCapabilities: required, excludedCapabilities: excluded, preferredCapabilities: preferred });

for (const [label, input, expected] of [
  ['layout only, no backend', requirements(['web-ui'], ['api-service']), 'react-vite'],
  ['CRM dashboard with existing API', requirements(['dashboard'], ['api-service']), 'crm-dashboard'],
  ['explicit Next / server rendering', requirements(['nextjs', 'server-rendering'], ['api-service']), 'next'],
  ['own backend and database', requirements(['api-service', 'postgresql']), 'fullstack-next-nest'],
]) test(label, () => assert.equal(recommend(registry, input).template, expected));

test('conflicting Next + ready dashboard is not silently downgraded', () => {
  const result = recommend(registry, requirements(['nextjs', 'dashboard']));
  assert.equal(result.status, 'no-match'); assert.equal(result.template, undefined);
});

test('existing project is never automatically scaffolded', () => assert.equal(recommend(registry, { ...requirements(['web-ui']), existingProject: true }).status, 'existing-project'));

test('fifth template is immediately eligible without selector code changes', () => {
  const extra = { ...registry.templates[0], id: 'astro-content', selection: { ...registry.templates[0].selection, capabilities: ['web-ui', 'astro', 'content-site'] } };
  assert.equal(recommend({ ...registry, templates: [...registry.templates, extra] }, requirements(['astro'])).template, 'astro-content');
});

test('disabled and removed templates cannot be recommended', () => {
  const changed = { ...registry, templates: registry.templates.map(x => ({ ...x, enabled: false })) };
  assert.equal(availableTemplates(changed).length, 0);
  assert.equal(recommend(changed, requirements(['web-ui'])).status, 'no-match');
  assert.equal(recommend({ ...registry, templates: [] }, requirements(['web-ui'])).status, 'no-match');
});

test('equally suitable entries produce ambiguity, not array-order choice', () => {
  const entry = registry.templates[0];
  assert.equal(recommend({ ...registry, templates: [entry, { ...entry, id: 'same-fit' }] }, requirements(['web-ui'])).status, 'ambiguous');
});

test('invalid and contradictory constraints fail closed', () => {
  assert.throws(() => recommend(registry, { requiredCapabilities: 'next' }));
  assert.throws(() => recommend(registry, { ...requirements(), run: 'command' }));
  assert.equal(recommend(registry, requirements(['nextjs'], ['nextjs'])).status, 'conflicting-requirements');
});
