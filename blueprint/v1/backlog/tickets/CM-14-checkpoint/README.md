# CM-14: checkpoint helper (green-gated commit)

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-2-robust-code-loop
- **Type:** task
- **Status:** ✅ done

## Goal
A helper that commits the current work as a checkpoint **only if the verification ladder passes** — checkpoint on green, never on red (doc 02).

## Acceptance criteria
- [x] `scripts/checkpoint.sh "<subject>"` runs `ci.sh`, then commits on green
- [x] Refuses on `main`; no-ops on a clean tree; requires a subject
- [x] Rollback path documented in the header (restore / reset)
- [x] shellcheck-clean

## Notes
Rollback kept as documented git commands (destructive — prefer explicit over a script).
