# Ruflo Template Hub

Registry, documentation and a safe local generator for four independently versioned project templates. Application source does not live in this repository.

## Templates

| ID | Use when | Source |
|---|---|---|
| `react-vite` | Small client-side React product | `ruflo-template-react` |
| `next` | Server-first web product | `ruflo-template-next` |
| `crm-dashboard` | CRM/admin system with a ready dashboard | `ruflo-template-crm` |
| `fullstack-next-nest` | Web + API + PostgreSQL monorepo | `ruflo-template-fullstack` |

## Create a project

```bash
./scripts/create-ruflo.sh --list
./scripts/create-ruflo.sh ../my-product --template next
cd ../my-product
pnpm install
```

The generator clones the immutable tag from `registry/templates.json`, removes template Git history by default, initializes a fresh repository and writes `.ruflo-template.json` with provenance.

Use `--dry-run` to inspect the source. Use `--keep-template-history` only when the new project must intentionally follow the template repository.

## Local and remote sources

The initial registry uses sibling paths such as `../ruflo-template-next`, so the full suite works locally. After publishing each template, replace only `repository` with its Git URL and keep the same immutable tag.

## Repository boundaries

- Template source, framework rules and stack-specific skills stay in each template repository.
- Registry metadata, publishing rules and generator logic stay here.
- Never store all templates or a duplicated global skill catalog in this hub.
- Registry data cannot execute commands; it only selects an allow-listed Git source and tag.

See `docs/architecture.md`, `docs/template-contract.md`, `docs/skills-matrix.md`, and `docs/publishing.md`.
