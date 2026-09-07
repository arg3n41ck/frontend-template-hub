---
name: seo-metadata
description: Use when public Next pages need indexing or metadata behavior.
---

# Seo Metadata

1. Confirm which routes should be public/indexable; private dashboards do not need blanket SEO generation.
2. Use current installed Next metadata APIs; verify canonical origin from deployment config, never invent a domain. Align title/description/robots/sitemap with route and locale ownership.
3. Decide canonical handling for filtered/search URLs to avoid unbounded duplicate indexing; robots is not access control.
4. Check rendered metadata and actual status codes for success/404/redirect, structured data if requested and social images if available.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
