# Architecture

Five independent repositories currently exist, but the catalog is not limited to four templates.

`Specification -> host AI reads AGENTS.md + registry -> structured requirements -> recommendation helper -> validated choice -> pinned clone -> source contract validation -> portable skill adapters -> independent project -> requested implementation`

## Responsibilities

- Host AI: understand context, preserve requirements, clarify ambiguity, choose and continue implementation.
- Registry: available sources, capabilities, suitability, limitations, skills and per-template file contracts.
- Recommendation helper: deterministic constraint filtering/ranking, no model provider dependence.
- Generator: safe filesystem/Git operations and provenance, no application dependency install or remote hooks.
- Template repo: application code, its own dependencies, project rules, canonical skills and verification guide.

The hub must not contain application templates or copy the whole skill library. Its one optional bootstrap skill forwards to the same AGENTS.md protocol used by all agents. Generated compatibility files forward to canonical skill content rather than duplicate it.

Additions/removals are catalog data changes. No model-specific adapters, framework switches, personal paths or fixed source counts in orchestration logic. Native host capabilities determine whether an AI can execute or only advise.
