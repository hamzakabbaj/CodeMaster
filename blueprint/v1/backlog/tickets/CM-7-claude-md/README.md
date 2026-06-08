# CM-7: CLAUDE.md with invariants only

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-1-capabilities-proving-ground
- **Type:** task
- **Status:** ✅ done

## Goal
Create a project `CLAUDE.md` holding only always-true invariants (kept short — it's paid every turn).

## Acceptance criteria
- [x] Documents repo purpose, branch/commit rules, where things live
- [x] Points to docs/ and ROADMAP instead of duplicating them
- [x] No procedures (those become skills) and no transient state

## Verification
Start a session; confirm Claude follows the invariants without being re-told.

## Notes
Validates the "CLAUDE.md = invariants" row of docs/01.
