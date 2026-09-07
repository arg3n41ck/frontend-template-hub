---
name: data-table-patterns
description: Use when CRM lists, filters, sorting or pagination change.
---

# Data Table Patterns

1. Use URL-state as the source of truth for shareable applied filters, sort and pagination; read url-state before implementation. Draft input may remain local.
2. Match server vs client sorting/paging to the actual data source; never sort only the current server page while claiming global sorting. Include normalized filters in query keys.
3. Reset page atomically when filter/sort/page size changes; clamp after deletions only when total count is known. Define selection across pages and clear stale selections deliberately.
4. Keep loading/empty/error/permission states distinct; preserve stable row IDs, accessible headers and narrow-screen usability. Test deep links, reload, history and rapid filtering.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
