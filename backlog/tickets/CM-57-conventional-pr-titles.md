# CM-57: Require Conventional-Commit PR titles (squash subject)

- **Epic:** Phase 0 — Delivery Infrastructure
- **Type:** docs
- **Status:** 🟦 in progress
- **Branch:** `feat/CM-57-conventional-pr-titles`

## Goal
Document, in the git contract, that a PR title must itself be a valid Conventional Commit — because squash-merge uses the PR title as the `main` commit subject, where the `commit-msg` gate then validates it on the `push` event.

## Acceptance criteria
- [ ] `CONTRIBUTING.md` "Pull requests" states the PR title must be a Conventional Commit and explains why (squash subject).
- [ ] `scripts/ci.sh` green.

## Verification
`bash scripts/ci.sh` → green. The squash-merge of this PR lands a conventional subject on `main`, restoring a green main `push` run.

## Notes
Root-caused from CM-56 (#33): its PR title "Harden blueprint skills…" had no `type:` prefix, so the squash commit failed the commit-message rung on the post-merge `push` event (PR-event CI passed because it validates the branch commits, which were all conventional). Local rungs can't see a future PR title, so this is a documented discipline; a stronger fix (a GitHub Action linting PR titles) is a possible follow-up.
