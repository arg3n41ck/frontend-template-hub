---
name: visual-regression
description: Use when design parity or visual regressions need verification.
---

# Visual Regression

1. Choose affected routes/states, desktop/mobile sizes and stable fixtures; wait for fonts and meaningful content, not arbitrary sleeps.
2. Capture baseline and changed screenshots under the same environment. Review clipping, spacing, wrapping, focus and overlay layering, not just pixel counts.
3. Do not approve changed snapshots automatically to make CI green. Exclude nondeterministic regions narrowly and explain why.
4. Keep keyboard/interaction tests separate; screenshots cannot prove form submission or authorization. No production screenshots containing private data in public artifacts.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
