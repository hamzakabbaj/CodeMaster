# CM-17: architect subagent

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-3-subagent-fleet
- **Type:** task
- **Status:** ✅ done

## Goal
Design-review subagent that judges changes against CodeMaster doctrine.

## Acceptance criteria
- [x] `.claude/agents/architect.md` — read-only (Read/Grep/Glob), `opus`, doctrine-aware
- [x] Returns approve/revise/reject + leverage points; no edits
