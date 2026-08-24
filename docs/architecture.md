# Architecture

## Decision

Use five repositories, not one monorepo of template source:

```text
ruflo-template-react/      independent source + tag
ruflo-template-next/       independent source + tag
ruflo-template-crm/        independent source + tag
ruflo-template-fullstack/  independent source + tag
ruflo-template-hub/        registry + docs + generator only
```

This keeps every clone small, releases isolated and framework dependencies independent. Shared policy is expressed as a small contract, not by copying application files into the hub.

## Creation flow

```text
user selects template ID
  -> hub validates allow-listed registry entry
  -> git clone --depth 1 --branch <immutable tag>
  -> template history removed by default
  -> fresh Git repository initialized
  -> .ruflo-template.json provenance written
  -> user installs dependencies explicitly
```

The generator deliberately does not install dependencies or run template-provided setup commands. This keeps external code execution visible and user-controlled.

## Versioning

Each template has its own semantic release tags. Registry updates are reviewable pointer changes. Existing projects never change automatically; upgrades are explicit migrations, not hidden pulls.
