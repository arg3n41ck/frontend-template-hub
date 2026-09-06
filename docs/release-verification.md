# Templates v0.2.0 / hub v0.2.2 verification and handoff — 2026-09-06

## Status

Four independently named template repositories are published on main with v0.2.0. Registry pins exact commits. The hub is a host-AI workflow plus deterministic clone generator, not an autonomous runtime. No application architecture rewrite or framework dependency upgrade was performed.

## Published templates

| ID | Commit | Skills |
|---|---|---|
| react-vite | `cb61936e367f2a8bfddb162341c0a71a5ca54a24` | 13 |
| next | `c81b045f987701e85c81bd659b398697d454d770` | 14 |
| crm-dashboard | `489aebed1c99994e28cbce92b6669abf672fc56e` | 13 |
| fullstack-next-nest | `a3c9465eaa16e66b9577bea9ae37d4c967d8c2dd` | 23 |

## Verification executed

- Node 22.20.0 / pnpm 11.21.0: frozen install and pnpm verify passed in all four source checkouts.
- Fresh remote generation + frozen install + pnpm verify passed for all four profiles.
- Provenance commit equals registry pin; generated Git has no HEAD/origin; all declared skills and relative adapters resolve.
- Node built-in generator tests: 10 passed. Includes existing files/directories/dangling symlinks, source/tag/skill failures, pin mismatches, malformed registries, history exception and cleanup after failure.
- Dry run creates no target; registry validation and shell syntax passed.
- Browser smoke: React /, Next /, CRM /dashboard/home, fullstack / and /api-contract; no console errors, no horizontal overflow at 390px. Visual behavior was not redesigned.
- All four template GitHub Actions workflows passed for the release commits. Hub CI is checked after publication; see GitHub for its current state.
- Local UI/UX search script runs successfully. Copied search command paths were repaired.

## Fixes discovered during verification

- Canonicalize temporary paths before symlink containment validation (macOS /var vs /private/var).
- Normalize the generated brief's trailing newline so CRM formatting checks pass.
- Remove conflicting mandatory stack/formatter guidance from the frontend skill entrypoint; current project rules override optional legacy references.

## Limits

- PostgreSQL-backed API e2e not run: Docker daemon unavailable. Fullstack frontend's sample health data is not database connectivity evidence.
- CRM screens contain demonstration data; this is not production authentication/backend/business functionality.
- Codebase Memory MCP became unavailable after renamed hub indexing. Source maps were reconciled manually; refresh graph later.
- Third-party reference redistribution licensing has not been independently audited. Skills are curated instructions/assets, not installed external runtimes.
- Modular boundaries are documented; no claim of new automated import-boundary enforcement across all starters.

## Use and backout

Open this hub and ask the assistant to create a new project from its description. Alternatively run scripts/create-project.sh with an explicit ID. The local Codex bootstrap skill links to this hub; other machines need to clone/read the hub or expose its skill in their own agent.

Do not move v0.2.0 tags. Roll back by an additive change or explicit registry pointer to a previously verified release; generated projects never update automatically.

## Hub v0.2.1 correction

The first published-hub smoke exposed a no-op CLI when invoked through a symlinked path (including macOS /tmp). A failing regression test reproduced empty output. Canonicalizing the entry script path fixes execution; new v0.2.1 replaces the hub release, without moving v0.2.0 tags. Use hub v0.2.2 or main. Template release refs remain v0.2.0.

## Hub v0.2.2 correction

A second regression test covers importing the generator from a stdin-based verification script. Entry detection now guards non-file argv values before resolving real paths. Both symlinked CLI invocation and import-only use are covered by the 10-test suite.
