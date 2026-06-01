# CM-16: Run the robust-code loop on a tiny sample feature

- **Epic:** Phase 2 — Robust-Code Loop
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-16-sample-feature`

## Goal
Exercise the full loop (spec → plan → implement → verify → critique) on a real, tiny feature with unit tests — and fill the ladder's test rung (the CM-12 extension point) with actual tests.

## Feature
`scripts/roadmap_stats.py` — parse `ROADMAP.md`, count `CM-<n>` tickets done vs open, print a one-line summary. Pure Python (no deps). Tests in `tests/` via `unittest`.

## Acceptance criteria
- [x] `roadmap_stats.py` with a pure `count_tickets(text)` / `summary(text)` core + CLI
- [x] `tests/test_roadmap_stats.py` covering done/open/empty/non-ticket/summary (5 tests)
- [x] `ci.sh` + CI gained a unit-test rung (now 5 rungs)
- [x] Full ladder green; a deliberately failing test stopped the ladder at rung 2
- [x] Ran the loop spec→implement→verify→critique (live output in PR)

## Notes
First real code in the repo. Proves doc 02 end to end and activates the test rung for Track B/C.
