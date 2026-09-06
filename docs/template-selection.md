# Context-based template selection

Honor explicit constraints first. Prefer the smallest template that covers the requested runtime responsibilities.

| Need | Template | Do not assume |
|---|---|---|
| Client-side application, existing API, no explicit SSR | react-vite | A router or state manager must be installed immediately |
| Explicit Next.js, SEO, server rendering, public content | next | A separate Nest API is required |
| CRM/admin SPA with ready dashboard; existing/separate API | crm-dashboard | The dashboard includes a real backend or production auth |
| Explicit web + Nest API + PostgreSQL owned in one repo | fullstack-next-nest | Prebuilt CRM screens exist |

## Conflicts

- “SaaS” alone: ask whether a separate API/database is needed; do not choose fullstack just by keyword.
- “CRM with Next”: explicit Next wins; explain that ready CRM dashboard exists only in the SPA template. Ask if that tradeoff matters.
- “CRM + create the backend”: fullstack covers runtime; dashboard is additional implementation, not an automatic template merge.
- “Backend already exists”: react-vite or crm-dashboard; Next only if explicitly requested or server-rendered web is needed.
- Existing code: no generation into it; offer a new sibling directory or scoped migration.
- No clear app type: ask about product and rendering/backend needs before creating anything.

The generator takes --template explicitly. This decision table is for the AI, not a brittle keyword classifier.
