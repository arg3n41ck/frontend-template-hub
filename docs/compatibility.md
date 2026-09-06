# Compatibility and limits

## Agent/model independence

The integration contract is plain Markdown plus JSON and a Node CLI. No Codex account, Claude plugin, DeepSeek API key, global skill path or MCP server is required. Models differ in instruction following; model-quality parity is not guaranteed and no cross-model benchmark has been run.

- Coding client with file + shell access: read AGENTS.md, inspect the specification, derive constraints, execute the documented Node commands and verify output.
- File access but no shell: choose and provide commands; do not claim generation.
- Chat only: the user must supply readable context/catalog and execute commands or switch to a tool-capable client.
- Automatic AGENTS.md/skill discovery is client-specific. Explicitly asking “Read AGENTS.md” is the fallback for any client, including a DeepSeek-backed client.

## OS and credentials

Use `node scripts/create-project.mjs`, not the optional Bash wrapper, on Windows. Git and Node 22+ are the generator prerequisites. No user identity is required for git init (the generator does not commit). Paths may contain spaces; quote them. Existing targets are rejected on every OS.

Default sources are public HTTPS. No maintainer SSH key or home-directory config is needed. Private forks may use explicit SSH/HTTPS URLs and their own access; do not store credentials in a manifest. Adding a new Git host does not require changing generator code.

## Skills

Canonical assets live once in `.ai/skills`. The hub and generated projects expose tiny Markdown forwarding files for `.agents/skills`, `.claude/skills` and `.codex/skills`. They avoid OS symlink privileges and duplicated skill asset libraries. For clients that ignore these adapters, read the canonical SKILL.md directly.

The generator normalizes legacy template symlinks (including Git's text representation when core.symlinks=false). Generic references do not override project rules. Optional Python/MCP/browser tools used by individual skills are not automatically installed; missing tools must be reported with a fallback.

## What is not promised

- The generator does not understand raw prose or make model calls; the host AI performs that reasoning.
- Skills are instructions, not guaranteed execution capabilities.
- A starter is not a finished product; template limitations and mock data remain explicit.
- UI rendering/DB/runtime support depend on the template, not the hub. Fullstack PostgreSQL e2e remains unverified.
- Public source licensing and copied skill licensing require review; no implicit relicensing.
