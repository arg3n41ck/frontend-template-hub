# Agent graph

## Entry and flow

`project description -> AGENTS.md -> frontend-project-bootstrap -> docs/template-selection.md -> registry ID -> create-project.sh -> create-project.mjs -> pinned Git clone -> validateTemplate -> fresh Git + portable skills + provenance + optional brief`.

## Ownership

- `registry/templates.json`: four profiles, sources, release refs/commits, required skill names.
- `scripts/registry.mjs`: registry invariants and no-executable-field validation.
- `scripts/create-project.mjs`: argument handling, exact release verification, safe target reservation, cloning/cleanup and provenance.
- `scripts/create-project.test.mjs`: local fixtures, success, overwrite protection, missing source/tag/skill, pin mismatch, registry input validation.
- `.ai/skills/frontend-project-bootstrap/SKILL.md`: context-based AI selection workflow. `.agents`, `.codex`, `.claude` use relative adapters.
- `docs/template-selection.md`: selection and conflict decisions.
- `docs/skills-audit.md`: source skill inventory, exclusions and adaptations.
- `docs/publishing.md`: immutable releases; templates first, then hub.

## Graph evidence

Previous index queried before editing. Renamed hub index was created as `Users-argenalimbaev-work-projects-frontend-template-hub`; subsequent MCP calls failed with transport closed. This final map is manually reconciled with current source; refresh graph when the server is available. No graph DB is required to run the generator.

## Checks

See VERIFICATION.md. Node built-in tests have no external npm dependencies. End-to-end publication requires GitHub SSH access; generator never installs dependencies or invokes a model.
