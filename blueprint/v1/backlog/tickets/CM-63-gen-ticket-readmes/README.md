# CM-63: Generate a synced README.md next to each ticket.json

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-0-delivery-infrastructure
- **Type:** task
- **Status:** ✅ done

## Goal
Restore a human-readable, GitHub-rendered ticket view by generating a synced README.md from each ticket.json — the gen_roadmap pattern applied per ticket.

## Acceptance criteria
- [x] scripts/gen_tickets.py renders each foldered ticket.json to a sibling README.md (GitHub-rendered view); ticket.json stays the source of truth
- [x] README.md links to sibling plan.md / evidence.md when present
- [x] The pre-commit hook regenerates ticket READMEs (and ROADMAP.md) when backlog JSON is staged and re-stages them
- [x] A CI rung (gen_tickets.py --check) fails on drift; rung 6/8 now checks ROADMAP.md + ticket READMEs together
- [x] backlog/README.md documents README.md as a generated, never-hand-edited view
- [x] scripts/ci.sh green (8 rungs)

## Verification
python3 scripts/gen_tickets.py --check (62 READMEs in sync); bash scripts/ci.sh green. (Ladder: the generated-views-in-sync rung.)

## Notes
Asked for after CM-62 removed the markdown ticket bodies: 'a synced md living next to the json'. Only foldered tickets get a README (flat example slices stay JSON-only). README bodies carry no inbound links, so no link-depth issues.
