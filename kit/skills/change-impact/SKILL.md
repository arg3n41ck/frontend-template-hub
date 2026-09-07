---
name: change-impact
description: Use when a change could affect callers, state, contracts, data or external systems.
---

# Change Impact

Read the risk matrix in `.ai/WORKFLOW.md`. Inspect the proposed diff and current callers/consumers, not just the edited file. For each applicable surface record: affected consumer -> possible regression -> evidence/check -> backout. Include async cleanup/races, cache invalidation, permissions, route compatibility and duplicate side effects when applicable. A small shared edit may be high risk. Verify graph findings in source; no graph edge is proof of absence. Choose exact checks from VERIFICATION.md before editing and preserve the baseline. Report unknown contracts rather than inventing them. Never run rollback or external writes merely because a risk was found.
