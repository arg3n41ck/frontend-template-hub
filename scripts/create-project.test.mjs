import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync, readFileSync, existsSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { createProject, main } from './create-project.mjs';
import { validateSkillAdapters } from './skill-adapters.mjs';
import { fileURLToPath } from 'node:url';
import { readRegistry } from './registry.mjs';
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'template-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const source = join(root, 'source'); mkdirSync(source);
  for (const file of ['AGENTS.md', 'CLAUDE.md', '.codex-harness/AGENT_GRAPH.md', '.codex-harness/VERIFICATION.md', '.ai/skills/find-skills/SKILL.md', 'pnpm-lock.yaml']) {
    mkdirSync(join(source, file, '..'), { recursive: true });
    writeFileSync(join(source, file), file.endsWith('SKILL.md') ? '---\nname: find-skills\ndescription: Use when finding skills.\n---\n\nFixture skill.\n' : 'fixture\n');
  }
  writeFileSync(join(source, 'package.json'), '{"name":"fixture","private":true}');
  for (const adapter of ['.agents', '.claude', '.codex']) {
    mkdirSync(join(source, adapter)); writeFileSync(join(source, adapter, 'skills'), '../.ai/skills'); // Git core.symlinks=false representation.
  }
  git(source, 'init', '-q', '-b', 'main');
  git(source, 'add', '.');
  git(source, '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'fixture');
  git(source, 'tag', 'v0.2.0');
  const entry = { id: 'test', name: 'Test', description: 'Test fixture', profile: 'test', stack: ['react'], repository: './source', ref: 'v0.2.0', commit: git(source, 'rev-parse', 'HEAD'), skills: ['find-skills'], enabled: true, selection: { capabilities: ['web-ui'], useWhen: ['Test UI'], avoidWhen: [], limitations: [], complexity: 1 }, project: { renamePackage: true, requiredFiles: ['package.json', 'pnpm-lock.yaml'] } };
  return { root, source, entry, target: join(root, 'My App') };
}

test('materializes portable skills, new history, package name, brief and exact provenance', t => {
  const f = fixture(t);
  const result = createProject({ ...f, hubRoot: f.root, brief: 'CRM: backend exists; $(never execute)\n' });
  assert.equal(result.commit, f.entry.commit);
  assert.equal(JSON.parse(readFileSync(join(f.target, 'package.json'))).name, 'my-app');
  assert.equal(git(f.target, 'remote'), '');
  assert.throws(() => git(f.target, 'rev-parse', '--verify', 'HEAD'));
  assert.equal(git(f.target, 'symbolic-ref', '--short', 'HEAD'), 'main');
  validateSkillAdapters(f.target, f.entry.skills);
  assert.match(readFileSync(join(f.target, 'docs/PROJECT_BRIEF.md'), 'utf8'), /backend exists/);
  assert.equal(readFileSync(join(f.target, 'docs/PROJECT_BRIEF.md'), 'utf8').endsWith('\n\n'), false);
  assert.deepEqual(JSON.parse(readFileSync(join(f.target, '.template-provenance.json'))), result);
});

test('refuses existing files, directories and dangling symlinks without touching them', t => {
  const f = fixture(t);
  for (const kind of (process.platform === 'win32' ? ['file', 'directory'] : ['file', 'directory', 'symlink'])) {
    const target = join(f.root, kind);
    if (kind === 'file') writeFileSync(target, 'preserve');
    if (kind === 'directory') mkdirSync(target);
    if (kind === 'symlink') symlinkSync('missing', target);
    assert.throws(() => createProject({ ...f, hubRoot: f.root, target }), /already exists/);
  }
  assert.equal(readFileSync(join(f.root, 'file'), 'utf8'), 'preserve');
});

test('rejects missing source, missing tag, missing skill and changed commit pin before materialization', t => {
  const f = fixture(t);
  for (const patch of [{ repository: './missing' }, { ref: 'v9.9.9' }, { skills: ['missing'] }, { commit: '0'.repeat(40) }]) {
    assert.throws(() => createProject({ ...f, entry: { ...f.entry, ...patch }, hubRoot: f.root }));
    assert.equal(existsSync(f.target), false);
  }
});

test('can explicitly preserve template history', t => {
  const f = fixture(t);
  createProject({ ...f, hubRoot: f.root, keepHistory: true });
  assert.equal(git(f.target, 'rev-parse', 'HEAD'), f.entry.commit);
  assert.equal(git(f.target, 'remote'), 'origin');
});

