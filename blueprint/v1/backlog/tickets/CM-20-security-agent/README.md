# CM-20: security subagent

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-3-subagent-fleet
- **Type:** task
- **Status:** ✅ done

## Goal
AppSec reviewer: secrets, injection, authz, untrusted input, supply chain.

## Acceptance criteria
- [x] `.claude/agents/security.md` — read-only, `opus`, threat-lens prompt
- [x] Returns ranked risks (attack→impact→fix); no edits
