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

Codebase Memory MCP refreshed the hub index during AI-first work; focused search confirmed validateTemplate/readRegistry/writeSkillAdapters and their callers. Source inspection remains authoritative. MCP is not a prerequisite for community users.

Checks are in VERIFICATION.md. No UI source was changed in this revision.

## AI-first kit

- `kit/context.mjs`: read-only manifest/routing/contract API, also copied to templates.
- `kit/WORKFLOW.md`, `kit/routes.json`, `kit/skills/`: common workflow assets; project-specific manifest built by `scripts/ai-kit.mjs`.
- `create-project.mjs` validates optional AI-first manifest inventory against registry before materialization, then validates adapters/kit files; legacy sources still supported.
- `scripts/ai-context.test.mjs`: routing, schema, path safety, drift and portability regression checks.
- `docs/ai-first-design.md`: decisions and manual agent evaluation, not an executed model benchmark.

## Focused skills and URL-state

`kit/domain-skills` owns 21 specialized skills; `kit/skill-profiles.json` maps approved profiles; `makeManifest` attaches only installed roles. Three hub maintainer skills live in `.ai/skills` with forwarders. `scripts/skill-coverage.test.mjs` tests coverage/isolation/discovery. `kit/URL_STATE.md` is copied to app docs; app runtime implements nuqs except CRM TanStack. MCP indexes refreshed; actual source remains authoritative.

## Release hygiene

`kit/release.gitignore` is the shared portable exclusion policy copied at the end of all five .gitignore files. `scripts/release-preflight.mjs` checks working-tree candidate paths/patterns and app kit; `scripts/release-hygiene.test.mjs` verifies isolation and force-tracked env rejection. Hub CI runs the local preflight. `docs/community-release.md` owns current release status; historical reports are not a readiness assertion.
