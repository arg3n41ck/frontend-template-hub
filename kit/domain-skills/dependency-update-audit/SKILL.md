---
name: dependency-update-audit
description: Use when dependencies or lockfiles are installed, upgraded or reviewed.
---

# Dependency Update Audit

1. Read package manager, runtime and CI constraints; inspect current lockfile and user changes before installation.
2. Verify package source, exact version, license, peer dependencies and lifecycle scripts using official metadata/docs. Do not run remote installer scripts or global installs by implication.
3. Change only requested dependencies; preserve one lockfile and review transitive/peer changes. Do not bypass peer errors or security warnings with force flags.
4. Run frozen-lockfile installation, impacted tests/typecheck/build and runtime smoke. Report known vulnerabilities and compatibility gaps separately; a successful install is not a security audit.

## Evidence and boundaries

Return findings/changed paths, exact checks, skipped checks and residual risks. Project rules and verified source take precedence. This skill grants no external write, paid tool, production access or dependency-install permission. Load only for its trigger.
