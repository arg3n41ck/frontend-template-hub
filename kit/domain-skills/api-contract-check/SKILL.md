---
name: api-contract-check
description: Use when API requests, response schemas, pagination or error handling change.
---

# Api Contract Check

1. Read the actual API schema and transport unwrap before designing UI; label unsupported fields rather than sending invented payloads.
2. Map nullability, IDs, pagination, sorting, status codes and field errors end to end. Keep transport DTOs separate from view models.
3. Derive cache keys from normalized request inputs and tenant/user scope; invalidate the affected queries after mutations. Never retry unsafe mutations without a verified idempotency contract.
4. Prove valid, empty, malformed, unauthorized and failed responses with focused tests; UI gating is not server authorization. In fullstack reuse backend-api-contracts for server details.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
