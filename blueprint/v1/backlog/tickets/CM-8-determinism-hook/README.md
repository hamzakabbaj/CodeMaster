# CM-8: Hook — PreToolUse deny-gate + PostToolUse formatter

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-1-capabilities-proving-ground
- **Type:** task
- **Status:** ✅ done

## Goal
Prove the determinism boundary inside a Claude session: block a protected action (a commit that bypasses our git hooks) before it runs.

## Acceptance criteria
- [x] PreToolUse hook denies `git commit --no-verify` / `-n` (logic pipe-tested across 5 cases)
- [x] Configured in project `.claude/settings.json`; structure validated via `jq -e`
- [x] Live in-session proof: after session restart, a real `git commit --no-verify` was blocked by the hook with the expected message (settings-watcher caveat confirmed — needed the reload)

## Verification
Pipe-test: synthesized hook stdin for `--no-verify`, `-n`, normal commit, `git status -n`, `npm run -n` → only real commit-bypasses denied. After `/hooks` reload, a real `git commit --no-verify` is blocked. Backstop: server CI re-validates commit messages regardless.

## Notes
In-session analogue of the `.githooks/commit-msg` gate (CM-2). Validates docs/01 hook events.
