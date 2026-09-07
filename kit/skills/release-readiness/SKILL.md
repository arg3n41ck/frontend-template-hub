---
name: release-readiness
description: Use when preparing a commit, merge, publication or deployment handoff.
---

# Release Readiness

Inspect Git status and the exact scoped diff, base/ref and user authorization. Check acceptance, current tests, conflict/CI status if accessible and documented rollback. Separate app readiness from release/deploy evidence. Stage only intended files when commit is authorized; never include unrelated user changes. For template releases publish source commits/tags first, then update registry refs/commits/skills/file contracts atomically and smoke a clean anonymous clone. Old pinned sources must not advertise new skills. Respect license review for redistributed assets. Never infer permission to commit/push/tag/merge/deploy or mutate statuses from this skill; no force-push or cleanup. If access/CI/runtime is unavailable, report exact unverified steps and stop before external effects.
