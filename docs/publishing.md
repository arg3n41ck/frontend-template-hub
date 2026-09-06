# Release flow

1. Verify scoped diffs and clean ignores. Run each affected template's frozen install and pnpm verify.
2. Commit template changes; add a new immutable semantic version tag. Never retag an existing release or rewrite history.
3. Push main and the new tag to the corresponding origin. Existing remote history must be preserved; stop on divergence.
4. Update registry repository, ref, resolved 40-character commit and skill list.
5. Run registry/generator tests and materialize every affected template from its remote into disposable directories; verify provenance and skill links.
6. Publish the hub commit and its new tag only after the sources are reachable.

Generated projects are snapshots. Ordinary git pull from a template is not an upgrade mechanism. Future updates require explicit migrations and preserved provenance.

GitHub Actions validate local source. Private cross-repository clone tests require a separately authorized credential; never assume GITHUB_TOKEN can read sibling private repositories.
