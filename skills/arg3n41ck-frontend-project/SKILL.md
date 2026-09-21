---
name: arg3n41ck-frontend-project
description: Select and create a new frontend project from the Template Agent catalog. Use when the user explicitly asks to start, scaffold, generate, or create a new React, Next.js, CRM dashboard, fullstack project, or new layout from scratch. Do not use for architecture discussion or changes inside an existing project.
---

Use this flow only when the user wants a new project and a terminal is available.

1. Confirm the target does not already contain a project. Never scaffold over existing code.
2. Run `npx --yes @argenalimbaev/template-agent@1 list --json` and read the current catalog.
3. Translate the request into factual capabilities. Do not infer a backend merely from CRM, SaaS, auth, API, or login. Use `recommend --requirements <file> --json` to check the decision.
4. If one template is compatible, briefly state its ID, reason, and important limitation. If candidates are tied, no match exists, or a requested constraint conflicts with the catalog, ask one consequential question. Do not silently substitute a stack or merge templates.
5. Create the project with `npx --yes @argenalimbaev/template-agent@1 create <new-directory> --template <id> --brief-file <accepted-brief-file>`. Do not install dependencies, run hooks, publish, or expose secrets.
6. Read the generated project's `AGENTS.md`, its project brief, and verification guide. Continue implementation only when the user asked for work beyond starter creation.

If the environment has no shell or filesystem access, explain that it cannot materialize a project and provide the manual CLI command. For manual creation, `npx --yes @argenalimbaev/template-agent@1 create` asks only for a template and project name.
