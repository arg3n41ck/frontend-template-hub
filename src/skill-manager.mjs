import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, rmdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

export const SKILL_NAME = 'arg3n41ck-frontend-project';
const managedMarker = '<!-- template-agent:managed -->';

export function skillTargets({ home = homedir(), env = process.env, clients = ['codex', 'claude'] } = {}) {
  return clients.map(client => {
    if (client === 'codex') {
      const directory = join(home, '.agents', 'skills', SKILL_NAME);
      return { client, directory, file: join(directory, 'SKILL.md') };
    }
    if (client === 'claude') {
      const directory = join(env.CLAUDE_CONFIG_DIR || join(home, '.claude'), 'skills', SKILL_NAME);
      return { client, directory, file: join(directory, 'SKILL.md') };
    }
    throw new Error(`Unsupported client: ${client}`);
  });
}

export function detectClients({ home = homedir(), env = process.env } = {}) {
  const clients = [];
  if (existsSync(join(home, '.agents')) || existsSync(join(home, '.codex'))) clients.push('codex');
  if (existsSync(env.CLAUDE_CONFIG_DIR || join(home, '.claude'))) clients.push('claude');
  return clients;
}

function managed(text) {
  return text.includes(managedMarker);
}

function managedSkillContent(source) {
  const text = readFileSync(source, 'utf8');
  return `${managedMarker}\n${text}`;
}

function writeAtomic(file, content) {
  mkdirSync(dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  writeFileSync(temporary, content, { mode: 0o600 });
  renameSync(temporary, file);
}

export function installSkill({ targets, source, dryRun = false }) {
  const content = managedSkillContent(source);
  return targets.map(target => {
    const alreadyExists = existsSync(target.file);
    if (alreadyExists) {
      const current = readFileSync(target.file, 'utf8');
      if (!managed(current)) throw new Error(`Refusing to overwrite unmanaged skill: ${target.file}`);
      if (current === content) return { client: target.client, status: 'unchanged', file: target.file };
      if (!dryRun) writeAtomic(`${target.file}.template-agent.bak`, current);
    }
    if (!dryRun) writeAtomic(target.file, content);
    return { client: target.client, status: alreadyExists ? 'updated' : 'installed', file: target.file };
  });
}

export function uninstallSkill({ targets, dryRun = false }) {
  return targets.map(target => {
    if (!existsSync(target.file)) return { client: target.client, status: 'absent', file: target.file };
    if (!managed(readFileSync(target.file, 'utf8'))) throw new Error(`Refusing to remove unmanaged skill: ${target.file}`);
    if (!dryRun) {
      rmSync(target.file);
      rmSync(`${target.file}.template-agent.bak`, { force: true });
      if (existsSync(target.directory) && readdirSync(target.directory).length === 0) rmdirSync(target.directory);
    }
    return { client: target.client, status: 'removed', file: target.file };
  });
}

export function findDuplicateSkillNames({ home = homedir(), env = process.env } = {}) {
  const roots = [join(home, '.agents', 'skills'), join(env.CLAUDE_CONFIG_DIR || join(home, '.claude'), 'skills')];
  const duplicates = [];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    for (const folder of readdirSync(root)) {
      const file = join(root, folder, 'SKILL.md');
      if (folder === SKILL_NAME || !existsSync(file)) continue;
      if (readFileSync(file, 'utf8').match(new RegExp(`^name:\\s*${SKILL_NAME}\\s*$`, 'm'))) duplicates.push(file);
    }
  }
  return duplicates;
}
