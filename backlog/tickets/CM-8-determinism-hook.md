# CM-8: Hook — PreToolUse deny-gate + PostToolUse formatter

- **Epic:** Phase 1 — Capabilities Proving Ground
- **Type:** task
- **Status:** ⬜ todo
- **Branch:** `feat/CM-8-determinism-hook`

## Goal
Prove the determinism boundary inside a Claude session: block a protected action before it runs, and auto-act after a tool runs.

## Acceptance criteria
- [ ] PreToolUse hook denies a defined dangerous/protected operation (e.g. edit under a protected path)
- [ ] PostToolUse hook fires automatically (e.g. format/log) after an edit
- [ ] Configured in settings.json; behavior demonstrated live

## Verification
Trigger the protected action → observe it blocked. Edit a file → observe the post hook fire.

## Notes
This is the in-session analogue of the commit-msg hook we built in CM-2. Validates docs/01 hook events.
