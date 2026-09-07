---
name: observability-check
description: Use when health checks, logging, tracing or incident visibility change.
---

# Observability Check

1. Define the failure and signal needed; reuse existing logging/metrics infrastructure instead of adding a vendor by default.
2. Separate liveness from readiness and actual dependency health; a static status label is not a database check.
3. Include correlation/request identity where useful, redact secrets/PII, bound cardinality and avoid exposing stack traces to users.
4. Trigger a safe failure in isolation and prove its signal is visible. Report missing dashboards/alerts/access, and reuse backend-reliability-observability for deeper backend work.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
