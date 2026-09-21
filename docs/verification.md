# Verification

Run from Hub root:

```bash
npm ci
npm run verify
npm run pack:check
node bin/template-agent.mjs list --json
node bin/template-agent.mjs create demo --template react-vite --dry-run
```

`npm run verify` covers registry schema, selector, source validation, safe generation, AI contracts, global skill installation, catalog cache/fallback, interactive CLI constraints and release hygiene.

Release CI runs on Linux, macOS and Windows. It also verifies package tarball contents. Before a catalog release, anonymously clone every changed template, assert its exact pinned commit, required files, canonical skill inventory, generated adapters, no inherited origin/history and its documented template checks.

Manual smoke:

```bash
npx --yes ./<generated-tarball>.tgz doctor
npx --yes ./<generated-tarball>.tgz create smoke --template react-vite --dry-run
```

No Hub browser UI exists. Browser, API, database and performance tests are selected from the generated template's own verification guide.
