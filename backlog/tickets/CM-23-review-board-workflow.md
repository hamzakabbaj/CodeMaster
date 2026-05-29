# CM-23: review-board workflow

- **Epic:** Phase 4 — Orchestration
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-23-orchestration`

## Goal
A deterministic workflow that orchestrates a multi-dimension review (the fleet's roles as a pipeline) over a target.

## Acceptance criteria
- [x] `.claude/workflows/review-board.mjs` — `pipeline` over review dimensions
- [x] Self-contained (inline role prompts) so it runs without the fleet registered and is portable
- [x] Cost-routed (sonnet review, haiku skeptics), bounded (capped findings/dimension)

## Notes
Materializes docs/05. Pairs with CM-24 (adversarial verify) and CM-25 (live run).
