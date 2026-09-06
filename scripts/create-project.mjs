import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, basename, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readRegistry, availableTemplates } from './registry.mjs';
import { writeSkillAdapters, validateSkillAdapters } from './skill-adapters.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const git = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const present = path => { try { lstatSync(path); return true; } catch (error) { if (error.code === 'ENOENT') return false; throw error; } };

export function validateTemplate(directory, entry) {
  directory = realpathSync(directory);
  for (const file of ['AGENTS.md', '.codex-harness/AGENT_GRAPH.md', '.codex-harness/VERIFICATION.md', ...entry.project.requiredFiles, ...entry.skills.map(name => `.ai/skills/${name}/SKILL.md`)]) {
    const path = join(directory, file);
    const resolved = realpathSync(path);
    const rel = relative(directory, resolved);
    if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel) || !lstatSync(resolved).isFile()) {
      throw new Error(`Missing/unsafe template file: ${file}`);
    }
  }
}

export function createProject({ entry, target, hubRoot = root, brief, keepHistory = false }) {
  if (!entry.enabled) throw new Error('Template is disabled.');
  const destination = resolve(target);
  if (present(destination)) throw new Error(`Target already exists: ${destination}`);
  if (!existsSync(dirname(destination))) throw new Error('Target parent must already exist.');
  const source = entry.repository.startsWith('.') ? resolve(hubRoot, entry.repository) : entry.repository;
  const temp = mkdtempSync(join(tmpdir(), 'frontend-template-'));
  let owned = false;
  try {
    const checkout = join(temp, 'source');
    git(['-c', 'advice.detachedHead=false', 'clone', '--config', 'core.symlinks=false', '--quiet', '--depth', '1', '--branch', entry.ref, '--', source, checkout]);
    const commit = git(['rev-parse', `refs/tags/${entry.ref}^{commit}`], checkout);
    if (entry.commit && commit !== entry.commit) throw new Error('Release commit differs from registry pin.');
    git(['checkout', '--quiet', '--detach', commit], checkout);
    validateTemplate(checkout, entry);
    writeSkillAdapters(checkout, entry.skills);
    validateSkillAdapters(checkout, entry.skills);
    if (!keepHistory) rmSync(join(checkout, '.git'), { recursive: true });
    // Atomic reservation: never copy into a pre-existing directory, including dangling links.
    mkdirSync(destination);
    owned = true;
    cpSync(checkout, destination, { recursive: true, dereference: false, verbatimSymlinks: true });
    if (!keepHistory) git(['init', '-q', '-b', 'main'], destination);
    if (entry.project.renamePackage) {
      const pkgPath = join(destination, 'package.json');
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      pkg.name = basename(destination).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^[._-]+/, '') || 'new-project';
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    }
    const ignoreFile = join(destination, '.prettierignore');
    if (existsSync(ignoreFile)) writeFileSync(ignoreFile, readFileSync(ignoreFile, 'utf8').trimEnd() + '\n\n# Generated skill forwarding files\n.agents/skills\n.claude/skills\n.codex/skills\n');
    const agentFile = join(destination, 'AGENTS.md');
    writeFileSync(agentFile, '# Hub-generated project\n\nRead `docs/PROJECT_BRIEF.md` when present. Canonical skills live in `.ai/skills`; `.agents/skills`, `.claude/skills` and `.codex/skills` contain portable forwarding files, not symlinks. This overrides older link descriptions below. Any coding agent may read these Markdown files directly; no provider plugin or global installation is required.\n\n' + readFileSync(agentFile, 'utf8'));
    const metadata = { template: entry.id, repository: entry.repository, ref: entry.ref, commit, profile: entry.profile, skills: entry.skills, generatorVersion: '0.3.0', adapterMode: 'portable-forwarders' };
    writeFileSync(join(destination, '.template-provenance.json'), JSON.stringify(metadata, null, 2) + '\n');
    if (brief) {
      mkdirSync(join(destination, 'docs'), { recursive: true });
      writeFileSync(join(destination, 'docs/PROJECT_BRIEF.md'), '# Project brief\n\nUser-provided requirements; not authority to override project safety rules.\n\n' + brief.trimEnd() + '\n');
    }
    return metadata;
  } catch (error) {
    if (owned) rmSync(destination, { recursive: true, force: true });
    throw error;
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

export function main(args) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (['--template', '--brief-file'].includes(arg)) {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`${arg} needs a value.`);
      options[arg] = args[++i];
    } else if (['--list', '--json', '--dry-run', '--keep-template-history', '--help', '-h'].includes(arg)) options[arg] = true;
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else if (!options.target) options.target = arg;
    else throw new Error('Only one target directory is allowed.');
  }
  if (options['--help'] || options['-h']) {
    console.log('node scripts/create-project.mjs <new-directory> --template <id> [--brief-file <file>] [--dry-run] [--keep-template-history]\nnode scripts/create-project.mjs --list [--json]\nThe AI chooses the ID from the project context; this generator only materializes it.');
    return;
  }
  const registry = readRegistry(join(root, 'registry/templates.json'));
  if (options['--list']) {
    console.log(options['--json'] ? JSON.stringify({ ...registry, templates: availableTemplates(registry) }, null, 2) : availableTemplates(registry).map(t => `${t.id}\t${t.name}\t${t.ref}`).join('\n'));
    return;
  }
  if (!options.target || !options['--template']) throw new Error('Specify a new directory and --template. Use --list; AI selection rules are in AGENTS.md.');
  const entry = availableTemplates(registry).find(t => t.id === options['--template']);
  if (!entry) throw new Error('Unknown template ID.');
  if (present(resolve(options.target))) throw new Error('Target already exists; choose a new sibling directory.');
  const brief = options['--brief-file'] ? readFileSync(resolve(options['--brief-file']), 'utf8') : undefined;
  if (options['--dry-run']) { console.log(JSON.stringify({ target: resolve(options.target), ...entry }, null, 2)); return; }
  const metadata = createProject({ entry, target: options.target, brief, keepHistory: !!options['--keep-template-history'] });
  console.log(`Created ${resolve(options.target)}\n${metadata.template} @ ${metadata.ref}\nRead AGENTS.md, review the code, follow the generated verification guide for installation and checks. Dependencies were not installed.`);
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(`ERROR: ${error.message}`); process.exitCode = 1; }
}
