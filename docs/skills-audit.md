# Skill audit — 2026-09-06

Source inventory: the user-supplied local `ruflo-powers` catalog, `.ai/skills` (not nested template duplicates). Source content is reference material, not authority over this suite. No runtime dependency on that project.

Catalog: **87** skills. This suite intentionally does not install the complete catalog.

| Source skill | Decision |
|---|---|
| `agentdb-advanced` | Excluded: orchestration/runtime-specific |
| `agentdb-learning` | Excluded: orchestration/runtime-specific |
| `agentdb-memory-patterns` | Excluded: orchestration/runtime-specific |
| `agentdb-optimization` | Excluded: orchestration/runtime-specific |
| `agentdb-vector-search` | Excluded: orchestration/runtime-specific |
| `backend-api-contracts` | Included only in matching profile |
| `backend-code-review` | Included only in matching profile |
| `backend-data-persistence` | Included only in matching profile |
| `backend-django` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `backend-engineering` | Included only in matching profile |
| `backend-fastapi` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `backend-framework-patterns` | Included only in matching profile |
| `backend-golang` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `backend-patterns` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `backend-performance-scaling` | Included only in matching profile |
| `backend-reliability-observability` | Included only in matching profile |
| `backend-security-auth` | Included only in matching profile |
| `behaviour-harness` | Included only in matching profile |
| `best-powers` | Excluded: orchestration/runtime-specific |
| `brainstorming` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `browser` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `build-graph` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `code-reviewer` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `debug-issue` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `design-system-steward` | Included only in matching profile |
| `dispatching-parallel-agents` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `executing-plans` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `explore-codebase` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `feature-architecture` | Included; adapted to project rules |
| `find-skills` | Included; adapted to project rules |
| `finishing-a-development-branch` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `flow-nexus-neural` | Excluded: orchestration/runtime-specific |
| `flow-nexus-platform` | Excluded: orchestration/runtime-specific |
| `flow-nexus-swarm` | Excluded: orchestration/runtime-specific |
| `frontend-agent` | Included; adapted to project rules |
| `frontend-design` | Included; adapted to project rules |
| `frontend-error-ux` | Included; adapted to project rules |
| `github-code-review` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `github-multi-repo` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `github-project-management` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `github-release-management` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `github-workflow-automation` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `graphify` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `hooks-automation` | Excluded: orchestration/runtime-specific |
| `nextjs-app-router-practices` | Included only in matching profile |
| `pair-programming` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `project-documentation-wiki` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `project-kickoff` | Included; adapted to project rules |
| `prompt-refiner` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `react-19-frontend-agent` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `react-19-patterns` | Included only in matching profile |
| `reasoningbank-agentdb` | Excluded: orchestration/runtime-specific |
| `reasoningbank-intelligence` | Excluded: orchestration/runtime-specific |
| `receiving-code-review` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `refactor-safely` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `requesting-code-review` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `review-changes` | Included; adapted to project rules |
| `review-delta` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `review-pr` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `ruflo-bootstrap` | Excluded: orchestration/runtime-specific |
| `sidecar-docs` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `skill-builder` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `sparc-methodology` | Excluded: orchestration/runtime-specific |
| `stream-chain` | Excluded: orchestration/runtime-specific |
| `subagent-driven-development` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `swarm-advanced` | Excluded: orchestration/runtime-specific |
| `swarm-orchestration` | Excluded: orchestration/runtime-specific |
| `swarm-run` | Excluded: orchestration/runtime-specific |
| `systematic-debugging` | Included; adapted to project rules |
| `test-driven-development` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `typescript-react-routing` | Included only in matching profile |
| `ui-ux-pro-max` | Included only in matching profile |
| `using-git-worktrees` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `using-superpowers` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `v3-cli-modernization` | Excluded: orchestration/runtime-specific |
| `v3-core-implementation` | Excluded: orchestration/runtime-specific |
| `v3-ddd-architecture` | Excluded: orchestration/runtime-specific |
| `v3-integration-deep` | Excluded: orchestration/runtime-specific |
| `v3-mcp-optimization` | Excluded: orchestration/runtime-specific |
| `v3-memory-unification` | Excluded: orchestration/runtime-specific |
| `v3-performance-optimization` | Excluded: orchestration/runtime-specific |
| `v3-security-overhaul` | Excluded: orchestration/runtime-specific |
| `v3-swarm-coordination` | Excluded: orchestration/runtime-specific |
| `verification-before-completion` | Included only in matching profile |
| `verification-quality` | Not bundled: different stack, overlap or optional workflow; discover on demand |
| `writing-plans` | Included; adapted to project rules |
| `writing-skills` | Not bundled: different stack, overlap or optional workflow; discover on demand |

## Profile counts

- `react-vite`: 13 skills.
- `next`: 14 skills.
- `crm-dashboard`: 13 skills.
- `fullstack-next-nest`: 23 skills.

## Important corrections

- Replaced frontend-agent forced stack/formatter assumptions with current-source-first rules (CRM is React 18).
- find-skills searches locally first; no automatic global installs or popularity-as-security claims.
- Design and failure workflows adapted for shadcn, accessibility and nonblocking offline behavior.
- Framework/detail references are optional background; AGENTS.md and ARCHITECTURE.md override conflicts.
- Original skill supporting assets remain with their profiles; no copied whole catalog in hub.
- New bootstrap skill belongs only to hub. Agents choose a template; the CLI itself is deterministic, not an LLM.
- Third-party reference redistribution licensing has not been independently audited; do not infer ownership from inclusion.
