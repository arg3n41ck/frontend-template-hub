# Community template release — pending

## Goal and scope

Deliver five provider-neutral template repos, focused skills/wiki/graph, nuqs URL-state, cleanup and safe community release. User approved local implementation/cleanup/security preparation. CRM dev-toolchain major migration explicitly authorized and now completed. No current publication or license-change command.

## Current source

React/Next/CRM/fullstack skills: 40/42/42/55; hub: bootstrap + 3 maintainer roles. Canonical skills and portable forwarding files, lazy manifest/risk routing. README/reports Russian, technical skills/rules English. Public registry still intentionally pins old published source tags; update full inventories/ref/commit together only after sources are released.

## Completed locally

AI-kit, selective workflows, Graphify/wiki, URL parsers/hook/adapters (nuqs except existing CRM TanStack), 3 CRM pagination regressions. Confirmed garbage removed: CRM unused vendored library/example routes/obsolete readme, fullstack obsolete executable. Shared ignore policy and tested release-preflight added; CRM Dockerfile preinstall/policy ordering and dockerignore fixed. Axios/Seroval/Vite/qs plus compatible security transitives updated, no stack change.

## Evidence

All 4 frozen installs + pnpm verify passed after updates; 44 hub Node tests, 3 Graphify tests; kit/registry/preflight pass. Local snapshot generation all4 under empty HOME succeeds. Production browser smoke all4 desktop/mobile; removed CRM routes Not Found. Production audit0 all4; full audit0 React/Next/fullstack. CRM full audit now0 after authorized migration; peers0, tests/coverage/app and Storybook builds pass; browser manager/2 stories and dashboard desktop/mobile pass. Source remotes fetched: HEAD...origin/main 0/0 all5, local changes remain uncommitted.

## Blockers and boundaries

- CRM development dependency blocker resolved; coverage remains limited (3 tests, statements2.3%), not product-wide proof.
- Distribution rights remain unverified; user accepts leaving this risk, no license changes or invented permission.
- Docker daemon unavailable: Docker image/PostgreSQL E2E not tested.
- No new public HTTPS release/remote CI/live cross-model benchmark; browser/API starter tests are not product correctness evidence.
- No commit/push/tag/deploy performed. No automatic reset or deletion of previous user changes.

## Next

Read docs/community-release.md for matrix and publication order. Toolchain migration completed; see current report. Obtain explicit publication command, publish four sources first, update hub registry exact refs/commits/inventories, anonymous HTTPS smoke, publish hub and confirm remote CI. Remove active task only when release scope is complete.

## Backout

Restore only scoped deleted files or revert scoped dependency/config hunks; do not reset the broad earlier changes. No DB/data changes. Local pre-cleanup backup exists outside repos in the OS temporary folder (reported in tool output), not a release dependency.

## CRM toolchain migration — authorized and active

User explicitly asks to fix dev-tool vulnerabilities now. Ownership: CRM package/lockfile, Vitest/Storybook configuration and stories as required; related release docs in hub. Preserve previous changes, React18/Vite6/runtime API/skills remain. Goal: coherent patched toolchain, full audit0, peers clean, tests/coverage/type/lint/app and Storybook build/browser proof. No publication or license mutation. Backout: restore only this turn's backed-up toolchain files, never Git reset of earlier work.

## Final toolchain handoff

DONE locally. Vitest/UI/Istanbul4.1.11, Happy DOM20.14.0, Storybook10.6.0 + docs/links, React18 types. Old addons removed; ESM aliases/Tailwind preview CSS fixed using observed build/browser failures. Full audit0, peers0, frozen install/verify/coverage/Storybook build pass; browser dashboard+2 stories/manager/styles pass. CI and README/verification/report updated. Existing prior edits preserved, no commits/push/tags. Pending release context stays open only for publication/environment limits, not this completed migration.

## Publication authorized — 2026-09-07
User requested push/update of all five repos. Release source templates v0.3.0 first, then hub v0.4.0 with verified commit/skill pins. No license changes or rewritten tags. Verify anonymous HTTPS and remote CI; close context after delivery.
