# Community hub v0.3.0 — handoff

## Delivered

- AGENTS.md contains the complete provider-neutral protocol: specification -> context -> catalog -> constrained choice -> clone -> requested implementation.
- No local/global bootstrap skill, model key, maintainer path or MCP requirement. Coding clients must provide file/terminal tools; chat-only limitations are explicit.
- Registry v2 has open capability/profile metadata, suitability, limitations, enabled flags and per-template file contracts.
- The recommender filters/ranks AI-extracted requirements; no-match, ambiguity and existing projects are safe outcomes, not silent substitutions.
- Public HTTPS defaults; other Git hosts and private authorized forks are supported.
- Windows-compatible Node entrypoint and plain Markdown skill forwarding files. Canonical assets are stored once per project; no symlink privileges needed.
- Adding/disabling/removing entries requires no generator/selector changes. Static non-JavaScript sources can omit package.json and lockfiles.

## Verification evidence

- Local Node 22.20.0: 24 tests passed (generation safety, portable adapters, extension, retirement, conflict and selection cases).
- Public hub cloned over HTTPS into a clean temporary HOME; current patch applied for pre-publication checks. System/global Git config, SSH and credential helpers disabled.
- All four remote template releases generated in paths containing spaces; actual targets, exact commits, no source HEAD/origin, canonical skills and portable adapters verified.
- The generated CRM passed pnpm frozen install and pnpm verify, covering formatting impact from new agent files.
- Registry validation, help/list/dry-run and helper layout scenario checked.
- GitHub Actions now tests Ubuntu, macOS and Windows. Check the workflow for current published results; local success is not presented as a Windows execution result.

## Unchanged / limits

- Application sources and dependency versions remain pinned to template v0.2.0. No UI redesign or app architecture rewrite; browser smoke was not rerun for hub-only changes.
- No cross-model reasoning benchmark or guarantee that every provider follows the protocol equally. Manual interpretation cases live in selection-scenarios.md.
- Existing generated projects never auto-update. No deployment, dependency auto-install or external skill auto-install was added.
- License changes were explicitly deferred by the owner. Third-party skills licensing still needs review before redistribution assurances.
- Codebase Memory MCP remained unavailable; source map updated manually.
- Fullstack PostgreSQL e2e remains outside this hub-only change and unverified.

## Next / backout

Use a fresh checkout of this hub and provide the specification plus output path. Maintainers follow docs/extending.md for catalog changes. Keep v0.3.0 immutable; revert with a new additive release or use a prior hub tag, never move source tags.
