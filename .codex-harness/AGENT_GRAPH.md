# Agent graph

## Boundaries

- `registry/templates.json`: allow-listed template IDs, descriptions, stacks, AI profiles, Git sources and immutable tags.
- `scripts/create-ruflo.sh`: list/select/clone flow, local relative-source resolution, history isolation and provenance metadata.
- `scripts/validate-registry.mjs`: registry shape, unique IDs, configured pairs, stack/profile and semver-tag validation.
- `docs/architecture.md`: five-repository decision and creation flow.
- `docs/template-contract.md`: source/release requirements.
- `docs/skills-matrix.md`: per-template skill ownership.
- `docs/publishing.md`: local-to-remote release flow.

No application source or copied skill catalog belongs here.

## Source graph

`template ID -> registry entry -> repository @ immutable tag -> temporary clone -> independent target -> .ruflo-template.json`.

Graph index: `Users-argenalimbaev-work-projects-ruflo-template-hub`. Re-index after registry or generator architecture changes.
