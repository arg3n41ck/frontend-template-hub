---
name: template-maintenance
description: Use when hub profiles or shared AI kit are added, removed or synchronized.
---

# Template Maintenance

1. Read registry and shared kit sources; do not hardcode template IDs in agent selection prose. Keep profile-only skills out of unrelated templates.
2. Update kit sources first, synchronize explicitly and run manifest/adapter/drift checks; preserve consumer customization and never overwrite occupied generated targets.
3. Maintain docs and capability inventory alongside source changes. Old public pins must keep their matching old skills until new sources are released.
4. Test adding/disabling a registry entry and generation into a disposable target. No silent publishing or remote install hooks.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
