# Extending the catalog

## Add or update a template

1. Prepare the source in its own repository. It must contain `AGENTS.md`, `.codex-harness/AGENT_GRAPH.md`, `.codex-harness/VERIFICATION.md`, canonical `.ai/skills/<name>/SKILL.md` files and real application checks.
2. Publish a new immutable `vMAJOR.MINOR.PATCH` tag. Record the resolved 40-character commit.
3. Update `registry/templates.json` atomically: source URL, tag, commit, capabilities, use/avoid/limits, required files and complete skill inventory.
4. Do not claim future capabilities. `selection.capabilities` describes only what the release really contains.
5. Run `npm run verify`, anonymously materialize the changed source over HTTPS, then push a new `catalog-vX.Y.Z` tag. GitHub Actions releases `templates.json` as the immutable catalog asset.

No selector/generator switch statement should change just to add a template. A new entry is immediately eligible through catalog metadata.

## Registry v3

```json
{
  "version": 3,
  "minCliVersion": "1.0.0",
  "templates": []
}
```

Each entry keeps the v2 fields: stable `id`, `name`, `description`, `profile`, `repository`, release `ref`, exact `commit`, `stack`, expected `skills`, `enabled`, `selection`, and `project` contract.

- Unknown fields and executable hooks are rejected.
- Remote sources require an exact commit pin and a versioned tag.
- `enabled: false` retires an entry without changing existing generated projects.
- Keep IDs stable; a semantic replacement needs a new ID.
- `minCliVersion` raises a clear update requirement instead of allowing an old generator to guess a new contract.

## Third-party and removed templates

The shipped catalog accepts only first-party public GitHub sources without an extra flag. A future third-party entry must be reviewed for source/license/supply-chain risk; consumers must explicitly pass `--allow-third-party` before cloning it.

Removing or disabling an entry affects only future selection. Existing projects retain their provenance and source snapshot.
