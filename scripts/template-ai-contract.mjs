import { lstatSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { isAbsolute, join, relative, sep } from 'node:path';

const adapters = ['.agents/skills', '.claude/skills', '.codex/skills'];
const key = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
const list = value => Array.isArray(value) && value.every(key) && new Set(value).size === value.length;
const exact = (value, keys) => object(value) && Object.keys(value).every(key => keys.includes(key)) && keys.every(key => Object.hasOwn(value, key));

function local(root, path, directory = false) {
  const resolved = realpathSync(join(root, path));
  const rel = relative(realpathSync(root), resolved);
  if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error(`Unsafe path: ${path}`);
  const stat = lstatSync(resolved);
  if (directory ? !stat.isDirectory() : !stat.isFile()) throw new Error(`Invalid path type: ${path}`);
  return resolved;
}

const read = (root, path) => readFileSync(local(root, path), 'utf8');

export function readManifest(root) {
  const manifest = JSON.parse(read(root, '.ai/workflows.json'));
  if (!exact(manifest, ['version', 'skills', 'tasks', 'risks']) || manifest.version !== 1 || !list(manifest.skills) || !manifest.skills.length || !object(manifest.tasks) || !Object.keys(manifest.tasks).length || !object(manifest.risks)) {
    throw new Error('Invalid workflow manifest.');
  }
  for (const [name, task] of Object.entries(manifest.tasks)) {
    if (!key(name) || !exact(task, ['mode', 'skills']) || !['read', 'change'].includes(task.mode) || !list(task.skills) || task.skills.some(skill => !manifest.skills.includes(skill))) throw new Error(`Invalid task: ${name}`);
  }
  for (const [name, risk] of Object.entries(manifest.risks)) {
    if (!key(name) || !exact(risk, ['skills', 'checks']) || !list(risk.skills) || risk.skills.some(skill => !manifest.skills.includes(skill)) || !Array.isArray(risk.checks) || !risk.checks.length || risk.checks.some(check => typeof check !== 'string' || !check.trim())) throw new Error(`Invalid risk: ${name}`);
  }
  return manifest;
}

export function validateTemplateAiContract(root) {
  const manifest = readManifest(root);
  for (const name of ['project-documentation-wiki', 'graphify']) {
    if (!manifest.skills.includes(name)) throw new Error(`Required knowledge skill missing: ${name}`);
  }
  for (const path of ['AGENTS.md', '.ai/context.mjs', '.ai/WORKFLOW.md', '.codex-harness/AGENT_GRAPH.md', '.codex-harness/VERIFICATION.md', '.wiki/index.md']) local(root, path);
  const inventory = readdirSync(local(root, '.ai/skills', true)).sort();
  if (JSON.stringify(inventory) !== JSON.stringify([...manifest.skills].sort())) throw new Error('Skill inventory differs from manifest.');
  for (const name of manifest.skills) {
    const text = read(root, `.ai/skills/${name}/SKILL.md`);
    const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter || !frontmatter[1].split(/\r?\n/).includes(`name: ${name}`) || !/^description:\s*\S/m.test(frontmatter[1])) throw new Error(`Invalid skill metadata: ${name}`);
    for (const adapter of adapters) {
      const adapterPath = join(root, adapter);
      if (lstatSync(adapterPath).isSymbolicLink()) throw new Error(`Unsafe adapter link: ${adapter}`);
      local(root, adapter, true);
      const forward = read(root, `${adapter}/${name}/SKILL.md`);
      if (!forward.includes(`.ai/skills/${name}/SKILL.md`) || !forward.startsWith(frontmatter[0])) throw new Error(`Invalid adapter: ${adapter}/${name}`);
    }
  }
  return { status: 'valid', skills: manifest.skills.length };
}
