import process from 'node:process';
import console from 'node:console';
import { readFileSync, readdirSync, realpathSync, lstatSync, existsSync } from 'node:fs';
import { dirname, join, relative, isAbsolute, sep, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const adapters = ['.agents/skills', '.claude/skills', '.codex/skills'];
const key = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
const list = value => Array.isArray(value) && value.every(key) && new Set(value).size === value.length;
const exact = (value, keys) => object(value) && Object.keys(value).every(k => keys.includes(k)) && keys.every(k => Object.hasOwn(value,k));

function local(root, path, directory = false) {
  const resolved = realpathSync(join(root,path)), rel = relative(realpathSync(root),resolved);
  if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error(`Unsafe path: ${path}`);
  const stat = lstatSync(resolved);
  if (directory ? !stat.isDirectory() : !stat.isFile()) throw new Error(`Invalid path type: ${path}`);
  return resolved;
}
const read = (root,path) => readFileSync(local(root,path),'utf8');

export function readManifest(root) {
  const m = JSON.parse(read(root,'.ai/workflows.json'));
  if (!exact(m,['version','skills','tasks','risks']) || m.version !== 1 || !list(m.skills) || !m.skills.length || !object(m.tasks) || !Object.keys(m.tasks).length || !object(m.risks)) throw new Error('Invalid workflow manifest.');
  for (const [name, task] of Object.entries(m.tasks)) {
    if (!key(name) || !exact(task,['mode','skills']) || !['read','change'].includes(task.mode) || !list(task.skills) || task.skills.some(s=>!m.skills.includes(s))) throw new Error(`Invalid task: ${name}`);
  }
  for (const [name, risk] of Object.entries(m.risks)) {
    if (!key(name) || !exact(risk,['skills','checks']) || !list(risk.skills) || risk.skills.some(s=>!m.skills.includes(s)) || !Array.isArray(risk.checks) || !risk.checks.length || risk.checks.some(s=>typeof s !== 'string' || !s.trim())) throw new Error(`Invalid risk: ${name}`);
  }
  return m;
}

export function validateProject(root) {
  const m=readManifest(root);
  for (const name of ['project-documentation-wiki','graphify']) if (!m.skills.includes(name)) throw new Error(`Required knowledge skill missing: ${name}`);
  for (const path of ['AGENTS.md','.ai/context.mjs','.ai/WORKFLOW.md','.codex-harness/AGENT_GRAPH.md','.codex-harness/VERIFICATION.md','.wiki/index.md']) local(root,path);
  const inventory=readdirSync(local(root,'.ai/skills',true)).sort();
  if (JSON.stringify(inventory)!==JSON.stringify([...m.skills].sort())) throw new Error('Skill inventory differs from manifest.');
  for (const name of m.skills) {
    local(root,`.ai/skills/${name}`,true);
    const text=read(root,`.ai/skills/${name}/SKILL.md`);
    const front=text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!front || !front[1].split(/\r?\n/).includes(`name: ${name}`) || !/^description:\s*\S/m.test(front[1])) throw new Error(`Invalid skill metadata: ${name}`);
    for (const adapter of adapters) {
      const folder=join(root,adapter); if (lstatSync(folder).isSymbolicLink()) throw new Error(`Unsafe adapter link: ${adapter}`);
      const forward=read(root,`${adapter}/${name}/SKILL.md`);
      if (!forward.includes(`.ai/skills/${name}/SKILL.md`) || !forward.startsWith(front[0])) throw new Error(`Invalid adapter: ${adapter}/${name}`);
    }
  }
  return {status:'valid',skills:m.skills.length,tasks:Object.keys(m.tasks),risks:Object.keys(m.risks)};
}

export function selectContext(root, name, risks = []) {
  const m=readManifest(root);
  if (!Object.hasOwn(m.tasks,name)) throw new Error(`Unknown task: ${name}`);
  const selected=[...new Set(risks)];
  for (const risk of selected) if (!Object.hasOwn(m.risks,risk)) throw new Error(`Unknown risk: ${risk}`);
  const task=m.tasks[name], names=[...new Set([...task.skills,...selected.flatMap(r=>m.risks[r].skills)])];
  const skills=names.map(s=>`.ai/skills/${s}/SKILL.md`);
  const files=name==='question' && !selected.length ? ['AGENTS.md'] : ['AGENTS.md','.ai/WORKFLOW.md','.codex-harness/AGENT_GRAPH.md','.codex-harness/VERIFICATION.md','.wiki/index.md'];
  for (const path of [...files,...skills]) local(root,path);
  return {task:name,mode:task.mode,risks:selected,files,skills,checks:[...new Set(selected.flatMap(r=>m.risks[r].checks))],
    guidance:'Read paths, not all skill bodies at once. Start with the task workflow and one domain skill; load additional risks when relevant. Verify actual source and select exact commands from VERIFICATION.md. This is routing, not authorization or a guarantee of completeness.'};
}

export function main(args, root=resolve(dirname(fileURLToPath(import.meta.url)),'..')) {
  if (!args.length || args[0]==='--help') { console.log('node .ai/context.mjs --list | --check | --task <name> [--risk <name> ...]\nRead-only JSON output; no commands, installs, model calls or writes.'); return; }
  if (args.length===1 && args[0]==='--check') { console.log(JSON.stringify(validateProject(root),null,2)); return; }
  if (args.length===1 && args[0]==='--list') { console.log(JSON.stringify(readManifest(root),null,2)); return; }
  let task; const risks=[];
  for(let i=0;i<args.length;i++) {
    const flag=args[i], value=args[++i];
    if (!['--task','--risk'].includes(flag) || !value || value.startsWith('-')) throw new Error('Expected --task <name> or --risk <name>.');
    if(flag==='--task') { if(task) throw new Error('Specify one task.'); task=value; } else risks.push(value);
  }
  if(!task) throw new Error('Specify --task.');
  console.log(JSON.stringify(selectContext(root,task,risks),null,2));
}
if(process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1])===fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); } catch(error) { console.error(`ERROR: ${error.message}`); process.exitCode=1; }
}
