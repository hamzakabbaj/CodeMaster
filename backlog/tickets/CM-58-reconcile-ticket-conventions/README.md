# CM-58: Reconcile ticket conventions — convert CM-56/57 to folder-per-ticket

- **Epic:** Phase 0 — Delivery Infrastructure
- **Type:** fix
- **Status:** ✅ done
- **Branch:** `feat/CM-58-reconcile-ticket-conventions`

## Goal
Restore the folder-per-ticket convention (`backlog/tickets/CM-<n>-<slug>/README.md`) for CM-56 and CM-57, which were hand-rolled as flat `.md` files in violation of it, and clear CM-57's lagging status.

## Acceptance criteria
- [ ] `backlog/tickets/CM-56-harden-blueprint-skills/README.md` and `backlog/tickets/CM-57-conventional-pr-titles/README.md` exist (flat `.md` files removed) — moved via `git mv` to preserve history.
- [ ] CM-57 marked `✅ done` in both its README and ROADMAP (it merged in #34 but its checkbox lagged).
- [ ] The backlog-skill gap is filed as a follow-up ticket (CM-59).
- [ ] `scripts/ci.sh` is green.

## Verification
- `ls backlog/tickets/CM-5[67]-*/README.md` → both resolve; no flat `CM-5[67]-*.md` remain.
- `bash scripts/ci.sh` → green.

## Notes
Root cause: CM-56/57 were created by hand from memory of the *old* flat-file procedure instead of invoking the `new-ticket` skill, which correctly mandates a folder + `README.md` (`backlog/README.md` "Ticket layout"). The blueprint Step-4 backlog (`examples/*/blueprint/v1/backlog/tickets/*.json`) is a *different* representation and stays flat JSON per greenfield doctrine — only CodeMaster's own `backlog/tickets/` is folder-per-ticket. Lesson reinforced: always go through `/new-ticket`.
