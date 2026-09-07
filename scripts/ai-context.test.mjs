import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { selectContext, validateProject } from '../kit/context.mjs';
import { makeManifest, kitRoot, checkKit } from './ai-kit.mjs';
import { cpSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { writeSkillAdapters } from './skill-adapters.mjs';

const manifest = { version: 1, skills: ['project-documentation-wiki', 'graphify', 'change-impact'],
  tasks: { question: { mode: 'read', skills: [] }, feature: { mode: 'change', skills: ['change-impact'] } },
  risks: { auth: { skills: ['change-impact'], checks: ['server authorization; cross-tenant denial'] } } };
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'ai-context-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const file of ['AGENTS.md', '.ai/context.mjs', '.ai/WORKFLOW.md', '.ai/workflows.json', '.codex-harness/AGENT_GRAPH.md', '.codex-harness/VERIFICATION.md', '.wiki/index.md']) {
    mkdirSync(join(root, file, '..'), { recursive: true }); writeFileSync(join(root, file), file.endsWith('.json') ? JSON.stringify(manifest) : 'Fixture\n');
  }
  for (const name of manifest.skills) { mkdirSync(join(root, '.ai/skills', name), {recursive:true}); writeFileSync(join(root, '.ai/skills', name, 'SKILL.md'), `---\nname: ${name}\ndescription: Use when testing.\n---\n`); }
  writeSkillAdapters(root, manifest.skills);
  return root;
}
test('read-only question selects no workflow and does not rewrite files', t => {
  const root = fixture(t), before = readFileSync(join(root,'.ai/workflows.json'),'utf8');
  const result = selectContext(root, 'question', []);
  assert.equal(result.mode,'read'); assert.deepEqual(result.skills,[]); assert.deepEqual(result.files,['AGENTS.md']);
  assert.equal(readFileSync(join(root,'.ai/workflows.json'),'utf8'),before);
});
test('risk selection adds concrete checks and deduplicates skills', t => {
  const result = selectContext(fixture(t),'feature',['auth','auth']);
  assert.deepEqual(result.skills,['.ai/skills/change-impact/SKILL.md']); assert.equal(result.checks.length,1);
  assert.ok(result.files.includes('.ai/WORKFLOW.md'));
});
test('unknown task or risk fails instead of silently choosing', t => {
  const root=fixture(t); assert.throws(()=>selectContext(root,'magical',[]),/Unknown task/);
  assert.throws(()=>selectContext(root,'feature',['typo']),/Unknown risk/);
});
test('validation rejects missing skill, unlisted skill and invalid forwarding files',t=>{
  const root=fixture(t); assert.equal(validateProject(root).skills,3);
  const file=join(root,'.agents/skills/graphify/SKILL.md'); const old=readFileSync(file,'utf8');
  writeFileSync(file,'broken'); assert.throws(()=>validateProject(root),/adapter/i); writeFileSync(file,old);
  mkdirSync(join(root,'.ai/skills/unlisted')); assert.throws(()=>validateProject(root),/inventory/i); rmSync(join(root,'.ai/skills/unlisted'),{recursive:true});
  rmSync(join(root,'.ai/skills/graphify/SKILL.md')); assert.throws(()=>validateProject(root));
});
test('schema rejects traversal, undeclared skill, unknown fields and invalid mode',t=>{
  const root=fixture(t), file=join(root,'.ai/workflows.json');
  for(const patch of [{skills:['../escape']},{tasks:{feature:{mode:'change',skills:['absent']}}},{postInstall:'unsafe'},{tasks:{feature:{mode:'execute',skills:[]}}}]) {
    writeFileSync(file,JSON.stringify({...manifest,...patch})); assert.throws(()=>validateProject(root));
  }
});
test('validation rejects out-of-project directory links before reading skills',t=>{
  const root=fixture(t), outside=mkdtempSync(join(tmpdir(),'ai-outside-')); t.after(()=>rmSync(outside,{recursive:true,force:true}));
  const folder=join(root,'.ai/skills/graphify'); rmSync(folder,{recursive:true}); symlinkSync(outside,folder,'junction');
  assert.throws(()=>validateProject(root),/Unsafe/);
});

