# CM-36: Fix /start-ticket arg substitution + new-ticket handoff

- **Epic:** Phase 1 — Capabilities Proving Ground (bugs found in CM-11 smoke-test)
- **Type:** fix
- **Status:** ✅ done
- **Branch:** `fix/CM-36-start-ticket-args`

## Problem
Two bugs surfaced when live-testing `/start-ticket`:
1. **Arg substitution:** the command used `$1`, which did not populate; Claude Code injects `$ARGUMENTS`. The command rendered `CM-` with no number.
2. **Handoff friction:** `new-ticket` leaves an uncommitted scaffold, but `/start-ticket` hard-required a clean tree, so the two could not compose in sequence.

## Fix
1. Replace `$1` with `$ARGUMENTS` throughout `start-ticket.md`.
2. Soften the guard: require being on `main` (and up to date), but allow uncommitted changes — they are carried onto the new branch (which is exactly the fresh ticket scaffold). Document the intended order: `new-ticket` → `/start-ticket <n>`.

## Acceptance criteria
- [x] `start-ticket.md` uses `$ARGUMENTS`; live invocation rendered `CM-35` (was blank)
- [x] Guard no longer blocks on the new-ticket scaffold; still refuses if not on `main` (verified: stopped on `fix/CM-36`)
- [x] `new-ticket` already notes the `/start-ticket` follow-up (skill step 5)

## Verification
Re-invoke `/start-ticket 35` from a non-main branch: the prompt renders `CM-35` (proves `$ARGUMENTS`) and stops at the on-main check (no side effects).
