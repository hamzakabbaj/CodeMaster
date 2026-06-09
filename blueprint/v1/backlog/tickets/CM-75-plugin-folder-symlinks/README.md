# CM-75: Dedicated `plugin/` folder for the codemaster plugin (symlinked into `.claude/`)

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-5-package-as-plugin-track-b
- **Type:** task
- **Status:** 🟦 in progress

## Goal
Make the plugin self-evident: move all plugin components into one dedicated `plugin/` folder (the unit), and symlink them back into `.claude/` so Claude Code still loads them natively with instant edits and plain `claude` launches. Solves 'what belongs to the plugin?' structurally — `plugin/` IS the plugin.

## Acceptance criteria
- [ ] Components live as REAL files under `plugin/`: `.claude-plugin/plugin.json`, `skills/`, `agents/`, `commands/`, `hooks/`, `CHANGELOG.md`. `.claude/` keeps only project-only files (`settings.json`, `settings.local.json`, `workflows/`).
- [ ] `.claude/{skills,agents,commands,hooks}` are symlinks into `../plugin/` so native loading still works with plain `claude` and instant edits — VERIFIED that Claude Code native skill-loading follows symlinks (throwaway probe loaded after a restart), and re-confirmed for the full set after the move
- [ ] `claude plugin validate plugin` passes (exit 0; only the two intentional agents/ README warnings); ci.sh rung 6 + ci.yml updated to validate `plugin` (the real root) instead of `.claude`
- [ ] `scripts/plugin_install_smoke.sh` updated to package `plugin/` (not `.claude/`) and still proves a clean install (Skills + Hooks(2)) under an isolated CLAUDE_CONFIG_DIR
- [ ] `tests/test_hooks_sync.py` reads the real `plugin/hooks/hooks.json` vs `.claude/settings.json` and stays green; drift guard intact
- [ ] Reference updates: `docs/03-delivery-process.md` §6 (paths + `claude plugin tag plugin`), CHANGELOG `[Unreleased]` entry for the layout move. Relative links inside moved files stay valid (plugin/skills/X is the same depth from root as .claude/skills/X).
- [ ] scripts/ci.sh green (9 rungs); no behavior change to any primitive — pure relocation

## Verification
TBD on the branch: git mv components to plugin/, symlink from .claude/, update refs, `claude plugin validate plugin` green, ci.sh green, install smoke on plugin/ green, and a confirming restart that all real skills/agents load via the symlinks before merge.

## Plan
1) git mv .claude/{.claude-plugin,skills,agents,commands,hooks,CHANGELOG.md} -> plugin/. 2) ln -s ../plugin/{skills,agents,commands,hooks} into .claude/. 3) ci.sh rung 6 + ci.yml: validate `plugin`. 4) plugin_install_smoke.sh: package plugin/. 5) test_hooks_sync.py: PLUGIN_HOOKS=plugin/hooks/hooks.json. 6) docs/03 §6 + CHANGELOG [Unreleased]. 7) validate + ci + smoke green. 8) confirming restart. 9) ship + re-close epic.

## Notes
Follow-on refinement after Phase 5 closed (v0.1.0 tagged): the user wanted one obvious folder = the plugin, instead of components spread inside .claude/ (a hidden dir shared with settings.json/workflows). Verified the enabling fact by running: native load follows symlinks (probe). Rejected alternatives (all tested): `--plugin-dir` can't persist in settings (CLI-only -> footgun); marketplace-install caches and needs uninstall+reinstall per edit. Symlinks give the dedicated folder while keeping the zero-friction native loop. Caveat: git symlinks are macOS/Linux-oriented (core.symlinks). No version bump / re-tag — pure internal relocation; components unchanged. Reopens the phase-5 epic; re-closed on merge.
