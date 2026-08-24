# Publishing templates

## Initial local suite

Registry paths point to sibling repositories. This is intentional for local end-to-end verification.

## Publish a template

```bash
cd ../ruflo-template-next
pnpm install --frozen-lockfile
pnpm verify
git status --short
git tag v0.1.0
git push origin main --tags
```

Then change the registry entry from `../ruflo-template-next` to the real SSH or HTTPS Git URL. Do not change an existing tag's contents; release a new tag and update the pointer.

## Validate a release

```bash
node scripts/validate-registry.mjs
bash -n scripts/create-ruflo.sh
./scripts/create-ruflo.sh /tmp/ruflo-smoke --template next
cd /tmp/ruflo-smoke
pnpm install --frozen-lockfile
pnpm verify
```

For private sources, Git authentication remains the user's normal Git/SSH responsibility. Tokens never belong in the registry.
