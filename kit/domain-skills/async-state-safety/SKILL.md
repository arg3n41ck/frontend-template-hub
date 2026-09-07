---
name: async-state-safety
description: Use when requests, subscriptions, optimistic updates or concurrent events change.
---

# Async State Safety

1. Identify the owner and lifetime of each request, timer and subscription. Clean up on unmount and relevant dependency changes; tolerate StrictMode remounts.
2. Cancel stale reads or guard response application by request identity. A slower old filter response must not overwrite a newer result. Abort is not rollback of a server mutation.
3. Deduplicate repeated actions; retry mutations only under an idempotency contract. Roll back optimistic updates without overwriting a newer successful mutation.
4. Test out-of-order responses, rapid filter changes, unmount, failure, retry and logout/tenant changes. URL throttling alone does not debounce API calls.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
