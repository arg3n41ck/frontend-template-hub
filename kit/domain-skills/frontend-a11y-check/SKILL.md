---
name: frontend-a11y-check
description: Use when interactive controls, dialogs, forms or tables change.
---

# Frontend A11Y Check

1. Use semantic elements and accessible names; prefer existing shadcn primitives and keep their keyboard contract. Placeholder is not a label and color is not the sole status signal.
2. Test Tab/Shift+Tab, Escape, initial focus, focus trap and restoration after closing overlays; preserve visible focus and reduced-motion preferences.
3. Associate errors with inputs, announce meaningful async status without noisy live regions, and check disabled/loading controls.
4. Check contrast, zoom, narrow viewport and screen-reader structure. Automated checks are supporting evidence, not proof of full accessibility compliance.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
