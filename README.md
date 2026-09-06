# Frontend Template Hub

Describe a project to an AI assistant; it reads this repository, selects a template and creates an independent project with matching skills and rules. No proprietary orchestration runtime or npm publication is required.

## Use with an AI

Clone this hub and open it in your assistant:

```bash
git clone git@github.com:arg3n41ck/frontend-template-hub.git
cd frontend-template-hub
```

Example prompt:

> Read AGENTS.md. Create ../my-crm: an internal CRM with a ready dashboard; the backend already exists. Select the appropriate template and set up its AI context.

The AI follows the bootstrap skill and explains its choice. For use outside this hub, expose `.ai/skills/frontend-project-bootstrap` in your assistant's user skill directory, or give the assistant this hub's path. Merely hosting the repository does not make every AI automatically discover it.

## Direct command

```bash
./scripts/create-project.sh --list --json
./scripts/create-project.sh ../my-product --template next --dry-run
./scripts/create-project.sh ../my-product --template next
```

Templates: `react-vite`, `next`, `crm-dashboard`, `fullstack-next-nest`.
Requires Node.js 22+, Git and GitHub SSH access. Sources are pinned by version and commit. HTTPS sources are also supported if configured explicitly.

The command refuses existing targets, validates the template, resets Git history by default, sets the root package name, preserves portable skills and writes `.template-provenance.json`. Optional `--brief-file` saves agreed requirements to `docs/PROJECT_BRIEF.md`. `--keep-template-history` is an explicit exception.

It does **not** install dependencies or execute setup hooks. After reviewing the result:

```bash
cd ../my-product
pnpm install --frozen-lockfile
pnpm verify
```

## References

- [AI entrypoint](AGENTS.md)
- [Template selection](docs/template-selection.md)
- [Architecture](docs/architecture.md)
- [Skills matrix](docs/skills-matrix.md) and [full inventory audit](docs/skills-audit.md)
- [Verification](.codex-harness/VERIFICATION.md)
- [Publishing](docs/publishing.md)
