---
name: test-strategy
description: Use when choosing test coverage for a feature, defect or risky change.
---

# Test Strategy

1. List behavior, consumers and failure modes from the impact map; choose the smallest layer that observes each contract.
2. Use pure unit tests for normalization, integration tests for hooks/transport and a few browser scenarios for user-visible navigation and focus. Reuse installed runners.
3. For defects observe a failing reproduction before fixing. Assert outputs and behavior, not implementation details or snapshots alone.
4. Use isolated data, deterministic clocks/network, and meaningful assertions. Report skipped environments; do not count builds or static skill checks as behavioral evidence.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
