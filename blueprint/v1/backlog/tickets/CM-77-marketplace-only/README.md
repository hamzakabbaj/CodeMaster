# CM-77: Remove symlinks — one way to load the plugin: marketplace install

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-5-package-as-plugin-track-b
- **Type:** task
- **Status:** 🟦 in progress

## Goal
Collapse to a SINGLE loading mechanism: drop the `.claude/` symlinks (CM-75) so the codemaster plugin loads only by being installed from the in-repo marketplace (CM-76) — in this repo too, via setup.sh. Per the user's call: one consistent way to test, accepting the uninstall+reinstall refresh.

## Acceptance criteria
- [ ] The four `.claude/{skills,agents,commands,hooks}` symlinks are removed; `.claude/` keeps only `settings.json` (now hookless) + `settings.local.json` + `workflows/`. The plugin's real files stay in `plugin/`.
- [ ] Hooks come ONLY from the installed plugin (`plugin/hooks/hooks.json`): removed the PreToolUse/SubagentStop block from `.claude/settings.json` (else double-fire once installed); retired `tests/test_hooks_sync.py` (the settings.json<->hooks.json drift it guarded no longer exists).
- [ ] `scripts/setup.sh` installs the plugin: `claude plugin marketplace add . && claude plugin install codemaster@codemaster` (user scope), alongside the existing `core.hooksPath` git-hook activation — so setup.sh is the single activation point (git cage + plugin).
- [ ] Broken-by-the-move references fixed: `scripts/validate-blueprint.js` reads schemas from `plugin/skills/...` (was `.claude/skills/...`, which broke CI rung 5); agent memory-convention paths + `new-ticket`'s `next-number.sh` path repointed to `plugin/...`; docs/01, docs/04, backlog READMEs updated. Historical refs (ROADMAP CM-22 prose, the `[0.1.0]` CHANGELOG entry) left as-is.
- [ ] docs/03 §6 rewritten to the single install flow (no symlinks/two-audience); CHANGELOG `[Unreleased]` reconciled (CM-75 symlink claim corrected, CM-77 entry added).
- [ ] scripts/ci.sh green (9 rungs). NOTE: the block-no-verify Claude-session guard is now install-provided (active after setup.sh), but the REAL git-level cage (.githooks commit-msg + pre-commit, via core.hooksPath) is unchanged and always on.

## Verification
Removed the 4 symlinks (git rm). Confirmed by running: the symlink removal unloaded the CodeMaster skills from the live session (they now come only from install). Fixed validate-blueprint.js schema paths -> CI rung 5 green again. `claude plugin validate plugin` + marketplace still green. `scripts/plugin_install_smoke.sh` proves install-from-real-marketplace works (Skills+Hooks(2)), isolated config. bash scripts/ci.sh green (9 rungs; test_hooks_sync removed, roadmap_stats remains). No live `.claude/{skills,agents,commands,hooks}` refs remain except generated/historical.

## Plan
1) git rm the 4 .claude symlinks. 2) settings.json -> drop hooks (plugin provides them); rm tests/test_hooks_sync.py. 3) setup.sh -> marketplace add + install codemaster. 4) Fix CI-breaking + stale refs: validate-blueprint.js schema paths, agent memory paths, next-number path, docs/01+04, backlog READMEs. 5) docs/03 §6 single-flow rewrite + CHANGELOG. 6) ci green. 7) ship + close epic in-PR.

## Notes
User decision: drop the dual mechanism (symlinks for dev + marketplace for consumers, CM-75/76) in favor of ONE way — marketplace install everywhere, accepting the cached-copy refresh (uninstall+reinstall per edit). Trade-off captured: this repo no longer auto-loads its own tooling; setup.sh installs it (CLAUDE.md's 'run setup.sh once to activate hooks' now also installs the plugin). The block-no-verify session guard becomes install-dependent; the git-level cage is unaffected. Reopens + re-closes the phase-5 epic in this PR. No re-tag (still pre-release on the layout).
