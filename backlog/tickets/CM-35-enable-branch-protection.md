# CM-35: Enable branch protection on main

- **Epic:** Phase 0 — Delivery Infrastructure (deferred item)
- **Type:** task
- **Status:** ⏸️ blocked (GitHub plan)
- **Branch:** `feat/CM-35-enable-branch-protection`

## Goal
Make the PR + green-CI rule actually enforced by GitHub (block direct pushes to `main`), not just documented in CONTRIBUTING.

## Acceptance criteria
- [x] A versioned, idempotent script applies the protection via `gh api` (`scripts/setup-branch-protection.sh`)
- [ ] `main` requires a PR and the `Quality gates` status check before merge — **blocked**
- [ ] Direct pushes / force-pushes / deletion of `main` are blocked — **blocked**
- [ ] Protection verified by reading it back via `gh api` — **blocked**

## Blocker
Both classic branch protection and rulesets require **GitHub Pro or a public repo**; this repo is private on a free plan → HTTP 403. Decision (2026-05-29): **defer** — keep the script, rely on the local cage (commit-msg hook, `--no-verify` guard, `ci.sh`) + CI on every PR. Apply when the repo goes public (plugin endgame, Track B/C) or upgrades. Run `scripts/setup-branch-protection.sh` then.

## Notes
Solo-dev tuning baked into the script: 0 required approvals (PR required, no second reviewer); `enforce_admins` off so we can recover if CI wedges. Reusable for Track B/C repos.
