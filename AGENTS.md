# Template Agent maintainer protocol

This repository publishes the provider-neutral npm CLI `@argenalimbaev/template-agent`. It is not an application template and must not accumulate copied template skills, private credentials, runtime caches or personal paths.

## User-facing flow

- Preferred automatic flow: `npx --yes @argenalimbaev/template-agent@1 setup`, then a Codex/Claude Code agent reads the global `arg3n41ck-frontend-project` skill.
- Universal manual flow: `npx --yes @argenalimbaev/template-agent@1 create`; ask only template choice and project name.
- A chat without filesystem and terminal access cannot materialize a project. Give it a command; do not claim it created local files.
- Do not infer backend/database requirements from CRM, SaaS, auth, login or API integration. Existing code must be inspected and changed in place, never scaffolded over.

## Catalog and generator contract

1. The registry is the source of truth. Only `enabled: true` entries are eligible.
2. Host AI interprets raw requirements; `recommend` only validates structured capabilities. Ties, conflicts and no-match require one consequential question.
3. Source repositories must be release-tagged and exact-commit pinned. Never retag a release.
4. The generator validates the template contract before moving it atomically into a new target. Never overwrite a file, directory or symlink.
5. No lifecycle hooks, package installation, publish, telemetry, secret collection or arbitrary registry commands are allowed.
6. Skills, wiki, rules and application verification belong to each template. Hub stores only expected skill names to detect drift.
7. Generated projects are immutable snapshots; `check` may report a newer release, but no tool auto-merges template changes.

## Global skill safety

- Canonical distributable skill: `skills/arg3n41ck-frontend-project/SKILL.md`.
- Codex target: `$HOME/.agents/skills/arg3n41ck-frontend-project/SKILL.md`.
- Claude target: `${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/arg3n41ck-frontend-project/SKILL.md`.
- `setup`, `update` and `uninstall` touch only files containing the managed marker. Foreign collisions fail closed; managed updates have a backup and are atomic.
- Do not write Cursor settings, IDE settings or unknown provider directories.

## Catalog releases

- `catalog-vX.Y.Z`: immutable GitHub Release containing `templates.json`; template catalog updates only.
- `cli-vX.Y.Z`: npm package release. Package version must match the tag.
- Remote catalog responses are HTTPS-only, size/time limited, schema validated and cached. An incompatible `minCliVersion` fails rather than silently downgrading.
- First-party public GitHub sources are allowed by default. A non-first-party source needs explicit user acknowledgement with `--allow-third-party`.

## Verification

Run from repository root:

```bash
npm ci
npm run verify
npm run pack:check
node bin/template-agent.mjs list --json
node bin/template-agent.mjs create demo --template react-vite --dry-run
```

Before an npm publish, inspect `npm pack --dry-run`, verify the Git tag and package version, and obtain explicit user confirmation. npm credentials, OTP values, access tokens and private keys must never be printed or committed.
