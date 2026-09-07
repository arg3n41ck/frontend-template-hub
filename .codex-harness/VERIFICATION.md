# Verification

```bash
node scripts/validate-registry.mjs
node --test scripts/create-project.test.mjs scripts/recommend-template.test.mjs scripts/ai-context.test.mjs
node scripts/create-project.mjs --list --json
node scripts/recommend-template.mjs examples/layout-requirements.json
node scripts/create-project.mjs ../disposable --template react-vite --dry-run
```

CI runs the Node tests on Linux, macOS and Windows. Windows-specific tests use legacy link text and directory junctions; dangling Unix symlinks are exercised on Unix. The Bash wrapper is optional.

For release: clone hub and all enabled sources using public HTTPS with credential helpers/system/global Git config disabled. Generate in disposable paths including spaces, confirm actual target existence, exact commit, no source history/origin, canonical skills and portable forwarding files. Check generated metadata/brief/agent files against the source formatter when present.

For hub-only docs/registry changes, no UI build/browser rerun is required when framework source and dependencies are unchanged. Run affected application checks if generated source/package modifications change behavior. No cross-model reasoning benchmark is claimed; evaluate docs/selection-scenarios.md in each client.

For common kit changes also run `node scripts/ai-kit.mjs <template-path> [...]` against all participating local templates, and generate disposable projects from reviewed local snapshots. Test `.ai/context.mjs --check` and question/UI/risk routes in the generated target without a hub dependency. Registry/source inventory mismatch must fail before target creation.

## Focused skill profiles

Run `node --test scripts/skill-coverage.test.mjs` alongside existing Node suites and `node scripts/ai-kit.mjs <template-dir>`. App adapter/dependency changes require their `pnpm verify`, parser tests and browser URL/history smoke; see `docs/skills-url-state-report.md`.
