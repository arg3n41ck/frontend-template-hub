# Frontend Template Hub

**Bring a specification. Your coding agent chooses the starting template and continues the work.**

Provider-neutral instructions + extensible catalog + deterministic generator. Works as a workflow for Codex, Claude Code, DeepSeek-backed coding clients and other assistants that can read files and run commands. It is not a standalone LLM service; no model key or global skill setup is needed.

## For users

```bash
git clone https://github.com/arg3n41ck/frontend-template-hub.git
cd frontend-template-hub
```

Open this folder in your coding assistant and send:

> Read AGENTS.md. Here is my specification: [paste/attach it]. Choose the appropriate available template, create ../my-project and continue the requested implementation. Explain only consequential uncertainties.

Or:

> Read AGENTS.md. Build this layout in a new ../my-layout project. No backend is needed. [Attach design/specification.]

Agents that automatically read AGENTS.md can start from the specification alone. For clients with no automatic discovery, the explicit “Read AGENTS.md” instruction is the portable entrypoint. A hosted chat without filesystem/terminal access can only propose a choice and commands.

**No hub installed yet?** Give a tool-capable agent this repository URL and ask it to clone/read the hub in a separate directory, then provide the specification and desired output path. Do not clone the hub over an existing application.

## What happens

1. AI reads the brief and existing context.
2. AI reads the current registry, derives requirements and selects a compatible template.
3. A deterministic helper checks constraints; ties/no-match trigger clarification instead of guessing.
4. The generator retrieves the pinned source over public HTTPS and creates an independent project with matching skills, rules and provenance.
5. AI reads the generated project rules and continues the requested layout/implementation.

The registry is extensible; available choices are **not hardcoded into the agent protocol**:

```bash
node scripts/create-project.mjs --list --json
```

Git and Node.js 22+ are required for generation. No npm install is needed in the hub. Application prerequisites are defined by the chosen template. The generator itself never installs dependencies or executes template hooks.

## Manual / automation use

```bash
node scripts/recommend-template.mjs requirements.json
node scripts/create-project.mjs ../my-project --template <id> --dry-run
node scripts/create-project.mjs ../my-project --template <id> --brief-file brief.md
```

The helper accepts structured constraints extracted by the AI, not arbitrary prose. Generation requires an explicit validated ID. Existing target directories are never overwritten. Shell wrapper `scripts/create-project.sh` is optional; Node works without Bash.

## Maintainers

Add a published template and one registry entry, then run the checks. Disable an entry with `enabled: false` or remove it; existing projects stay independent. No selector implementation changes are needed. See [extension contract](docs/extending.md).

- [Complete agent protocol](AGENTS.md)
- [Compatibility and limits](docs/compatibility.md)
- [Selection scenarios](docs/selection-scenarios.md)
- [Skills inventory](docs/skills-audit.md)
- [Verification](.codex-harness/VERIFICATION.md)

## Licensing

Public visibility is not a license grant. Repository and third-party skill licensing must be checked before redistribution; this revision does not silently relicense imported assets. See the skill audit. Private sources need the user's own credentials; the default catalog uses public HTTPS.
