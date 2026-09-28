# Changelog

All notable changes to the **CodeMaster** plugin — the `plugin/` unit declared by
`plugin/.claude-plugin/plugin.json` — are recorded here.

- Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html); the version of record is `plugin.json`'s `version`.
- CodeMaster ships an **in-repo marketplace** (`.claude-plugin/marketplace.json` → `./plugin`), so any project can `claude plugin marketplace add <repo>` → `claude plugin install codemaster@codemaster` (CM-76). Changes accumulate under `[Unreleased]`; cut a release with `claude plugin tag plugin` — see `docs/03-delivery-process.md` §6.

## [Unreleased]

### Added
- **`/codemaster-init`** — one entry point for setting a project up, replacing `/tracker-init` (kept as an alias). Flags instead of prompts (`--tracker=folder|plane`, `--root`, `--id-prefix`, `--workspace`, `--project`), so a setup is scriptable and replayable. Run bare it's a **doctor**, and `--check` runs the doctor without writing (CI-friendly): it reports whether `provider.md` has gone stale against the installed plugin, whether the backlog root and `plane.env` are actually gitignored, and — for `plane` — whether the credentials resolve and every `statusMap` value names a state group that **exists in that instance**. Re-running the same provider is an idempotent refresh; switching providers over a non-empty backlog orphans its items and now requires `--force` instead of silently rewriting `config.json`.
- `plugin/README.md` — a consumer-facing front page (overview, install + uninstall/reinstall refresh, a catalog of the commands/skills/agents/hooks, the greenfield flow, and the cross-project self-hosting caveat), matching the convention every substantial official plugin follows. (CM-78)
- In-repo marketplace (`.claude-plugin/marketplace.json`, source `./plugin`) so the plugin installs into **any project**: `claude plugin marketplace add <repo>` → `claude plugin install codemaster@codemaster` (user scope). CI validates the marketplace manifest; `scripts/plugin_install_smoke.sh` exercises the real marketplace. (CM-76)

### Changed
- **`design-options` is now a doc slot of its own — six named slots, not five** (`spec` · `design-options` · `plan` · `architecture` · `acceptance-tests` · `evidence`). `/design-options` used to fold the chosen variant into the `plan` doc, which buried it: `plan` is *how we'll build it* (written by `frame`), while `design-options` is *what we decided it should look like and what we rejected* (decided by the human at a gate) — different authors, different moments, and a ticket can have a design decision with no plan at all. `build` now reads it back and must implement the chosen variant rather than re-litigating it. `plugin/tracker/README.md` gains a table defining all six slots, their altitude, and who writes/reads each; both providers say where the new slot is stored (folder → `design-options.md`; plane → a card comment, so the decision sits in the timeline next to the moment it was made). The tracker README also now states that **an empty slot is a statement, not an omission**, and `build` may attach `architecture` itself when a critique round moves a boundary.
- **The tracker has no silent default any more.** A repo without `.codemaster/config.json` is *unconfigured*: `roadmap`, `backlog`, `new-ticket`, `/spec`, `/start-ticket`, and `/ship` stop and route to `/codemaster-init` instead of falling back to `folder` at `blueprint/v1/backlog`. The old fallback silently handed a fresh project CodeMaster's own historical backlog path with **no `.gitignore` entry** (that entry is only written by init) — so the backlog was on track to be committed, contradicting "the git repo holds only the product".
- Default `folder` backlog root is now **`.codemaster/backlog`** (was `blueprint/v1/backlog`, a CodeMaster-specific path that made no sense in a consuming repo), and `idPrefix` defaults to the repo name's initials. Existing projects are unaffected — their root is pinned in `config.json`.
- `new-ticket` now **inlines** its next-`CM-<n>` computation instead of pointing at a bundled `next-number.sh` (deleted) — skill bodies can't rely on `${CLAUDE_PLUGIN_ROOT}`, so the old repo-relative path resolved only inside the source repo. Matches the official convention that skills carry no scripts; `feature-intake`'s references updated to match. (CM-79)
- Relocated the plugin into a dedicated **`plugin/`** folder (`.claude-plugin/`, `skills/`, `agents/`, `commands/`, `hooks/`, this `CHANGELOG.md`) so the unit is one obvious folder. (CM-75)
- **One way to load the plugin: install it.** Removed the `.claude/{skills,agents,commands,hooks}` symlinks — the plugin no longer auto-loads natively; it loads only via marketplace install (in this repo too, through `scripts/setup.sh`). Hooks now come from the plugin's `hooks.json` (dropped from `.claude/settings.json`; retired the now-moot `test_hooks_sync.py` drift guard). Editing `plugin/` requires `uninstall` + `reinstall` to take effect. (CM-77)

### Removed
- **The `trace-subagent` hook (`SubagentStop`).** It only fired on `feat/CM-*` branches and wrote into CodeMaster's own historical `blueprint/v1/backlog/tickets/` layout, so in a consuming repo it never did anything; it also still keyed on the pre-rename `tester` agent. Agent conclusions that matter belong in the ticket's `evidence` doc via the tracker, not a hardcoded repo path. `block-no-verify` is now the plugin's only hook.

### Fixed
- `/tracker-init plane` wrote `"blocked": "blocked"` into `statusMap`, but Plane has **no `blocked` state group** (`backlog · unstarted · started · completed · cancelled`) — the provider models blocked as a *label*. The bad value was invisible until a transition tried to use it. It's no longer written, and `--check` flags it in existing configs.

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
