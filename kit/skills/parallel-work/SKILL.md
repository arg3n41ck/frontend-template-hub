---
name: parallel-work
description: Use when independently useful tasks can safely run in parallel on a capable agent host.
---

# Parallel Work

Decide whether parallelism reduces elapsed work without multiplying context. Do not delegate trivial or sequentially dependent work. Give each worker a bounded goal, exact writable files/module, acceptance criteria, minimal source context, verification and forbidden external effects. Tell workers they are not alone: preserve others' edits and do not revert unrelated work. Overlapping writers require isolation or sequencing. Use separate worktrees for unrelated changes; use read-only reviewers for overlapping scope. Workers must report evidence, blockers and changed files; the leader integrates once and checks the combined result. Do not repeatedly poll unchanged state or equate worker completion with verification. If the host lacks subagents, execute sequentially without changing model/runtime requirements. No agent may publish, mutate production or post externally without explicit authorization.
