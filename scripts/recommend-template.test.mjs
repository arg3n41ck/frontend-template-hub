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


test('generic WebView and explicit MBANK choose distinct source starters', () => {
  assert.equal(recommend(registry, requirements(['webview'])).template, 'webview');
  assert.equal(recommend(registry, requirements(['webview', 'mbank'])).template, 'mbank-webview');
  assert.equal(recommend(registry, requirements(['webview'], ['mbank'])).template, 'webview');
});

test('unknown native host and unsupported WebView SSR do not silently substitute a starter', () => {
  assert.equal(recommend(registry, requirements(['webview', 'unknown-native-host'])).status, 'no-match');
  assert.equal(recommend(registry, requirements(['webview', 'nextjs'])).status, 'no-match');
});

test('existing WebView app is never scaffolded over', () => {
  assert.equal(recommend(registry, { ...requirements(['webview', 'mbank']), existingProject: true }).status, 'existing-project');
});

test('WebView entries are enabled, release-pinned and have isolated knowledge profiles', () => {
  const generic = registry.templates.find(entry => entry.id === 'webview');
  const bank = registry.templates.find(entry => entry.id === 'mbank-webview');
  assert.ok(generic?.enabled && bank?.enabled);
  for (const entry of [generic, bank]) {
    assert.equal(entry.ref, 'v0.1.0');
    assert.match(entry.commit, /^[a-f0-9]{40}$/);
    for (const skill of ['graphify', 'project-documentation-wiki', 'find-skills', 'webview-native-contract', 'webview-layout-keyboard', 'webview-navigation-lifecycle', 'webview-device-qa']) assert.ok(entry.skills.includes(skill));
  }
  assert.equal(generic.skills.length, 44);
  assert.equal(bank.skills.length, 46);
  assert.ok(!generic.skills.some(skill => skill.startsWith('mbank-')));
  assert.ok(bank.skills.includes('mbank-bridge-contract') && bank.skills.includes('mbank-session-payments'));
});
