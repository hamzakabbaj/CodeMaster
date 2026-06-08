# CM-34: Harden the --no-verify guard against false positives

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-1-capabilities-proving-ground
- **Type:** fix
- **Status:** ✅ done

## Goal
Harden the --no-verify guard against false positives

## Acceptance criteria
- [x] Real `git commit --no-verify` / `-n` still blocked
- [x] `git commit -m "...--no-verify..."` allowed (the bug)
- [x] `git commit && gh pr create --body "...--no-verify..."` allowed
- [x] Multiline heredoc body mentioning the flag allowed
- [x] `git status -n` allowed (no false positive)

## Verification
7-case pipe-test (all pass). Live: the script file is re-read per invocation, so the
fix is active this session without a settings reload — proven by this very commit,
whose message contains the literal flag and is *not* blocked.
