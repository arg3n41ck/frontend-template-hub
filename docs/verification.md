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

Manual TTY smoke from an empty directory (not the Hub checkout, whose package name can shadow `npx` resolution):

```bash
mkdir -p ~/template-agent-smoke && cd ~/template-agent-smoke
npx --yes @argenalimbaev/template-agent@1 create
# select a number, enter a project name, then inspect the success panel
NO_COLOR=1 npx --yes @argenalimbaev/template-agent@1 list
npx --yes @argenalimbaev/template-agent@1 list --json
```

`--json` must contain no ANSI escape characters; `NO_COLOR=1` must preserve readable plain text.

Manual tarball smoke:

```bash
npx --yes ./<generated-tarball>.tgz doctor
npx --yes ./<generated-tarball>.tgz create smoke --template react-vite --dry-run
```

No Hub browser UI exists. Browser, API, database and performance tests are selected from the generated template's own verification guide.
