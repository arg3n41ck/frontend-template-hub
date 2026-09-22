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

Use this only for CLI behavior, global-skill, registry-schema or package changes:

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
