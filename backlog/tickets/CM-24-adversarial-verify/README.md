# CM-24: adversarial-verify pattern

- **Epic:** Phase 4 — Orchestration
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-23-orchestration`

## Goal
Bake the adversarial-verify pattern (docs/05) into the review-board: every finding is challenged by skeptics; only survivors are reported.

## Acceptance criteria
- [x] Per finding, N skeptics (haiku) each try to REFUTE; default refuted=true when uncertain
- [x] Finding killed if ≥ majority refute; survivors returned
- [x] Prevents plausible-but-wrong findings from surviving

## Notes
Nested `parallel` (skeptics) inside the pipeline verify stage. Implemented in `review-board.mjs`.
