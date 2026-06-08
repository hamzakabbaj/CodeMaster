# CM-19: devops subagent

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-3-subagent-fleet
- **Type:** task
- **Status:** ✅ done

## Goal
CI/CD + reproducibility reviewer focused on the deterministic cage and local↔CI parity.

## Acceptance criteria
- [x] `.claude/agents/devops.md` — read-only, `sonnet`
- [x] Hunts silent skips / swallowed failures / drift; returns fixes, no edits
