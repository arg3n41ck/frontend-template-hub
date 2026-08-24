# Verification

## Hub changes

```bash
node scripts/validate-registry.mjs
bash -n scripts/create-ruflo.sh
./scripts/create-ruflo.sh --list
./scripts/create-ruflo.sh demo --template react-vite --dry-run
```

## Template source/tag changes

For every changed registry entry:

1. Confirm the Git tag exists and is immutable.
2. Generate into a disposable path.
3. Confirm template history is absent and `.ruflo-template.json` is present.
4. Run that template's frozen install and `pnpm verify`.
5. For UI templates, run desktop/mobile browser smoke.

Remote-only CI can validate registry and shell syntax. End-to-end source cloning belongs in a trusted environment with access to private template repositories.
