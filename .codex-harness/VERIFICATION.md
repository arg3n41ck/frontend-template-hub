# Verification

## Hub

```bash
node scripts/validate-registry.mjs
bash -n scripts/create-project.sh
node --test scripts/create-project.test.mjs
./scripts/create-project.sh --list --json
./scripts/create-project.sh ../disposable-name --template react-vite --dry-run
```

## Release sources

Generate all four into new disposable directories from remote refs. Check exact commit provenance, no origin/history, AGENTS.md and all declared skills, relative adapters and a brief-file roundtrip. Run frozen install + pnpm verify for affected application/package changes under Node 22. Do not claim browser QA from builds alone.

Selection scenarios are in docs/template-selection.md. The CLI requires an explicit ID; test the AI reasoning separately from deterministic generation.
