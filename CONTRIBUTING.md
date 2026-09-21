# Contributing

`frontend-template-hub` publishes the public CLI `@argenalimbaev/template-agent`, not application code or a shared skill dump.

1. Read [AGENTS.md](AGENTS.md), [architecture](docs/architecture.md) and [catalog extension rules](docs/extending.md).
2. Keep template application code, canonical skills, wiki and runtime tooling in their template repositories.
3. Add regression coverage for every CLI, registry or source-contract behavior change.
4. Never move tags, add credentials, copy third-party content without license review, or add lifecycle hooks/telemetry.
5. Run:

   ```bash
   npm ci
   npm run verify
   npm run pack:check
   ```

For a catalog-only update, publish an immutable `catalog-v*` release after verifying the changed template. For CLI changes, use matching `package.json` and `cli-v*` versions. First npm publication and all external release/push operations need explicit maintainer confirmation.
