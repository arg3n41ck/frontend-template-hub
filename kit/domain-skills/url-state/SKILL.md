---
name: url-state
description: Use when filters, search, sorting, pagination or shareable tabs use search parameters.
---

# Url State

1. Read docs/URL_STATE.md and actual router before code. CRM uses TanStack Router; other web templates use nuqs. Never add a second URL-state owner for the same keys.
2. Keep applied shareable state in validated search params and ephemeral/draft state local. Define a module-owned parser/schema; preserve unknown unrelated keys and hash.
3. Update dependent keys atomically and reset page with filters/sort/page-size. Choose replace for typing and push for meaningful navigation; handle Back/Forward and reload.
4. Validate numbers/ranges/enums and date policy at URL and server boundaries. Use normalized values in API/cache keys, control request debounce separately and handle stale responses.
5. Never put secrets or sensitive personal data in URLs. Test malformed/duplicate/empty params, Unicode, clearing, pagination, history and refresh before claiming completion.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
