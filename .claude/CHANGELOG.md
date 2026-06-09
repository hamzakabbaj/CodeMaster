# Changelog

All notable changes to the **CodeMaster** plugin — the `.claude/` unit declared by
`.claude/.claude-plugin/plugin.json` — are recorded here.

- Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html); the version of record is `plugin.json`'s `version`.
- CodeMaster is **dogfooded in-repo** (loaded natively from `.claude/`), not published to a marketplace. Changes accumulate under `[Unreleased]`; cut a release with `claude plugin tag .claude` — see `docs/03-delivery-process.md` §6.

## [Unreleased]

> Targets **0.1.0** — the first packaged version of the engineering OS.

### Added
- `plugin.json` manifest — packages `.claude/` as the `codemaster` plugin unit (name, version, validatable components); the repo keeps loading `.claude/` natively, no marketplace, nothing installed. (CM-26)
- `.claude/hooks/hooks.json` — the `block-no-verify` (PreToolUse) and `trace-subagent` (SubagentStop) hooks now ship as a plugin component; `tests/test_hooks_sync.py` guards it against drifting from `.claude/settings.json`. (CM-27)
- `.claude/CHANGELOG.md` + release-tag discipline via `claude plugin tag` (`codemaster--v<version>`). (CM-28)

### Fixed
- Broken YAML frontmatter — a `: ` (colon-space) inside the unquoted `description` — in `feature-intake/SKILL.md` and `code-explorer.md`, which made the whole frontmatter fail to parse and load with empty metadata at runtime. (CM-26)

[Unreleased]: https://github.com/hamzakabbaj/CodeMaster/commits/main
