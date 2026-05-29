# CM-8: Hook — PreToolUse deny-gate + PostToolUse formatter

- **Epic:** Phase 1 — Capabilities Proving Ground
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-8-determinism-hook`

## Goal
Prove the determinism boundary inside a Claude session: block a protected action (a commit that bypasses our git hooks) before it runs.

## Acceptance criteria
- [x] PreToolUse hook denies `git commit --no-verify` / `-n` (logic pipe-tested across 5 cases)
- [x] Configured in project `.claude/settings.json`; structure validated via `jq -e`
- [~] Live in-session proof deferred to user: requires `/hooks` reload or restart (settings watcher caveat — file didn't exist at session start)

## Scope note
Narrowed to the PreToolUse deny-gate only. A PostToolUse logger/formatter was dropped to avoid noisy false alarms (e.g. warning on links to not-yet-created files); easy follow-up if wanted.

## Verification
Pipe-test: synthesized hook stdin for `--no-verify`, `-n`, normal commit, `git status -n`, `npm run -n` → only real commit-bypasses denied. After `/hooks` reload, a real `git commit --no-verify` is blocked. Backstop: server CI re-validates commit messages regardless.

## Notes
In-session analogue of the `.githooks/commit-msg` gate (CM-2). Validates docs/01 hook events.
