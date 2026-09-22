# Architecture

`User specification -> global AI skill or manual CLI -> current catalog -> deterministic recommendation -> pinned source validation -> atomic materialization -> independent project`

## Components

- **npm CLI** (`@argenalimbaev/template-agent`): cross-platform Node.js command surface, local skill setup, catalog cache, safety checks and project generation.
- **Global skill**: small provider adapter for Codex and Claude Code. It interprets intent but never contains template application rules.
- **Catalog**: immutable GitHub `catalog-v*` releases with `registry/templates.json`; capabilities, limits, exact Git references and expected skills.
- **Generator**: uses Git + Node filesystem APIs only. It validates a tagged source before atomically moving it into a new target directory.
- **Template repository**: owns source code, dependencies, canonical `.ai/skills`, rules, wiki and application-specific verification.

## Boundaries

The CLI has no model API, MCP, daemon, telemetry, dependency installer or remote executable hooks. It never changes an existing generated project. `check` is read-only and reports only release drift from `.template-provenance.json`.

Catalog updates and CLI updates are intentionally different releases:

- `catalog-vX.Y.Z` updates available template pins without changing installed CLI code.
- `cli-vX.Y.Z` publishes behavior/contract changes to npm; its tag must equal `package.json` version.

Catalog lookup uses GitHub Releases API, validates HTTPS/schema/size/minimum CLI version and caches the last known valid catalog for 24 hours. The bundled catalog is only an offline fallback; an incompatible catalog never silently downgrades.

## Terminal experience

The CLI has a small human-oriented presentation layer separate from its JSON API. Interactive TTY sessions receive colored template numbers, clear prompts, progress/status messages, red errors and compact success panels with next commands. `--json`, `NO_COLOR` and non-TTY output never receive ANSI sequences, so agent parsing, CI logs and shell pipes remain stable.

## Target safety

Generation creates a sibling staging directory and a temporary lock, validates all contracts there, initializes fresh Git history and atomically renames only into a non-existing target. Existing targets, dangling symlinks, active locks, unsafe template paths and mismatched commits fail closed.
