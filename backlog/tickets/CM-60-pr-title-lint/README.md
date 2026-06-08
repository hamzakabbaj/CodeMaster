# CM-60: Lint PR titles in CI — protect the squash subject

- **Epic:** Phase 0 — Delivery Infrastructure
- **Type:** ci
- **Status:** ✅ done
- **Branch:** `feat/CM-60-pr-title-lint`

## Goal
Catch a malformed PR title **before merge** by running the `commit-msg` hook on it, so a bad title can't become a non-conforming squash subject that turns `main` red post-merge.

## Acceptance criteria
- [x] `.github/workflows/pr-title.yml` runs on `pull_request` and validates `github.event.pull_request.title` by feeding it to `.githooks/commit-msg` (single source of truth — no duplicated regex).
- [x] The gate rejects both failure modes seen in practice: a non-conventional type (CM-57) and an over-72-char subject (CM-59).
- [x] `CONTRIBUTING.md` "Pull requests" documents the rule (Conventional Commit, subject ≤ 72) and names the new check.
- [x] `scripts/ci.sh` green; this PR's own (short, conventional) title passes the new gate.

## Verification
- Local proof: `printf '<title>\n' | .githooks/commit-msg /dev/stdin` rejects the CM-59 title (with and without ` (#N)`) and passes a short conventional title.
- On this PR: the **PR title** check runs and passes; post-merge `main` push run is green.

## Notes
Root cause: squash-merge uses the PR title as the `main` commit subject, validated by `commit-msg` only on the post-merge `push` event — so the PR's own green CI didn't catch it. This bit twice (CM-57 wrong type, CM-59 too long). Per CLAUDE.md "prefer code over instruction", the fix is a gate, not just the CM-57 doc note. Reusing the hook keeps one definition of "valid". A future hardening could block merge on this check via branch protection (CM-35).
