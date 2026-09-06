# Verification

```bash
node scripts/validate-registry.mjs
node --test scripts/create-project.test.mjs scripts/recommend-template.test.mjs
node scripts/create-project.mjs --list --json
node scripts/recommend-template.mjs examples/layout-requirements.json
node scripts/create-project.mjs ../disposable --template react-vite --dry-run
```

CI runs the Node tests on Linux, macOS and Windows. Windows-specific tests use legacy link text and directory junctions; dangling Unix symlinks are exercised on Unix. The Bash wrapper is optional.

For release: clone hub and all enabled sources using public HTTPS with credential helpers/system/global Git config disabled. Generate in disposable paths including spaces, confirm actual target existence, exact commit, no source history/origin, canonical skills and portable forwarding files. Check generated metadata/brief/agent files against the source formatter when present.

Framework source and dependency versions are unchanged: no UI build/browser rerun is required solely for hub docs/registry changes. Run affected application checks if generated source/package modifications change behavior. No cross-model reasoning benchmark is claimed; evaluate docs/selection-scenarios.md in each client.
