# Compatibility and limits

## Supported flows

| Environment | Automatic selection | Manual creation |
| --- | --- | --- |
| Codex CLI/Desktop/IDE with terminal | Yes, after `setup` | Yes |
| Claude Code with terminal | Yes, after `setup` | Yes |
| Cursor, DeepSeek IDE agent, another shell-capable agent | Depends on its skill support | Yes |
| Browser/chat without local filesystem + shell | No | It can only show the command |

Codex loads the user skill from `$HOME/.agents/skills`; Claude Code loads it from `~/.claude/skills` or `CLAUDE_CONFIG_DIR`. If a client does not reload a newly added skill, restart it and run `template-agent doctor`.

## Runtime requirements

- Node.js 22.14+ and Git.
- macOS, Linux and Windows are supported; the CLI does not require Bash.
- Project names entered interactively reject traversal, separators, control characters and Windows-reserved names. Paths containing spaces and Unicode are supported when passed explicitly.
- Corporate proxy/SSL failures, GitHub rate limits and offline state return a clear error or valid cached/bundled catalog; credentials are never echoed.

## Deliberate limits

- The CLI does not understand free-form prose. Host AI translates a request into catalog capabilities; manual users choose a template themselves.
- Templates are snapshots, not a package dependency or auto-updatable starter.
- No automatic dependency install, database startup, migration, hook execution, deploy, publish or telemetry.
- Standard catalog entries are first-party public HTTPS repositories. Private sources require the consumer's own Git credentials; no maintainer credential is reused.
- Fullstack database E2E remains a template-level verification concern, not a Hub guarantee.
