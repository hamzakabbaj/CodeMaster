# CM-37: commit-msg hook tolerates squash PR-ref suffix

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-0-delivery-infrastructure
- **Type:** fix
- **Status:** ✅ done

## Goal
commit-msg hook tolerates squash PR-ref suffix

## Acceptance criteria
- [x] Hook strips a trailing ` (#<n>)` before validating
- [x] CM-12-style squash subject (`...(CM-12) (#10)`) passes
- [x] A genuinely over-72 subject (no PR ref) still fails
- [x] Normal subjects unaffected; hook shellcheck-clean
- [x] After merge, push-to-main CI on `main` is green (verified post-merge)

## Verification
Pipe-test the hook across the cases; confirm main CI green post-merge.
