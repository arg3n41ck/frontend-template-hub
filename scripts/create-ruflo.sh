#!/usr/bin/env bash
# Create an independent project from an allow-listed, versioned template.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REGISTRY="$ROOT/registry/templates.json"
TARGET=""
TEMPLATE_ID=""
DRY_RUN=0
KEEP_HISTORY=0
LIST_ONLY=0

usage() {
  cat <<'USAGE'
Usage:
  scripts/create-ruflo.sh <project-directory> [--template <id>] [--dry-run] [--keep-template-history]
  scripts/create-ruflo.sh --list

Options:
  --template <id>             Select a registry template without a prompt.
  --dry-run                   Print the selected source; do not write files.
  --keep-template-history     Keep the template's .git directory and origin.
  --list                      List configured templates.
  -h, --help                  Show this help.

The template must be configured with a repository and immutable tag in registry/templates.json.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --template)
      [[ $# -ge 2 ]] || { echo "ERROR: --template requires an id." >&2; exit 2; }
      TEMPLATE_ID="$2"; shift 2 ;;
    --dry-run) DRY_RUN=1; shift ;;
    --keep-template-history) KEEP_HISTORY=1; shift ;;
    --list) LIST_ONLY=1; shift ;;
    -h|--help) usage; exit 0 ;;
    -*) echo "ERROR: unknown option: $1" >&2; exit 2 ;;
    *)
      [[ -z "$TARGET" ]] || { echo "ERROR: only one project directory is allowed." >&2; exit 2; }
      TARGET="$1"; shift ;;
  esac
done

[[ -f "$REGISTRY" ]] || { echo "ERROR: registry not found: $REGISTRY" >&2; exit 1; }
command -v node >/dev/null || { echo "ERROR: Node.js is required to read the registry." >&2; exit 1; }

if [[ $LIST_ONLY -eq 1 ]]; then
  node - "$REGISTRY" <<'NODE'
const fs = require('fs');
const registry = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const template of registry.templates) {
  console.log(`${template.id}\t${template.name}\t${template.ref}`);
}
NODE
  exit 0
fi

[[ -n "$TARGET" ]] || { usage >&2; exit 2; }
command -v git >/dev/null || { echo "ERROR: git is required." >&2; exit 1; }

if [[ -z "$TEMPLATE_ID" ]]; then
  echo "Choose a template:"
  node - "$REGISTRY" <<'NODE'
const fs = require('fs');
const registry = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
registry.templates.forEach((template, index) => {
  const state = template.repository && template.ref ? '' : ' (not configured)';
  console.log('  ' + (index + 1) + ') ' + template.id + ' - ' + template.name + state);
});
NODE
  read -r -p "Number: " choice
  TEMPLATE_ID="$(node - "$REGISTRY" "$choice" <<'NODE'
const fs = require('fs');
const registry = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const choice = Number(process.argv[3]);
const template = registry.templates[choice - 1];
if (!Number.isInteger(choice) || !template) process.exit(1);
process.stdout.write(template.id);
NODE
)" || { echo "ERROR: invalid template number." >&2; exit 2; }
fi

METADATA="$(node - "$REGISTRY" "$TEMPLATE_ID" <<'NODE'
const fs = require('fs');
const registry = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const id = process.argv[3];
const template = registry.templates.find((entry) => entry.id === id);
if (!template) {
  console.error('Unknown template: ' + id);
  process.exit(2);
}
if (!template.repository || !template.ref) {
  console.error('Template "' + id + '" is a placeholder. Configure repository and immutable ref first.');
  process.exit(3);
}
process.stdout.write(template.repository + ' ' + template.ref);
NODE
)" || exit $?

read -r REPOSITORY REF <<<"$METADATA"

CLONE_SOURCE="$REPOSITORY"
if [[ "$REPOSITORY" != /* && "$REPOSITORY" != *://* && "$REPOSITORY" != git@* ]]; then
  CLONE_SOURCE="$ROOT/$REPOSITORY"
fi

[[ -n "$REPOSITORY" && -n "$REF" ]] || exit 1
[[ ! -e "$TARGET" ]] || { echo "ERROR: target already exists: $TARGET" >&2; exit 1; }

if [[ $DRY_RUN -eq 1 ]]; then
  echo "Would create: $TARGET"
  echo "Template: $TEMPLATE_ID"
  echo "Source:   $REPOSITORY @ $REF"
  exit 0
fi

TMPDIR_ROOT="$(mktemp -d)"
cleanup() { rm -rf "$TMPDIR_ROOT"; }
trap cleanup EXIT

echo "Cloning $TEMPLATE_ID from $REPOSITORY @ $REF ..."
if [[ -d "$CLONE_SOURCE" ]]; then
  git -c advice.detachedHead=false clone --quiet --branch "$REF" "$CLONE_SOURCE" "$TMPDIR_ROOT/template"
else
  git -c advice.detachedHead=false clone --quiet --depth 1 --branch "$REF" "$CLONE_SOURCE" "$TMPDIR_ROOT/template"
fi

if [[ $KEEP_HISTORY -eq 0 ]]; then
  rm -rf "$TMPDIR_ROOT/template/.git"
fi

mkdir -p "$TARGET"
cp -R "$TMPDIR_ROOT/template/." "$TARGET/"

if [[ $KEEP_HISTORY -eq 0 ]]; then
  (
    cd "$TARGET"
    git init -q
  )
fi

node - "$TARGET/.ruflo-template.json" "$TEMPLATE_ID" "$REPOSITORY" "$REF" <<'NODE'
const fs = require('fs');
const [file, template, repository, ref] = process.argv.slice(2);
fs.writeFileSync(file, JSON.stringify({ template, repository, ref }, null, 2) + '\n');
NODE

echo "Created: $TARGET"
echo "Next: inspect the project, install dependencies, then make the first commit."