test('risk flags do not turn read intent into permission to change',t=>{
 const result=selectContext(fixture(t),'question',['auth']); assert.equal(result.mode,'read');
 assert.ok(result.guidance.includes('not authorization'));
});
test('manifest and adapter symlink escape fail closed',t=>{
 const root=fixture(t), outside=mkdtempSync(join(tmpdir(),'ai-other-')); t.after(()=>rmSync(outside,{recursive:true,force:true}));
 const directory=join(root,'.agents/skills'); rmSync(directory,{recursive:true}); symlinkSync(outside,directory,'junction');
 assert.throws(()=>validateProject(root),/Unsafe/);
});

function kitFixture(t, backend = false) {
 const root=fixture(t), routes=JSON.parse(readFileSync(join(kitRoot,'routes.json'),'utf8'));
 const skills=[...new Set([...manifest.skills,...Object.values(routes.tasks).flatMap(v=>v.skills),...Object.values(routes.risks).flatMap(v=>v.skills),'react-19-patterns',...(backend?['backend-engineering','backend-api-contracts','backend-security-auth','backend-data-persistence']:[])])];
 for(const name of skills) { mkdirSync(join(root,'.ai/skills',name),{recursive:true}); writeFileSync(join(root,'.ai/skills',name,'SKILL.md'),`---\nname: ${name}\ndescription: Use when testing.\n---\n`); }
 mkdirSync(join(root,'.ai/skills/graphify/scripts'),{recursive:true}); cpSync(join(kitRoot,'graphify-build.py'),join(root,'.ai/skills/graphify/scripts/build_graph.py'));
 mkdirSync(join(root,'.github/workflows'),{recursive:true}); cpSync(join(kitRoot,'ai-contract.yml'),join(root,'.github/workflows/ai-contract.yml'));
 for(const file of ['context.mjs','WORKFLOW.md']) cpSync(join(kitRoot,file),join(root,'.ai',file));
 cpSync(join(kitRoot,'skills'),join(root,'.ai/skills'),{recursive:true});
 // Include unreferenced end-of-task skills too: bundling differs from route selection.
 const all=[...new Set([...skills,'task-handoff','release-readiness','parallel-work','change-impact','browser-qa'])];
 writeFileSync(join(root,'.ai/workflows.json'),JSON.stringify(makeManifest(all)));
 writeSkillAdapters(root,all); return root;
}
test('every common task and risk resolves existing skills in a standalone kit',t=>{
 const root=kitFixture(t), m=makeManifest(JSON.parse(readFileSync(join(root,'.ai/workflows.json'),'utf8')).skills);
 assert.equal(checkKit(root).status,'valid');
 for(const task of Object.keys(m.tasks)) for(const risk of Object.keys(m.risks)) assert.ok(selectContext(root,task,[risk]).files.length);
 const ui=selectContext(root,'ui',['shared-ui']); assert.ok(ui.skills.some(s=>s.includes('react-19-patterns')));
});
test('database risk does not scaffold or select backend workflows in a frontend-only kit',t=>{
 const frontend=kitFixture(t), fullstack=kitFixture(t,true);
 assert.throws(()=>selectContext(frontend,'backend',[]),/Unknown task/);
 assert.ok(!selectContext(frontend,'feature',['database']).skills.some(s=>s.includes('backend-')));
 assert.ok(selectContext(fullstack,'backend',['auth','database']).skills.some(s=>s.includes('backend-security-auth')));
});
test('standalone CLI works from another cwd and a symlinked project path; rejects unknown flags',t=>{
 const root=kitFixture(t), link=join(root,'link'); symlinkSync(root,link,'junction');
 const command=join(link,'.ai/context.mjs');
 const result=JSON.parse(execFileSync(process.execPath,[command,'--task','question'],{cwd:tmpdir(),encoding:'utf8'}));
 assert.deepEqual(result.skills,[]);
 assert.throws(()=>execFileSync(process.execPath,[command,'--execute','anything'],{stdio:'pipe'}));
});
test('drift checker rejects a modified common workflow',t=>{
 const root=kitFixture(t); writeFileSync(join(root,'.ai/WORKFLOW.md'),'drift'); assert.throws(()=>checkKit(root),/drift/i);
});
