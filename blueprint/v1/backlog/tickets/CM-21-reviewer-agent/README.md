# CM-21: reviewer subagent

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-3-subagent-fleet
- **Type:** task
- **Status:** ✅ done

## Goal
PR reviewer that checks the diff against our conventions + Definition of Done.

## Acceptance criteria
- [x] `.claude/agents/reviewer.md` — Read/Grep/Glob + Bash (read-only git), `sonnet`
- [x] Returns approve/block + checklist (must-fix vs nit); no edits/commits/pushes