test('registry rejects injection, hook fields, duplicate IDs and malformed pins', t => {
  const f = fixture(t);
  const file = join(f.root, 'registry.json');
  writeFileSync(file, JSON.stringify({ version: 2, templates: [f.entry] }));
  assert.equal(readRegistry(file).templates.length, 1);
  for (const patch of [{ repository: '--upload-pack=bad' }, { ref: 'main' }, { commit: '123' }, { postInstall: 'bad' }, { skills: ['../escape'] }]) {
    writeFileSync(file, JSON.stringify({ version: 2, templates: [{ ...f.entry, ...patch }] }));
    assert.throws(() => readRegistry(file));
  }
  writeFileSync(file, JSON.stringify({ version: 2, templates: [f.entry, f.entry] }));
  assert.throws(() => readRegistry(file), /duplicate/);
});

test('CLI rejects missing or unknown arguments without prompting', () => {
  for (const args of [[], ['--template'], ['a', '--bad'], ['a', 'b'], ['a', '--template', 'missing']]) assert.throws(() => main(args));
});

test('failed materialization cleans only its own target', t => {
  const f = fixture(t);
  writeFileSync(join(f.source, 'package.json'), 'invalid JSON');
  git(f.source, 'add', '.');
  git(f.source, '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'invalid fixture');
  git(f.source, 'tag', 'v0.3.0');
  assert.throws(() => createProject({ ...f, entry: { ...f.entry, ref: 'v0.3.0', commit: git(f.source, 'rev-parse', 'HEAD') }, hubRoot: f.root }));
  assert.equal(existsSync(f.target), false);
  assert.equal(existsSync(f.source), true);
});

test('remote registries require an exact commit pin', t => {
  const f = fixture(t);
  const file = join(f.root, 'registry.json');
  const entry = { ...f.entry, repository: 'git@github.com:owner/template.git' };
  delete entry.commit;
  writeFileSync(file, JSON.stringify({ version: 2, templates: [entry] }));
  assert.throws(() => readRegistry(file), /commit pin/);
});

test('CLI runs through a symlinked hub path from a different working directory', t => {
  const f = fixture(t);
  const link = join(f.root, 'linked-hub');
  symlinkSync(fileURLToPath(new URL('..', import.meta.url)), link, 'junction');
  const output = execFileSync(process.execPath, [join(link, 'scripts/create-project.mjs'), '--list'], { cwd: f.root, encoding: 'utf8' });
  assert.match(output, /crm-dashboard/);
  assert.match(output, /fullstack-next-nest/);
});

test('module can be imported by a stdin verification script without invoking CLI', () => {
  const moduleUrl = new URL('./create-project.mjs', import.meta.url).href;
  const output = execFileSync(process.execPath, ['--input-type=module', '-'], {
    input: `await import(${JSON.stringify(moduleUrl)}); console.log('import-only');`, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
  });
  assert.equal(output.trim(), 'import-only');
});

test('disabled template cannot be generated even when called directly', t => {
  const f = fixture(t);
  assert.throws(() => createProject({ ...f, entry: { ...f.entry, enabled: false } }), /disabled/);
  assert.equal(existsSync(f.target), false);
});

test('new non-JavaScript template works without a package.json or generator changes', t => {
  const f = fixture(t);
  rmSync(join(f.source, 'package.json')); rmSync(join(f.source, 'pnpm-lock.yaml'));
  writeFileSync(join(f.source, 'index.html'), '<h1>Static template</h1>');
  git(f.source, 'add', '.');
  git(f.source, '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'static template');
  git(f.source, 'tag', 'v0.4.0');
  const entry = { ...f.entry, id: 'static-html', ref: 'v0.4.0', commit: git(f.source, 'rev-parse', 'HEAD'), project: { renamePackage: false, requiredFiles: ['index.html'] } };
  const metadata = createProject({ ...f, entry, hubRoot: f.root });
  assert.equal(metadata.template, 'static-html');
  assert.equal(existsSync(join(f.target, 'package.json')), false);
  assert.match(readFileSync(join(f.target, 'index.html'), 'utf8'), /Static template/);
  validateSkillAdapters(f.target, entry.skills);
});

test('registry rejects unsafe contract paths and embedded HTTPS credentials', t => {
  const f = fixture(t); const file = join(f.root, 'registry.json');
  for (const patch of [
    { repository: 'https://user:secret@example.com/template.git' },
    { repository: 'https://example.com/template.git?token=secret' },
    ...['../outside', '/etc/passwd', '.git/config', 'dir/../../outside', 'C:\\secret'].map(path => ({ project: { renamePackage: false, requiredFiles: [path] } })),
  ]) {
    writeFileSync(file, JSON.stringify({ version: 2, templates: [{ ...f.entry, ...patch }] }));
    assert.throws(() => readRegistry(file));
  }
});

test('new Git hosts require only a registry change', t => {
  const f = fixture(t); const file = join(f.root, 'registry.json');
  for (const repository of ['https://gitlab.example.org/team/nested/template.git', 'git@gitlab.example.org:team/template.git']) {
    writeFileSync(file, JSON.stringify({ version: 2, templates: [{ ...f.entry, repository }] }));
    assert.equal(readRegistry(file).templates[0].repository, repository);
  }
});
