# Architecture

## Decision

Use five repositories, not one monorepo of template source:

```text
frontend-template-react/      independent source + tag
frontend-template-next/       independent source + tag
template-crm/        independent source + tag
frontend-template-fullstack/  independent source + tag
frontend-template-hub/        registry + docs + generator + bootstrap skill
```

This keeps every clone small, releases isolated and framework dependencies independent. Shared policy is expressed as a small contract, not by copying application files into the hub.

## Creation flow

```text
AI reads project context -> explains template ID
  -> hub validates allow-listed registry entry
  -> git clone --depth 1 --branch <immutable tag>
  -> template history removed by default
  -> release commit checked and required skills validated
  -> fresh Git repository initialized
  -> .template-provenance.json provenance written
  -> user installs dependencies explicitly
```

The generator deliberately does not install dependencies or run template-provided setup commands. This keeps external code execution visible and user-controlled.

## Versioning

Each template has its own semantic release tags. Registry updates are reviewable pointer changes. Existing projects never change automatically; upgrades are explicit migrations, not hidden pulls.
