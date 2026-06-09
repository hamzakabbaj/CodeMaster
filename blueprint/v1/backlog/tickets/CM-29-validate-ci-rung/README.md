# CM-29: Validate the plugin in CI + prove it installs cleanly (Phase 5 close)

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-5-package-as-plugin-track-b
- **Type:** task
- **Status:** 🟦 in progress

## Goal
Make the plugin packaging a real, enforced gate (not advisory) and prove the unit installs cleanly — closing Phase 5: wire `claude plugin validate .claude` into the verification ladder (ci.sh + ci.yml), add an isolated install-smoke, promote the changelog, and cut the first release tag.

## Acceptance criteria
- [ ] ci.sh gains a `Plugin manifest validation` rung (now 6/9): runs `claude plugin validate .claude` if the Claude CLI is present, else graceful-degrades with an install hint (mirrors the shellcheck/node rungs). Component ERRORS fail the rung; the two intentional agents/ README docs only warn.
- [ ] ci.yml mirrors it with a version-pinned step (`npx --yes @anthropic-ai/claude-code@2.1.169 plugin validate .claude`) — verified that `plugin validate` is a local, offline, no-auth operation (runs green under an empty CLAUDE_CONFIG_DIR), so it's safe in CI
- [ ] `scripts/plugin_install_smoke.sh` proves the `codemaster` plugin installs as a unit (local marketplace -> install -> `details` shows Skills + `Hooks (2)`) entirely under a THROWAWAY `CLAUDE_CONFIG_DIR`, so the real ~/.claude is never touched; it's an on-demand ship-readiness check, NOT a ci.sh rung (needs the CLI + mutates plugin state)
- [ ] `.claude/CHANGELOG.md` `[Unreleased]` promoted to `[0.1.0] - 2026-06-09`, with compare/tag reference links; CM-29's own additions recorded
- [ ] After merge: `claude plugin tag .claude` cuts the annotated tag `codemaster--v0.1.0` on main and it is pushed — the first release of the unit; Phase 5 exit ("CodeMaster installable as one unit") met
- [ ] scripts/ci.sh green (9 rungs)

## Verification
Added ci.sh rung 6 (plugin validate, graceful-degrade) + ci.yml pinned-npx step. Verified `claude plugin validate .claude` runs offline/no-auth (empty CLAUDE_CONFIG_DIR -> exit 0). `sh scripts/plugin_install_smoke.sh` -> `Component inventory: Skills (10), Agents (8), Hooks (2)` then uninstall/remove; confirmed real ~/.claude untouched (settings/cache/plugin-list clean). Promoted CHANGELOG to [0.1.0] - 2026-06-09. bash scripts/ci.sh green (9 rungs). Tag `codemaster--v0.1.0` cut + pushed post-merge.

## Plan
1) ci.sh: insert rung 6 'Plugin manifest validation' (claude plugin validate, graceful-degrade), renumber to /9. 2) ci.yml: pinned-npx validate step. 3) scripts/plugin_install_smoke.sh (isolated CLAUDE_CONFIG_DIR; asserts Skills + Hooks(2)). 4) Promote CHANGELOG [Unreleased] -> [0.1.0] - 2026-06-09. 5) ci green. 6) Post-merge: claude plugin tag .claude -> push codemaster--v0.1.0.

## Notes
Reframed from the 'Local install test' stub: the install test is the isolated smoke script, but the durable gate is the validate rung in CI (an install can't run in GitHub CI cleanly; validate can, offline). The CI runner lacks the Claude CLI, so ci.sh degrades gracefully (the push-gate is effective for any CodeMaster dev, who has the CLI by definition) and ci.yml installs it pinned. This is the phase-closing ticket: it also promotes the changelog and the `codemaster--v0.1.0` tag is cut after merge. Folder/slug renamed local-install-test -> validate-ci-rung.
