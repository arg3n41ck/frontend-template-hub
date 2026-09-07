import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { makeManifest } from './ai-kit.mjs';
const common = ['api-contract-check','form-checklist','frontend-a11y-check','dependency-update-audit','async-state-safety','security-review','i18n-audit','performance-audit','test-strategy','visual-regression','file-upload-safety','url-state'];
const scoped = ['seo-metadata','data-table-patterns','permissions-matrix','database-migration-safety','integration-resilience','observability-check'];
test('every new application skill has a selective route, not the question default', () => {
 const m = makeManifest([...common,...scoped]);
 const routed = new Set([...Object.values(m.tasks),...Object.values(m.risks)].flatMap(x=>x.skills));
 for (const name of [...common,...scoped]) assert.ok(routed.has(name), name);
 assert.deepEqual(m.tasks.question.skills, []);
});
test('profile-only skills do not leak into minimal frontend routes', () => {
 const m=makeManifest(common);
 const routed=[...Object.values(m.tasks),...Object.values(m.risks)].flatMap(x=>x.skills);
 for(const name of scoped) assert.ok(!routed.includes(name), name);
});
test('hub maintenance skills are bundled and explicitly discoverable', () => {
 const agents=readFileSync(new URL('../AGENTS.md',import.meta.url),'utf8');
 for(const name of ['template-maintenance','template-release-check','skill-maintenance']) {
  assert.match(readFileSync(new URL(`../.ai/skills/${name}/SKILL.md`,import.meta.url),'utf8'),new RegExp(`name: ${name}`));
  assert.ok(agents.includes(name));
 }
});
test('declared profiles cover every focused source and only existing skills', () => {
 const profiles=JSON.parse(readFileSync(new URL('../kit/skill-profiles.json',import.meta.url),'utf8'));
 const covered=new Set(Object.values(profiles).flat());
 assert.equal(covered.size,21);
 for(const name of covered) assert.ok(readFileSync(new URL(`../kit/domain-skills/${name}/SKILL.md`,import.meta.url),'utf8').includes(`name: ${name}`));
 for(const names of Object.values(profiles)) assert.equal(names.length,new Set(names).size);
 assert.ok(!profiles['frontend-template-react'].includes('database-migration-safety'));
 assert.ok(profiles['frontend-template-fullstack'].includes('database-migration-safety'));
});
