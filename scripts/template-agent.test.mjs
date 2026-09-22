import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { resolveCatalog } from '../src/catalog.mjs';
import { installSkill, uninstallSkill, skillTargets } from '../src/skill-manager.mjs';
import { parseArguments, runCli, validateInteractiveProjectName } from '../src/cli.mjs';
import { formatCliError, formatCreateSuccess, formatTemplates, shouldUseColor } from '../src/terminal-ui.mjs';

const registry = {
  version: 3,
  minCliVersion: '1.0.0',
  templates: [{
    id: 'react-vite',
    name: 'React + Vite',
    description: 'Test template',
    profile: 'frontend-minimal',
    repository: 'https://github.com/arg3n41ck/frontend-template-react.git',
    ref: 'v0.4.0',
    commit: 'a'.repeat(40),
    stack: ['react'],
    skills: ['find-skills'],
    enabled: true,
    selection: { capabilities: ['web-ui'], useWhen: ['Test'], avoidWhen: [], limitations: [], complexity: 1 },
    project: { renamePackage: true, requiredFiles: ['package.json'] },
  }],
};

function workspace(t) {
  const root = mkdtempSync(join(tmpdir(), 'template-agent-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

test('uses a validated remote catalog and saves it as last-known-good cache', async t => {
  const root = workspace(t);
  const result = await resolveCatalog({
    cacheDirectory: join(root, 'cache'),
    bundledRegistry: registry,
    releaseApiUrl: 'https://example.invalid/releases',
    fetchImpl: async url => url.endsWith('/releases')
      ? new Response(JSON.stringify([{ tag_name: 'catalog-v1.0.0', draft: false, prerelease: false, assets: [{ name: 'templates.json', browser_download_url: 'https://example.invalid/catalog.json' }] }]))
      : new Response(JSON.stringify(registry)),
  });
  assert.equal(result.source, 'remote');
  assert.deepEqual(result.registry, registry);
  assert.deepEqual(JSON.parse(readFileSync(join(root, 'cache', 'catalog.json'), 'utf8')), registry);
});

test('uses cached catalog when the release endpoint is unavailable', async t => {
  const root = workspace(t);
  const cache = join(root, 'cache');
  mkdirSync(cache, { recursive: true });
  writeFileSync(join(cache, 'catalog.json'), JSON.stringify(registry));
  const result = await resolveCatalog({
    cacheDirectory: cache,
    bundledRegistry: { ...registry, templates: [] },
    releaseApiUrl: 'https://example.invalid/releases',
    fetchImpl: async () => { throw new Error('offline'); },
    forceRefresh: true,
  });
  assert.equal(result.source, 'cache');
  assert.deepEqual(result.registry, registry);
});

test('rejects a catalog that requires a newer CLI instead of silently downgrading', async t => {
  const root = workspace(t);
  const newer = { ...registry, minCliVersion: '9.0.0' };
  await assert.rejects(() => resolveCatalog({
    cacheDirectory: join(root, 'cache'),
    bundledRegistry: registry,
    releaseApiUrl: 'https://example.invalid/releases',
    fetchImpl: async url => url.endsWith('/releases')
      ? new Response(JSON.stringify([{ tag_name: 'catalog-v9.0.0', draft: false, prerelease: false, assets: [{ name: 'templates.json', browser_download_url: 'https://example.invalid/catalog.json' }] }]))
      : new Response(JSON.stringify(newer)),
  }), /requires CLI/);
});

test('does not downgrade from an incompatible cached catalog to the bundled catalog', async t => {
  const root = workspace(t);
  const cache = join(root, 'cache');
  mkdirSync(cache, { recursive: true });
  writeFileSync(join(cache, 'catalog.json'), JSON.stringify({ ...registry, minCliVersion: '9.0.0' }));
  await assert.rejects(() => resolveCatalog({
    cacheDirectory: cache,
    bundledRegistry: registry,
    releaseApiUrl: 'https://example.invalid/releases',
    fetchImpl: async () => { throw new Error('offline'); },
  }), /requires CLI/);
});

test('installs only its managed global Codex skill and removes it safely', t => {
  const root = workspace(t);
  const source = join(root, 'source-skill.md');
  writeFileSync(source, '---\nname: arg3n41ck-frontend-project\ndescription: Test\n---\n\nTest\n');
  const targets = skillTargets({ home: join(root, 'home'), clients: ['codex'] });
  const installed = installSkill({ targets, source });
  assert.equal(installed[0].status, 'installed');
  assert.match(readFileSync(targets[0].file, 'utf8'), /template-agent:managed/);
  assert.equal(installSkill({ targets, source })[0].status, 'unchanged');
  assert.equal(uninstallSkill({ targets })[0].status, 'removed');
  assert.equal(existsSync(targets[0].file), false);
});

test('refuses to overwrite an unmanaged skill with the same name', t => {
  const root = workspace(t);
  const source = join(root, 'source-skill.md');
  writeFileSync(source, '---\nname: arg3n41ck-frontend-project\ndescription: Test\n---\n');
  const targets = skillTargets({ home: join(root, 'home'), clients: ['codex'] });
  mkdirSync(join(targets[0].directory), { recursive: true });
  writeFileSync(targets[0].file, 'foreign skill');
  assert.throws(() => installSkill({ targets, source }), /Refusing to overwrite/);
  assert.equal(readFileSync(targets[0].file, 'utf8'), 'foreign skill');
});

test('parses non-interactive project creation without asking technical questions', () => {
  assert.deepEqual(parseArguments(['create', 'sales-crm', '--template', 'crm-dashboard']), {
    command: 'create',
    target: 'sales-crm',
    options: { template: 'crm-dashboard' },
  });
  assert.throws(() => parseArguments(['create', '--template']), /needs a value/);
});

test('interactive project names reject traversal and Windows-reserved names', () => {
  assert.equal(validateInteractiveProjectName('sales-crm'), 'sales-crm');
  for (const value of ['../escape', 'nested/project', 'CON', 'report?.txt', '']) {
    assert.throws(() => validateInteractiveProjectName(value));
  }
});

test('interactive template list highlights the number and input prompt only in a terminal', () => {
  const colored = formatTemplates(registry.templates, { color: true, interactive: true });
  const plain = formatTemplates(registry.templates, { color: false, interactive: true });
  assert.match(colored, /\x1b\[33m1\x1b\[0m/);
  assert.match(colored, /Введите номер/);
  assert.doesNotMatch(plain, /\x1b\[/);
  assert.match(plain, /Введите номер/);
});

test('ANSI output is disabled for JSON, NO_COLOR and non-TTY commands', () => {
  assert.equal(shouldUseColor({ isTTY: true, json: false, noColor: false }), true);
  assert.equal(shouldUseColor({ isTTY: true, json: true, noColor: false }), false);
  assert.equal(shouldUseColor({ isTTY: true, json: false, noColor: true }), false);
  assert.equal(shouldUseColor({ isTTY: false, json: false, noColor: false }), false);
});

test('terminal errors are red only when color is enabled', () => {
  assert.match(formatCliError('Wrong template number', { color: true }), /\x1b\[31m/);
  assert.doesNotMatch(formatCliError('Wrong template number', { color: false }), /\x1b\[/);
});

test('project success summary provides safe next commands', () => {
  const summary = formatCreateSuccess({
    target: '/tmp/sales crm',
    entry: { id: 'crm-dashboard', name: 'CRM dashboard' },
    color: true,
  });
  assert.match(summary, /Проект создан/);
  assert.match(summary, /CRM dashboard/);
  assert.match(summary, /cd '\/tmp\/sales crm'/);
  assert.match(summary, /pnpm install/);
  assert.match(summary, /\x1b\[/);
});

test('JSON output stays machine-readable when terminal colors are enabled', async t => {
  const root = workspace(t);
  const output = [];
  await runCli(['setup', '--client', 'codex', '--json'], {
    output: value => output.push(value),
    color: true,
    environment: { home: join(root, 'home') },
  });
  assert.equal(output.length, 1);
  assert.doesNotMatch(output[0], /\x1b\[/);
  assert.equal(JSON.parse(output[0]).skills[0].status, 'installed');
});

test('setup gives a colored success summary when a managed skill is installed', async t => {
  const root = workspace(t);
  const output = [];
  await runCli(['setup', '--client', 'codex'], {
    output: value => output.push(value),
    color: true,
    environment: { home: join(root, 'home') },
  });
  assert.match(output.join('\n'), /AI-skill готов/);
  assert.match(output.join('\n'), /Перезапусти Codex/);
  assert.match(output.join('\n'), /\x1b\[/);
});

test('manual create asks only template and project name', async t => {
  const root = workspace(t);
  const asked = [];
  const result = await runCli(['create', '--dry-run'], {
    cwd: root,
    output: () => {},
    prompt: {
      ask: async question => {
        asked.push(question);
        return asked.length === 1 ? '1' : 'sales-crm';
      },
      close: () => {},
    },
    catalog: {
      bundledRegistry: registry,
      cacheDirectory: join(root, 'cache'),
      releaseApiUrl: 'https://example.invalid/releases',
      fetchImpl: async () => { throw new Error('offline'); },
    },
  });
  assert.equal(result.dryRun, true);
  assert.equal(result.template, 'react-vite');
  assert.equal(asked.length, 2);
});

test('manual creation requires explicit acknowledgement for a third-party source', async t => {
  const root = workspace(t);
  const thirdParty = structuredClone(registry);
  thirdParty.templates[0].repository = 'https://github.com/another-owner/starter.git';
  await assert.rejects(() => runCli(['create', 'third-party', '--template', 'react-vite', '--dry-run'], {
    cwd: root,
    output: () => {},
    catalog: {
      bundledRegistry: thirdParty,
      cacheDirectory: join(root, 'cache'),
      releaseApiUrl: 'https://example.invalid/releases',
      fetchImpl: async () => { throw new Error('offline'); },
    },
  }), /allow-third-party/);
});

test('setup dry-run does not write a global skill', async t => {
  const root = workspace(t);
  const home = join(root, 'home');
  mkdirSync(join(home, '.agents'), { recursive: true });
  const result = await runCli(['setup', '--client', 'codex', '--dry-run'], {
    output: () => {},
    environment: { home },
  });
  assert.equal(result.skills[0].status, 'installed');
  assert.equal(existsSync(join(home, '.agents', 'skills', 'arg3n41ck-frontend-project', 'SKILL.md')), false);
});
