# Agent graph

## Flow

`User spec -> AGENTS.md -> registry v2 -> AI-derived requirements -> recommend-template.mjs -> create-project.mjs -> validateTemplate -> skill-adapters.mjs -> independent project + provenance + brief -> task implementation`.

## Ownership

- `registry/templates.json`: extensible sources, capability metadata, enabled flags, file contracts and pinned commits. Default sources use public HTTPS.
- `scripts/registry.mjs`: authoritative runtime schema, path/source validation, active entries.
- `scripts/recommend-template.mjs`: hard filtering + preference/complexity ranking; ties/no-match/existing-project outcomes.
- `scripts/create-project.mjs`: CLI, source validation, atomic target reservation, rollback and provenance. No model or app dependency install.
- `scripts/skill-adapters.mjs`: portable Markdown forwarders to canonical skills; no symlink requirement.
- `scripts/*.test.mjs`: safety, portability, source contracts and extension tests.
- `AGENTS.md`: complete model-neutral protocol; `.ai/skills/frontend-project-bootstrap` is only an optional pointer.
- `docs/extending.md`, `compatibility.md`, `selection-scenarios.md`: maintenance contract and behavioral acceptance cases.

## Evidence

MCP list_projects failed with transport closed at task start. This map is reconciled through targeted current-source inspection. A graph refresh is useful when the server returns, not a prerequisite for community users.

Checks are in VERIFICATION.md. No UI source was changed in this revision.
