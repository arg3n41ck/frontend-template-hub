---
name: performance-audit
description: Use when measured UI, bundle or request performance needs investigation.
---

# Performance Audit

1. Record a reproducible baseline with route, dataset, device/viewport and metric before optimizing.
2. Inspect request waterfalls, cache keys, unnecessary effects, rerenders, large lists and client bundle boundaries. Use virtualization or lazy loading only when measurements justify them.
3. Preserve accessibility, navigation and state when splitting code; avoid speculative memoization or changing UX merely to improve a synthetic score.
4. Compare before/after with the same scenario and run behavior regressions. Report lab measurements separately from production telemetry.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
