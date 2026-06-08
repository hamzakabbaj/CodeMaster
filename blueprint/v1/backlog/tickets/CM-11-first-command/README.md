# CM-11: First slash command (validated)

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-1-capabilities-proving-ground
- **Type:** task
- **Status:** ✅ done

## Goal
Add one custom slash command in `.claude/commands/` and confirm it injects its prompt on `/name`.

## Acceptance criteria
- [x] Command file `start-ticket.md` with a reusable prompt template + `argument-hint`
- [x] Invocable via `/start-ticket <CM-n>`; uses `$1` for the ticket number
- [x] Distinct from a skill (no auto-trigger; explicit only)
- [x] [~] Live `/name` invocation pending session reload (same registry caveat as hooks/agents/skills)

## Verification
Procedure authored and reviewed; injects on explicit `/start-ticket`. Full live run after reload.

## Notes
Chose `/start-ticket` over `/checkpoint` to complete the skill+command pair: `new-ticket` (skill, auto-triggers on intent) creates a ticket; `/start-ticket` (command, explicit only) starts it. Validates the slash-command row of docs/01.
