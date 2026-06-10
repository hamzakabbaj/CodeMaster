# Changelog

All notable changes to the **CodeMaster** plugin — the `plugin/` unit declared by
`plugin/.claude-plugin/plugin.json` — are recorded here.

- Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html); the version of record is `plugin.json`'s `version`.
- CodeMaster ships an **in-repo marketplace** (`.claude-plugin/marketplace.json` → `./plugin`), so any project can `claude plugin marketplace add <repo>` → `claude plugin install codemaster@codemaster` (CM-76). Changes accumulate under `[Unreleased]`; cut a release with `claude plugin tag plugin` — see `docs/03-delivery-process.md` §6.

## [Unreleased]

### Added
- In-repo marketplace (`.claude-plugin/marketplace.json`, source `./plugin`) so the plugin installs into **any project**: `claude plugin marketplace add <repo>` → `claude plugin install codemaster@codemaster` (user scope). CI validates the marketplace manifest; `scripts/plugin_install_smoke.sh` exercises the real marketplace. (CM-76)

### Changed
- Relocated the plugin into a dedicated **`plugin/`** folder (`.claude-plugin/`, `skills/`, `agents/`, `commands/`, `hooks/`, this `CHANGELOG.md`) so the unit is one obvious folder. (CM-75)
- **One way to load the plugin: install it.** Removed the `.claude/{skills,agents,commands,hooks}` symlinks — the plugin no longer auto-loads natively; it loads only via marketplace install (in this repo too, through `scripts/setup.sh`). Hooks now come from the plugin's `hooks.json` (dropped from `.claude/settings.json`; retired the now-moot `test_hooks_sync.py` drift guard). Editing `plugin/` requires `uninstall` + `reinstall` to take effect. (CM-77)

## [0.1.0] - 2026-06-09

First packaged version of the engineering OS — `.claude/` is now a coherent, versioned, CI-validated plugin unit (Phase 5). Still dogfooded in-repo: loaded natively, no marketplace, nothing installed.

### Added
- `plugin.json` manifest — packages `.claude/` as the `codemaster` plugin unit (name, version, validatable components); the repo keeps loading `.claude/` natively, no marketplace, nothing installed. (CM-26)
- `.claude/hooks/hooks.json` — the `block-no-verify` (PreToolUse) and `trace-subagent` (SubagentStop) hooks now ship as a plugin component; `tests/test_hooks_sync.py` guards it against drifting from `.claude/settings.json`. (CM-27)
- `.claude/CHANGELOG.md` + release-tag discipline via `claude plugin tag` (`codemaster--v<version>`). (CM-28)
- Plugin manifest validation wired into the verification ladder — `claude plugin validate .claude` as ci.sh rung 6 (graceful-degrade) + a version-pinned ci.yml step; `scripts/plugin_install_smoke.sh` proves the unit installs cleanly under an isolated config. (CM-29)

### Fixed
- Broken YAML frontmatter — a `: ` (colon-space) inside the unquoted `description` — in `feature-intake/SKILL.md` and `code-explorer.md`, which made the whole frontmatter fail to parse and load with empty metadata at runtime. (CM-26)

[Unreleased]: https://github.com/hamzakabbaj/CodeMaster/compare/codemaster--v0.1.0...HEAD
[0.1.0]: https://github.com/hamzakabbaj/CodeMaster/releases/tag/codemaster--v0.1.0
