import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateProject } from '../kit/context.mjs';

export const kitRoot=resolve(dirname(fileURLToPath(import.meta.url)),'../kit');
export function makeManifest(skills) {
  const routes=JSON.parse(readFileSync(join(kitRoot,'routes.json'),'utf8'));
  const framework=['nextjs-app-router-practices','typescript-react-routing','react-19-patterns'].find(s=>skills.includes(s));
  if(framework) routes.tasks.ui.skills.push(framework);
  if(skills.includes('backend-engineering')) {
    routes.tasks.backend={mode:'change',skills:['backend-engineering','backend-api-contracts','change-impact']};
    routes.risks.auth.skills.push('backend-security-auth'); routes.risks.database.skills.push('backend-data-persistence');
  }
  const focused = {
    'api-contract-check': ['api'], 'form-checklist': ['forms'],
    'frontend-a11y-check': ['a11y'], 'dependency-update-audit': ['supply-chain'],
    'async-state-safety': ['async'], 'security-review': ['auth'],
    'i18n-audit': ['i18n'], 'performance-audit': ['performance'],
    'test-strategy': ['testing'], 'visual-regression': ['visual'],
    'seo-metadata': ['seo'], 'file-upload-safety': ['uploads'],
    'data-table-patterns': ['tables'], 'permissions-matrix': ['auth'],
    'database-migration-safety': ['database'], 'integration-resilience': ['integration'],
    'observability-check': ['observability'], 'url-state': ['url-state'],
  };
  for (const [skill, risks] of Object.entries(focused)) {
    if (!skills.includes(skill)) continue;
    for (const risk of risks) {
      routes.risks[risk] ??= { skills: [], checks: [`Apply ${skill}; report behavioral evidence and unverified cases.`] };
      routes.risks[risk].skills.push(skill);
    }
    routes.tasks[skill] = { mode: 'read', skills: [skill] };
  }
  if (skills.includes('dependency-update-audit')) routes.tasks.dependency.skills.push('dependency-update-audit');
  return {version:1,skills:[...skills].sort(),...routes};
}
export function checkKit(project) {
  const report=validateProject(project);
  if(readFileSync(join(project,".ai/skills/graphify/scripts/build_graph.py"),"utf8")!==readFileSync(join(kitRoot,"graphify-build.py"),"utf8")) throw new Error("Graphify adapter drift.");
  if(readFileSync(join(project,".github/workflows/ai-contract.yml"),"utf8")!==readFileSync(join(kitRoot,"ai-contract.yml"),"utf8")) throw new Error("Kit CI drift.");
  for(const file of ['context.mjs','WORKFLOW.md']) if(readFileSync(join(project,'.ai',file),'utf8')!==readFileSync(join(kitRoot,file),'utf8')) throw new Error(`Kit drift: ${file}`);
  for(const name of readdirSync(join(kitRoot,'skills'))) if(readFileSync(join(project,'.ai/skills',name,'SKILL.md'),'utf8')!==readFileSync(join(kitRoot,'skills',name,'SKILL.md'),'utf8')) throw new Error(`Kit skill drift: ${name}`);
  const skills=readdirSync(join(project,'.ai/skills'));
  for (const name of skills) {
    const source=join(kitRoot,'domain-skills',name,'SKILL.md');
    if (existsSync(source) && readFileSync(source,'utf8')!==readFileSync(join(project,'.ai/skills',name,'SKILL.md'),'utf8')) throw new Error(`Domain skill drift: ${name}`);
  }
  if(JSON.stringify(JSON.parse(readFileSync(join(project,'.ai/workflows.json'),'utf8')))!==JSON.stringify(makeManifest(skills))) throw new Error('Kit routing drift.');
  return report;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    if(process.argv.length<3) throw new Error('Usage: node scripts/ai-kit.mjs <template-directory> [...]. Read-only drift/contract check.');
    for(const path of process.argv.slice(2)) console.log(JSON.stringify({project:resolve(path),...checkKit(resolve(path))}));
  } catch(error) { console.error(error.message); process.exitCode=1; }
}
