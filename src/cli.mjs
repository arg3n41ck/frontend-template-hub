import { existsSync, readFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { dirname, isAbsolute, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProject } from '../scripts/create-project.mjs';
import { availableTemplates, readRegistry } from '../scripts/registry.mjs';
import { recommend } from '../scripts/recommend-template.mjs';
import { CLI_VERSION, defaultCacheDirectory, resolveCatalog } from './catalog.mjs';
import { compareSemver } from './semver.mjs';
import { detectClients, findDuplicateSkillNames, installSkill, skillTargets, uninstallSkill } from './skill-manager.mjs';
import { formatCreatePreview, formatCreateSuccess, formatDoctor, formatProjectCheck, formatSkillSummary, formatTemplates, formatUpdate, shouldUseColor, terminalPalette } from './terminal-ui.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skillSource = join(root, 'skills', 'arg3n41ck-frontend-project', 'SKILL.md');
const bundledCatalog = () => readRegistry(join(root, 'registry', 'templates.json'));
const valueOptions = new Set(['template', 'brief-file', 'requirements', 'client']);
const booleanOptions = new Set(['json', 'dry-run', 'allow-third-party', 'keep-template-history', 'purge-cache', 'help']);
const commands = new Set(['create', 'list', 'recommend', 'setup', 'doctor', 'update', 'check', 'uninstall', 'help']);
const windowsReserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
const optionKey = name => name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

export function parseArguments(argv) {
  const [first = 'help', ...rest] = argv;
  if (!commands.has(first)) throw new Error(`Unknown command: ${first}`);
  const options = {};
  let target;
  for (let index = 0; index < rest.length; index += 1) {
    const argument = rest[index];
    if (argument === '--help' || argument === '-h') {
      options.help = true;
      continue;
    }
    if (argument.startsWith('--')) {
      const name = argument.slice(2);
      if (booleanOptions.has(name)) {
        options[optionKey(name)] = true;
        continue;
      }
      if (!valueOptions.has(name)) throw new Error(`Unknown option: ${argument}`);
      const value = rest[++index];
      if (!value || value.startsWith('--')) throw new Error(`${argument} needs a value.`);
      options[optionKey(name)] = value;
      continue;
    }
    if (target !== undefined) throw new Error('Only one target directory is allowed.');
    target = argument;
  }
  return { command: first, ...(target === undefined ? {} : { target }), options };
}

export function validateInteractiveProjectName(value) {
  const name = typeof value === 'string' ? value.trim() : '';
  if (!name || name.length > 100 || name === '.' || name === '..' || windowsReserved.test(name)) throw new Error('Project name is invalid.');
  if (name.includes('/') || name.includes('\\') || /[<>:"|?*\u0000-\u001f]/.test(name) || name.endsWith('.') || name.endsWith(' ')) throw new Error('Project name is invalid.');
  return name;
}

function print(value, { json, output }) {
  output(json ? JSON.stringify(value, null, 2) : value);
}

function isFirstParty(entry) {
  try {
    const source = new URL(entry.repository);
    return source.protocol === 'https:' && source.hostname === 'github.com' && source.pathname.startsWith('/arg3n41ck/');
  } catch {
    return false;
  }
}

function assertSourcePolicy(entry, allowThirdParty) {
  if (!isFirstParty(entry) && !allowThirdParty) {
    throw new Error(`Template ${entry.id} is not a first-party source. Re-run with --allow-third-party only after reviewing its repository.`);
  }
}

async function interactivePrompt() {
  const readline = createInterface({ input: process.stdin, output: process.stdout });
  return {
    ask: question => readline.question(question),
    close: () => readline.close(),
  };
}

async function chooseCreateArguments({ templates, target, template, prompt, color }) {
  let selectedId = template;
  if (!selectedId) {
    const answer = await prompt.ask(formatTemplates(templates, { color, interactive: true }));
    const selected = templates[Number(answer) - 1];
    if (!selected) throw new Error('Choose a template number from the list.');
    selectedId = selected.id;
  }
  let selectedTarget = target;
  if (!selectedTarget) {
    const ui = terminalPalette(color);
    selectedTarget = validateInteractiveProjectName(await prompt.ask(`${ui.accent('Название проекта')}: `));
  }
  return { template: selectedId, target: selectedTarget };
}

function selectedClients(option, environment) {
  if (option === 'all') return ['codex', 'claude'];
  if (option) return [option];
  const detected = detectClients(environment);
  if (!detected.length) throw new Error('No supported client was detected. Use setup --client codex or setup --client claude.');
  return detected;
}

function usage() {
  return `Template Agent ${CLI_VERSION}\n\n` +
    `npx --yes @argenalimbaev/template-agent@1 setup [--client codex|claude|all]\n` +
    `npx --yes @argenalimbaev/template-agent@1 create [project-name] [--template id]\n` +
    `template-agent list [--json]\n` +
    `template-agent doctor | update | check [project-path] | uninstall`;
}

async function catalogForCommand(options, dependencies) {
  return resolveCatalog({ bundledRegistry: bundledCatalog(), forceRefresh: !!options.forceRefresh, ...dependencies.catalog });
}

export async function runCli(argv, dependencies = {}) {
  const parsed = parseArguments(argv);
  const output = dependencies.output || (value => console.log(value));
  const cwd = dependencies.cwd || process.cwd();
  const environment = dependencies.environment || {};
  const color = dependencies.color ?? shouldUseColor({ isTTY: process.stdout.isTTY, json: !!parsed.options.json, noColor: !!process.env.NO_COLOR });
  if (parsed.options.help || parsed.command === 'help') {
    output(usage());
    return { status: 'help' };
  }
  if (parsed.command === 'setup' || parsed.command === 'uninstall') {
    const clients = parsed.command === 'uninstall' && !parsed.options.client
      ? ['codex', 'claude']
      : selectedClients(parsed.options.client, environment);
    const targets = skillTargets({ clients, ...environment });
    const result = parsed.command === 'setup'
      ? installSkill({ targets, source: skillSource, dryRun: !!parsed.options.dryRun })
      : uninstallSkill({ targets, dryRun: !!parsed.options.dryRun });
    const response = { skills: result };
    if (parsed.command === 'uninstall' && parsed.options.purgeCache) {
      const cache = dependencies.cacheDirectory || defaultCacheDirectory(environment);
      if (!parsed.options.dryRun) rmSync(cache, { recursive: true, force: true });
      response.cache = parsed.options.dryRun ? 'would-remove' : 'removed';
    }
    if (parsed.options.json) print(response, { json: true, output });
    else output(formatSkillSummary({ skills: result, action: parsed.command, dryRun: !!parsed.options.dryRun, color }));
    return response;
  }
  if (parsed.command === 'doctor') {
    const nodeOk = compareSemver(process.versions.node, '22.14.0') >= 0;
    let gitOk = true;
    try { execFileSync('git', ['--version'], { stdio: 'ignore' }); } catch { gitOk = false; }
    const catalog = await catalogForCommand({}, dependencies);
    const clients = detectClients(environment);
    const result = {
      node: { version: process.versions.node, supported: nodeOk },
      git: { supported: gitOk },
      catalog: { source: catalog.source, stale: catalog.stale, warning: catalog.warning || null },
      clients,
      duplicateSkillFiles: findDuplicateSkillNames(environment),
      ok: nodeOk && gitOk,
    };
    if (parsed.options.json) print(result, { json: true, output });
    else output(formatDoctor(result, color));
    return result;
  }
  if (parsed.command === 'update') {
    const catalog = await catalogForCommand({ forceRefresh: true }, dependencies);
    const clients = detectClients(environment);
    const skills = clients.length ? installSkill({ targets: skillTargets({ clients, ...environment }), source: skillSource, dryRun: !!parsed.options.dryRun }) : [];
    const result = { catalog: { source: catalog.source, stale: catalog.stale, warning: catalog.warning || null }, skills };
    if (parsed.options.json) print(result, { json: true, output });
    else output(formatUpdate(result, color));
    return result;
  }
  const catalog = await catalogForCommand({}, dependencies);
  const templates = availableTemplates(catalog.registry);
  if (parsed.command === 'list') {
    const result = { source: catalog.source, templates };
    print(parsed.options.json ? result : formatTemplates(templates, { color }), { json: !!parsed.options.json, output });
    return result;
  }
  if (parsed.command === 'recommend') {
    if (!parsed.options.requirements) throw new Error('recommend needs --requirements <file>.');
    const requirements = JSON.parse(readFileSync(resolve(cwd, parsed.options.requirements), 'utf8'));
    const result = recommend(catalog.registry, requirements);
    print(result, { json: true, output });
    return result;
  }
  if (parsed.command === 'check') {
    const project = resolve(cwd, parsed.target || '.');
    const provenancePath = join(project, '.template-provenance.json');
    if (!existsSync(provenancePath)) throw new Error(`No .template-provenance.json found in ${project}.`);
    const provenance = JSON.parse(readFileSync(provenancePath, 'utf8'));
    const current = templates.find(entry => entry.id === provenance.template);
    const result = {
      project,
      template: provenance.template,
      current: current ? { ref: current.ref, commit: current.commit } : null,
      generated: { ref: provenance.ref, commit: provenance.commit },
      updateAvailable: !!current && (current.ref !== provenance.ref || current.commit !== provenance.commit),
    };
    if (parsed.options.json) print(result, { json: true, output });
    else output(formatProjectCheck(result, color));
    return result;
  }
  if (parsed.command !== 'create') throw new Error(`Unsupported command: ${parsed.command}`);
  let prompt;
  try {
    if ((!parsed.options.template || !parsed.target) && !dependencies.prompt && !process.stdin.isTTY) {
      throw new Error('create needs a project name and --template outside an interactive terminal.');
    }
    if (!parsed.options.template || !parsed.target) prompt = dependencies.prompt || await interactivePrompt();
    const selected = await chooseCreateArguments({ templates, target: parsed.target, template: parsed.options.template, prompt, color });
    const entry = templates.find(item => item.id === selected.template);
    if (!entry) throw new Error('Unknown template ID. Run template-agent list.');
    assertSourcePolicy(entry, !!parsed.options.allowThirdParty);
    const target = isAbsolute(selected.target) ? selected.target : resolve(cwd, selected.target);
    if (parsed.options.dryRun) {
      const result = { target, template: entry.id, source: catalog.source, dryRun: true };
      if (parsed.options.json) print(result, { json: true, output });
      else output(formatCreatePreview({ target, entry, color }));
      return result;
    }
    if (!parsed.options.json) output(terminalPalette(color).accent(`✦ Создаю ${entry.name}…`));
    const brief = parsed.options.briefFile ? readFileSync(resolve(cwd, parsed.options.briefFile), 'utf8') : undefined;
    const metadata = createProject({ entry, target, brief, keepHistory: !!parsed.options.keepTemplateHistory });
    const result = { target, source: catalog.source, metadata };
    if (parsed.options.json) print(result, { json: true, output });
    else output(formatCreateSuccess({ target, entry, color }));
    return result;
  } finally {
    prompt?.close?.();
  }
}
