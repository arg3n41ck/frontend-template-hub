import { readFileSync, writeFileSync, mkdirSync, rmSync, lstatSync } from 'node:fs';
import { join } from 'node:path';

export const adapters = ['.agents/skills', '.claude/skills', '.codex/skills'];

export function writeSkillAdapters(directory, skills) {
  for (const adapter of adapters) {
    // Remove the checkout's legacy link (or Git's text representation on Windows), not its destination.
    rmSync(join(directory, adapter), { recursive: true, force: true });
    for (const name of skills) {
      const canonical = `.ai/skills/${name}/SKILL.md`;
      const text = readFileSync(join(directory, canonical), 'utf8');
      const frontmatter = text.match(/^---\r?\n[\s\S]*?\r?\n---/)?.[0];
      if (!frontmatter) throw new Error(`Skill needs YAML frontmatter: ${name}`);
      const folder = join(directory, adapter, name);
      mkdirSync(folder, { recursive: true });
      writeFileSync(join(folder, 'SKILL.md'), `${frontmatter}\n\nRead the canonical skill at project root: \`${canonical}\`.\nResolve its references and scripts relative to the canonical skill directory, not this forwarding file.\nProject AGENTS.md and actual source override generic skill examples.\n`);
    }
  }
}

export function validateSkillAdapters(directory, skills) {
  for (const adapter of adapters) {
    if (!lstatSync(join(directory, adapter)).isDirectory() || lstatSync(join(directory, adapter)).isSymbolicLink()) throw new Error('Expected portable adapter directory.');
    for (const name of skills) {
      const file = join(directory, adapter, name, 'SKILL.md');
      if (!readFileSync(file, 'utf8').includes(`.ai/skills/${name}/SKILL.md`)) throw new Error(`Invalid forwarding skill: ${file}`);
    }
  }
}
