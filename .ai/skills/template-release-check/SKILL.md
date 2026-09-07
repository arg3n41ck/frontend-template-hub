---
name: template-release-check
description: Use when publishing a template or hub release is requested.
---

# Template Release Check

1. Read release-readiness when present and the hub release report. Confirm explicit destination/branch/tag approval before external writes.
2. Verify scoped Git changes, source licenses, tests, clean generation and exact source tag/commit/inventory. Publish source templates before updating hub pins.
3. Run anonymous HTTPS generation with empty user configuration and validate no source origin/history or secrets; report remote CI separately from local tests.
4. Stop on mismatched pins or failed checks. Never force-push or replace tags to hide a bad release; document backout/forward-fix and residual limitations.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
