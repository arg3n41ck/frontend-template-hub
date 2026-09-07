---
name: database-migration-safety
description: Use when schema migrations, backfills or data constraints change.
---

# Database Migration Safety

1. Read the existing migration system and ownership; keep schema synchronization disabled and never run against production implicitly.
2. Plan expand/migrate/contract across old/new app versions, nullable defaults, indexes, locks and large-table timing; use batched idempotent backfills.
3. Decide transaction boundaries and backup/restore or forward-fix strategy; not every destructive migration has a safe down migration.
4. Test fresh database and upgrade from previous schema using isolated data; check rollback or recovery evidence and constraints. Reuse backend-data-persistence.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
