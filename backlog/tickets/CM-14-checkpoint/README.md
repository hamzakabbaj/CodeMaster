# CM-14: checkpoint helper (green-gated commit)

- **Epic:** Phase 2 — Robust-Code Loop
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-13-loop-tooling`

## Goal
A helper that commits the current work as a checkpoint **only if the verification ladder passes** — checkpoint on green, never on red (doc 02).

## Acceptance criteria
- [x] `scripts/checkpoint.sh "<subject>"` runs `ci.sh`, then commits on green
- [x] Refuses on `main`; no-ops on a clean tree; requires a subject
- [x] Rollback path documented in the header (restore / reset)
- [x] shellcheck-clean

## Notes
Rollback kept as documented git commands (destructive — prefer explicit over a script).
