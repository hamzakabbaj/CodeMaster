# CM-18: tester subagent

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-3-subagent-fleet
- **Type:** task
- **Status:** ✅ done

## Goal
Adversarial test designer that finds edge cases and proposes concrete tests.

## Acceptance criteria
- [x] `.claude/agents/tester.md` — read-only, `sonnet`, mirrors our `unittest`/ladder style
- [x] Returns prioritized gaps + paste-ready tests; no edits
