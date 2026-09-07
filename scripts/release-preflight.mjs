import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, lstatSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkKit } from './ai-kit.mjs';
const policy=readFileSync(new URL('../kit/release.gitignore',import.meta.url),'utf8');
export function preflight(root) {
 root=resolve(root);
 if(!readFileSync(join(root,'.gitignore'),'utf8').endsWith(policy)) throw new Error('Shared release ignore policy differs.');
 const listed=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
 const files=[...new Set(listed)].filter(f=>existsSync(join(root,f))&&lstatSync(join(root,f)).isFile());
 const forbidden=/(^|\/)(node_modules|dist|\.next|__pycache__|\.omx|\.venv-graphify|graphify-out)(\/|$)|(^|\/)\.env(?!\.example$)(\.|$)|\.(pyc|tsbuildinfo|log|pem|key)$/;
 const secret=/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{36,}\b|\bgithub_pat_[A-Za-z0-9_]{60,}\b/;
 const findings=[];let bytes=0;
 for(const file of files) {
  if(forbidden.test(file)) findings.push({file,reason:'runtime or sensitive filename'});
  const data=readFileSync(join(root,file));bytes+=data.length;
  if(!data.includes(0)&&secret.test(data.toString('utf8'))) findings.push({file,reason:'possible private key or token; inspect without printing value'});
 }
 if(findings.length) throw new Error(JSON.stringify(findings));
 if(existsSync(join(root,'.ai/workflows.json'))) checkKit(root);
 return {root,files:files.length,bytes,status:'pass',scope:'working-tree candidates, not Git history or a comprehensive secret scanner'};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 try {if(process.argv.length<3)throw new Error('Usage: node scripts/release-preflight.mjs <repo> [...]');for(const path of process.argv.slice(2))console.log(JSON.stringify(preflight(path)));}
 catch(error){console.error(error.message);process.exitCode=1;}
}
