---
name: security-review
description: Use when trust boundaries, auth, user-controlled HTML, redirects or secrets change.
---

# Security Review

1. Trace untrusted input to HTML, URLs, files, SQL, shell and outbound requests; validate at the server boundary, use parameterized queries and avoid raw HTML unless sanitized by an established policy.
2. Keep secrets server-only and out of URLs/logs/browser bundles. Enforce authorization and tenant ownership for every protected operation; default-deny permissions.
3. Review session expiry, CSRF for cookie-auth mutations, redirect allowlists and cache isolation. Client role checks and hidden buttons provide UX only.
4. Write denial tests for unauthorized/cross-tenant cases and inspect error leakage. Reuse backend-security-auth for backend specifics; do not claim penetration testing from a checklist.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
