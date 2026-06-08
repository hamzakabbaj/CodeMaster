# CM-35: Enable branch protection on main

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-0-delivery-infrastructure
- **Type:** task
- **Status:** ⏸️ blocked

## Goal
Make the PR + green-CI rule actually enforced by GitHub (block direct pushes to `main`), not just documented in CONTRIBUTING.

## Acceptance criteria
- [ ] A versioned, idempotent script applies the protection via `gh api` (`scripts/setup-branch-protection.sh`)
- [ ] `main` requires a PR and the `Quality gates` status check before merge — **blocked**
- [ ] Direct pushes / force-pushes / deletion of `main` are blocked — **blocked**
- [ ] Protection verified by reading it back via `gh api` — **blocked**

## Notes
Solo-dev tuning baked into the script: 0 required approvals (PR required, no second reviewer); `enforce_admins` off so we can recover if CI wedges. Reusable for Track B/C repos.
