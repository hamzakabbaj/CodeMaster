# CM-16: Run the robust-code loop on a tiny sample feature

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-2-robust-code-loop
- **Type:** task
- **Status:** ✅ done

## Goal
Exercise the full loop (spec → plan → implement → verify → critique) on a real, tiny feature with unit tests — and fill the ladder's test rung (the CM-12 extension point) with actual tests.

## Acceptance criteria
- [x] `roadmap_stats.py` with a pure `count_tickets(text)` / `summary(text)` core + CLI
- [x] `tests/test_roadmap_stats.py` covering done/open/empty/non-ticket/summary (5 tests)
- [x] `ci.sh` + CI gained a unit-test rung (now 5 rungs)
- [x] Full ladder green; a deliberately failing test stopped the ladder at rung 2
- [x] Ran the loop spec→implement→verify→critique (live output in PR)

## Notes
First real code in the repo. Proves doc 02 end to end and activates the test rung for Track B/C.
