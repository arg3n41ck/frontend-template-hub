---
name: i18n-audit
description: Use when localized UI strings, locales, dates or numbers change.
---

# I18N Audit

1. Apply only where localization exists or is requested; do not install an i18n framework for a single-language starter.
2. Reuse namespaces and keys, synchronize supported locales, remove orphaned keys only after checking consumers. Do not build sentences by concatenation.
3. Use locale-aware plural/number/currency formatting and an explicit timezone/date-only policy. Test missing keys, fallback and long translations.
4. Check narrow layouts, accessible names, sorting/search locale behavior and RTL only if supported. Report untranslated content explicitly.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
