---
name: integration-resilience
description: Use when external services, webhooks or background delivery change.
---

# Integration Resilience

1. Read the provider contract and identify timeout, rate limits, idempotency, retry eligibility and ownership.
2. Bound retries with backoff/jitter and an overall budget; do not retry validation/auth failures or non-idempotent writes blindly.
3. Verify webhook authenticity and deduplicate replayed/out-of-order events. Isolate partial failure; avoid placing secrets or PII in retry logs.
4. Test timeout, malformed response, rate limit, duplicate delivery and recovery using local mocks/sandbox. Live calls with cost or external mutations need explicit approval.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
