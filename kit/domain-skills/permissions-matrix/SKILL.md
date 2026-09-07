---
name: permissions-matrix
description: Use when roles, tenant ownership or protected actions change.
---

# Permissions Matrix

1. Write a compact role × resource × action matrix based on a verified backend contract; do not invent roles.
2. Enforce permissions server-side and scope data/cache to user/tenant. UI hides/disables actions only for understandable UX.
3. Test denied direct URLs and requests, cross-tenant IDs, expired sessions and stale cached data after account switching.
4. Document ownership and review focus; prefer existing backend-security-auth to duplicate auth implementations.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
