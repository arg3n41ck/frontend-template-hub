---
name: file-upload-safety
description: Use when upload, attachment preview or download features change.
---

# File Upload Safety

1. Define allowed types, sizes, counts, ownership and retention from the server contract. Client checks help UX but cannot validate file trust.
2. Server must validate content/type, sanitize filenames, authorize access and prevent path traversal; use isolated storage and scanning where required. Never execute uploaded content.
3. Handle progress, cancellation, retry and partial failure; revoke object URLs and avoid exposing private signed URLs in logs.
4. Test zero/oversized/wrong-type/duplicate files, expired links, unauthorized downloads and interrupted uploads. Do not install storage services without explicit requirements.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
