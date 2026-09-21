import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { readManifest, validateTemplateAiContract } from './template-ai-contract.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'template-contract-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const skills = ['project-documentation-wiki', 'graphify', 'change-impact'];
  const files = ['AGENTS.md', '.ai/context.mjs', '.ai/WORKFLOW.md', '.codex-harness/AGENT_GRAPH.md', '.codex-harness/VERIFICATION.md', '.wiki/index.md'];
  for (const file of files) {
    mkdirSync(join(root, file, '..'), { recursive: true });
    writeFileSync(join(root, file), 'fixture\n');
  }
  writeFileSync(join(root, '.ai/workflows.json'), JSON.stringify({ version: 1, skills, tasks: { question: { mode: 'read', skills: [] } }, risks: {} }));
  for (const skill of skills) {
    const frontmatter = `---\nname: ${skill}\ndescription: Use when testing.\n---`;
    mkdirSync(join(root, '.ai/skills', skill), { recursive: true });
    writeFileSync(join(root, '.ai/skills', skill, 'SKILL.md'), `${frontmatter}\n`);
    for (const adapter of ['.agents', '.claude', '.codex']) {
      mkdirSync(join(root, adapter, 'skills', skill), { recursive: true });
      writeFileSync(join(root, adapter, 'skills', skill, 'SKILL.md'), `${frontmatter}\n\nRead .ai/skills/${skill}/SKILL.md\n`);
    }
  }
  return root;
}

test('validates a released template without requiring the hub skill kit', t => {
  const root = fixture(t);
  assert.equal(validateTemplateAiContract(root).skills, readManifest(root).skills.length);
});

test('rejects registry-facing manifest drift', t => {
  const root = fixture(t);
  const file = join(root, '.ai/workflows.json');
  const manifest = JSON.parse(readFileSync(file, 'utf8'));
  manifest.skills.pop();
  writeFileSync(file, JSON.stringify(manifest));
  assert.throws(() => validateTemplateAiContract(root), /inventory/i);
});
