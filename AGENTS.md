# Ruflo Template Hub agent rules

## Scope

This repository is a registry, documentation and clone-based generator. It must not contain application template source or a duplicated AI skill library.

## Safe generator contract

- Clone only `repository` + immutable semver `ref` from `registry/templates.json`.
- Registry fields are data, never commands. Do not add `postInstall`, hooks or arbitrary shell execution.
- Resolve relative sources from the hub root for local development; published registries use explicit Git URLs.
- A generated project is independent by default: remove template history, initialize fresh Git and preserve provenance in `.ruflo-template.json`.
- Never overwrite an existing target.

## Template release gate

Before changing a registry entry, verify the template tag, required agent files, clean ignore rules, frozen install, lint/typecheck/tests as available, build and browser smoke for UI templates.

## Files

- `registry/templates.json`: allow-list and pinned release refs.
- `scripts/create-ruflo.sh`: generator.
- `scripts/validate-registry.mjs`: schema/invariant checks.
- `docs/template-contract.md`: required template contents.
- `docs/publishing.md`: local-to-remote release flow.

Run the checks from `.codex-harness/VERIFICATION.md` before reporting readiness.
