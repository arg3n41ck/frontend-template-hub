---
name: form-checklist
description: Use when forms, validation, submission or unsaved changes are implemented.
---

# Form Checklist

1. Define field types, required/optional/null behavior and edit defaults from the API; preserve zero and false. Use existing form tools, not a second framework.
2. Separate draft form values from applied URL filters. Show accessible field errors and a submission-level failure with retry; preserve input on error.
3. Block accidental duplicate submits while pending, but enforce deduplication on the server when it matters. Upload completion and submission must have an explicit sequence.
4. Define reset, dirty-close confirmation, keyboard submit, disabled vs read-only and successful navigation behavior. Test empty/invalid/valid/server-error/rapid-submit/close-reopen.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
