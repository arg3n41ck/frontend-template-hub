# Extending the catalog

## Add a template

1. Prepare a separate clean source repository with AGENTS.md, `.codex-harness/AGENT_GRAPH.md`, `.codex-harness/VERIFICATION.md` and real `.ai/skills/<name>/SKILL.md` files (YAML frontmatter required). These are plain files usable by any agent. No personal paths, credentials, required global tools or symlink-dependent skills.
2. Declare application-specific files in `project.requiredFiles`. Set `renamePackage: true` only for a root package.json that may be renamed. For static HTML or another stack use false; Node/package.json/pnpm are not forced into that project.
3. Check source behavior and licenses. Publish a new immutable `vMAJOR.MINOR.PATCH` tag. Record its exact 40-character commit.
4. Add one entry to `registry/templates.json`, following the fields below. Use public HTTPS for community templates. Private templates need each consumer's own access; test them separately.
5. Add selection scenarios/tests with unique capabilities. Run registry validation, Node tests and a clean remote materialization. No edits to the selector/generator are required for a new ID or stack.

## Registry v2 fields

- `id`: stable lowercase hyphenated identifier. Never reuse an old ID for a different product.
- `name`, `description`, `profile`, `stack`: descriptive metadata. Profile labels are open-ended, not a fixed enum.
- `enabled`: true to make available; false to retire without deleting history. Disabled IDs cannot be generated.
- `repository`, `ref`, `commit`: source URL, immutable release tag, exact commit pin. HTTPS and Git SSH hosts are supported; local relative paths are for development fixtures. No credentials in URLs.
- `skills`: required canonical skill folder names, distributed with the source snapshot.
- `selection.capabilities`: factual runtime/UI capabilities (open vocabulary, lowercase hyphenated tokens). Do not claim capabilities the source merely could implement later.
- `selection.useWhen`, `avoidWhen`, `limitations`: human/AI-readable suitability and tradeoffs.
- `selection.complexity`: positive relative setup cost. Hard requirements win, then preferred capability matches, then lower complexity. Equal fits remain ambiguous.
- `project.requiredFiles`: repository-relative files validated before generation; no traversal, absolute paths or `.git` internals.
- `project.renamePackage`: whether to rename the root package.json to the destination name. If true, package.json must be required.

Unknown fields and executable hooks are rejected. To introduce a new field, update the validator/tests and this contract together. The runtime validator is the authoritative schema; there is no second generated schema to drift.

## Disable, remove, update

- Temporary retirement: set enabled false; the selector and generator exclude the entry immediately.
- Permanent removal: remove the entry and related acceptance scenarios. Empty catalogs are valid and yield no-match.
- Change source: publish a new tag/commit, verify it, then update the registry atomically. Never repoint an existing release tag.
- Rename display text freely; keep id stable. ID changes are a new catalog entry, not hidden migration.
- Existing generated projects are unchanged: provenance records the original source. Updates require an explicit migration, never automatic git pull.

## Unsupported requests

No compatible entry means no-match. The AI explains the gap and asks whether to adapt an available starter, add a new template, or use the existing project. It must not erase a requirement or merge templates behind the user's back.

## Migrating an older hub catalog

Registry v1 is rejected rather than interpreted incorrectly. To migrate, set version 2; add enabled, selection (capabilities/suitability/limitations/complexity) and project (requiredFiles/renamePackage) to each entry; replace useWhen with selection.useWhen; use public HTTPS where intended. Preserve IDs and commit pins. Upgrade hub code and registry together, not a single JSON file copied into an older CLI. This does not migrate existing generated applications.

## Focused skill profiles

`kit/domain-skills` holds suite-owned specialized instructions; `kit/skill-profiles.json` declares their destination profiles. `makeManifest` routes only installed skills. Copy approved canonical skills into target profiles and update manifests/forwarders; run `scripts/ai-kit.mjs` to catch drift. Update source versions and registry skills/commit/ref together only during an authorized release. `kit/URL_STATE.md` is the shared state policy copied to application docs. No second URL library for CRM.
