---
name: frontend-project-bootstrap
description: Use when selecting a project starter from a specification, creating a new project or layout, or extending the template catalog.
---

# Universal project bootstrap

Read `AGENTS.md` at the hub root and follow its complete protocol. The catalog in `registry/templates.json` is the only template list; do not hardcode framework-to-template mappings here.

This optional skill is an adapter, not the primary entrypoint. A fresh clone works without installing it globally. Any model in a file/terminal-capable client can read AGENTS.md directly. If this adapter is reached outside a hub checkout, locate the hub through the path/URL explicitly supplied by the user, not a maintainer-specific directory.

The host AI interprets natural language; `recommend-template.mjs` checks structured capabilities and `create-project.mjs` materializes a pinned selection. Existing applications are not overwritten. Continue implementation only when requested.
