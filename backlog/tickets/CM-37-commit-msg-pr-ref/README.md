# CM-37: commit-msg hook tolerates squash PR-ref suffix

- **Epic:** Phase 0 — Delivery Infrastructure (bug found post-merge in CM-12)
- **Type:** fix
- **Status:** ✅ done
- **Branch:** `fix/CM-37-commit-msg-pr-ref`

## Problem
GitHub squash-merge appends ` (#<PR>)` to the commit subject. The `commit-msg`
hook counted that suffix toward the 72-char limit, so the **push-to-main** CI
(which validates the squash commit) failed for subjects near the limit — e.g.
CM-12's `... fast ladder (CM-12) (#10)` (77 chars after the type prefix). The
PR-event CI passed because it validated the original commit (exactly 72).

Process gap: we verified PR-event CI but not the post-merge main CI.

## Fix
Strip a trailing ` (#<digits>)` PR reference before the format/length check, so
the squash suffix is metadata and doesn't count. Keep subjects ≤ ~60 by habit
to leave headroom.

## Acceptance criteria
- [x] Hook strips a trailing ` (#<n>)` before validating
- [x] CM-12-style squash subject (`...(CM-12) (#10)`) passes
- [x] A genuinely over-72 subject (no PR ref) still fails
- [x] Normal subjects unaffected; hook shellcheck-clean
- [x] After merge, push-to-main CI on `main` is green (verified post-merge)

## Verification
Pipe-test the hook across the cases; confirm main CI green post-merge.
