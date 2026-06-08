# CM-36: Fix /start-ticket arg substitution + new-ticket handoff

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-1-capabilities-proving-ground
- **Type:** fix
- **Status:** ✅ done

## Goal
Fix /start-ticket arg substitution + new-ticket handoff

## Acceptance criteria
- [x] `start-ticket.md` uses `$ARGUMENTS`; live invocation rendered `CM-35` (was blank)
- [x] Guard no longer blocks on the new-ticket scaffold; still refuses if not on `main` (verified: stopped on `fix/CM-36`)
- [x] `new-ticket` already notes the `/start-ticket` follow-up (skill step 5)

## Verification
Re-invoke `/start-ticket 35` from a non-main branch: the prompt renders `CM-35` (proves `$ARGUMENTS`) and stops at the on-main check (no side effects).
