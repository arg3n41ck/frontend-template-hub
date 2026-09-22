import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const lifecycleScripts = new Set(['preinstall', 'install', 'postinstall']);
const allowedFiles = [
  /^bin\/template-agent\.mjs$/,
  /^src\/[a-z0-9-]+\.mjs$/,
  /^skills\/arg3n41ck-frontend-project\/SKILL\.md$/,
  /^scripts\/(create-project|registry|recommend-template|skill-adapters|template-ai-contract)\.mjs$/,
  /^registry\/templates\.json$/,
  /^(README\.md|package\.json|package-lock\.json|LICENSE)$/,
];

export function validatePackageManifest(manifest) {
  if (!manifest || typeof manifest !== 'object') throw new Error('package.json is invalid.');
  for (const key of lifecycleScripts) {
    if (manifest.scripts?.[key]) throw new Error(`Install lifecycle script is forbidden: ${key}`);
  }
  if (manifest.private === true) throw new Error('Public CLI must not be private.');
  if (!manifest.bin?.['template-agent']) throw new Error('template-agent bin is required.');
  return manifest;
}

export function validatePackFiles(files) {
  const names = files.map(file => typeof file === 'string' ? file : file.path);
  const disallowed = names.filter(file => !allowedFiles.some(pattern => pattern.test(file)));
  if (disallowed.length) throw new Error(`Unexpected package files: ${disallowed.join(', ')}`);
  if (!names.includes('registry/templates.json') || !names.includes('skills/arg3n41ck-frontend-project/SKILL.md')) {
    throw new Error('Package is missing the catalog fallback or global skill.');
  }
  return names;
}

export function npmExecutable(platform = process.platform) {
  return platform === 'win32' ? 'npm.cmd' : 'npm';
}

export function preflightPackage(root) {
  const manifest = validatePackageManifest(JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')));
  const packed = JSON.parse(execFileSync(npmExecutable(), ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: root, encoding: 'utf8' }));
  if (!Array.isArray(packed) || packed.length !== 1) throw new Error('npm pack did not return one package.');
  const files = validatePackFiles(packed[0].files || []);
  return { name: manifest.name, version: manifest.version, files: files.length, status: 'pass' };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(preflightPackage(process.argv[2] || resolve(dirname(fileURLToPath(import.meta.url)), '..')))); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
