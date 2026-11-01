# CLAUDE.md

The project instructions are shared by all coding agents and live in `AGENTS.md`:

@AGENTS.md

## Claude Code specifics

- `.claude/settings.json` pre-approves the project's Bun scripts and read-only git
  commands, and runs a `PostToolUse` hook (`.claude/hooks/format.ts`) that formats every
  file you edit under `front/` with Prettier. You still need to run `bun run check`
  before committing.
- Put personal overrides in `.claude/settings.local.json`, which is git-ignored.
