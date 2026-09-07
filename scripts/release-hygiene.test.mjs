import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
// Test the distributed ignore policy, without any maintainer-global or .git/info exclusions.
test('distributed ignore policy protects fresh community checkouts', t => {
 const dir=mkdtempSync(join(tmpdir(),'template-hygiene-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const env={...process.env,GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:join(dir,'absent-config')};
 execFileSync('git',['init','-q',dir],{env});
 writeFileSync(join(dir,'.gitignore'),readFileSync(new URL('../kit/release.gitignore',import.meta.url)));
 for(const file of ['.env','.env.staging','.omx/state.json','.codebase-memory/graph.db','node_modules/x','dist/x','.next/x','__pycache__/x.pyc','.claude/settings.local.json','test-results/x','secrets.pem']) {
  assert.equal(spawnSync('git',['check-ignore','-q','--',file],{cwd:dir,env}).status,0,file);
 }
 for(const file of ['.env.example','src/App.tsx','.ai/skills/url-state/SKILL.md','.agents/skills/url-state/SKILL.md','pnpm-lock.yaml']) {
  assert.equal(spawnSync('git',['check-ignore','-q','--',file],{cwd:dir,env}).status,1,file);
 }
});

test('preflight rejects a force-tracked secret filename', async t => {
 const { preflight }=await import('./release-preflight.mjs');
 const dir=mkdtempSync(join(tmpdir(),'release-candidate-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 execFileSync('git',['init','-q',dir]);
 writeFileSync(join(dir,'.gitignore'),readFileSync(new URL('../kit/release.gitignore',import.meta.url)));
 assert.equal(preflight(dir).status,'pass');
 writeFileSync(join(dir,'.env'),'EXAMPLE_ONLY=true\n');
 execFileSync('git',['add','-f','.env'],{cwd:dir});
 assert.throws(()=>preflight(dir),/sensitive filename/);
});
