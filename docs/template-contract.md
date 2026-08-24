# Template contract

Every registered template must be self-contained and independently versioned.

## Required files

- `README.md` with prerequisites, start and verification commands;
- `AGENTS.md` with stack boundaries and safe editing rules;
- `.codex-harness/AGENT_GRAPH.md` and `.codex-harness/VERIFICATION.md`;
- `.ai/skills` with a curated stack-specific profile plus compatibility links;
- `docs/AI_SKILLS.md` and `docs/DESIGN_SYSTEM.md`;
- `components.json` for shadcn/ui projects;
- clean `.gitignore`, `.env.example` when environment values exist, and CI verification.

## Release gate

1. No secrets, absolute machine paths, caches, build output or nested Git metadata.
2. `pnpm install --frozen-lockfile` succeeds on the declared Node version.
3. Lint, typecheck, focused tests and production build pass.
4. User-facing starter routes receive desktop and mobile browser smoke.
5. The release commit is tagged with an immutable semantic tag such as `v1.2.0`.
6. Registry metadata contains only source, tag, descriptive stack and AI profile.

Do not add registry-driven install hooks or post-clone commands. The generated project's dependency installation stays explicit.
