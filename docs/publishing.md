# Publishing

## Before every release

```bash
npm ci
npm run verify
npm run pack:check
```

Inspect the tarball: it may contain CLI source, registry fallback and global skill only. It must not contain template repositories, copied skill libraries, `node_modules`, caches, `.env`, credentials or test artifacts.

## Catalog release

Use this for a changed template pin, catalog metadata or a newly added/retired template:

1. Verify the source template release and anonymous HTTPS materialization.
2. Update the registry commit/tag/inventory in the Hub commit.
3. Commit and push `catalog-vX.Y.Z`.
4. `publish-catalog.yml` validates the Hub and creates GitHub Release asset `templates.json`.

The CLI resolves the most recent `catalog-v*` release and caches a validated copy. Generated projects do not change.

## CLI/npm release

Use this for CLI behavior, global-skill, registry-schema, bundled fallback/docs or package changes:

1. Set the same semantic version in `package.json`, `src/catalog.mjs`, provenance metadata and `cli-vX.Y.Z`.
2. Run the preflight and tarball smoke locally.
3. For the first public version, publish interactively after explicit confirmation:

   ```bash
   npm publish --access public
   ```

4. In npm package settings configure Trusted Publisher:
   - GitHub user: `arg3n41ck`
   - repository: `frontend-template-hub`
   - workflow: `publish-npm.yml`
   - allow `npm publish`
5. Later pushes of `cli-v*` use GitHub Actions OIDC and provenance. Never store a long-lived write token in repository secrets.

Bad CLI releases are deprecated and replaced with a patch release. Catalog mistakes are corrected by a new immutable `catalog-v*` release; never retag or rewrite an existing release.


## WebView publication

Catalog catalog-v1.1.0 adds two immutable v0.1.0 source releases; CLI cli-v1.0.4
ships the same six-entry fallback, updated README and WebView-aware skill trigger.
The selection algorithm and command syntax are unchanged. Source pins of the
four existing starters are not changed. Both tags point to one verified Hub commit.

After workflows complete, verify public templates.json contains six enabled
entries, npm latest resolves to 1.0.4, and a clean npm tarball can list/recommend/
create both WebView projects. A pushed tag alone does not prove publication.
Users with a still-valid old catalog cache run update (or wait for its 24-hour TTL).
Existing installed global skills need setup/update to receive new trigger wording;
old CLI clients can read the additive catalog without a forced major upgrade.
