# CM-34: Harden the --no-verify guard against false positives

- **Epic:** Phase 1 — Capabilities Proving Ground (bug found in CM-8)
- **Type:** fix
- **Status:** ✅ done
- **Branch:** `fix/CM-34-harden-no-verify-hook`

## Problem
The CM-8 hook substring-matched the whole command, so any command that merely
*mentioned* `--no-verify` in a message/body argument was false-blocked. It blocked
a legitimate commit during CM-9.

## Fix
Token-aware detection: split the command on `&& || ; | newline`, lex each segment
with Python `shlex` (shell-correct quote handling), and block only when a real
`git commit` segment carries `--no-verify`/`-n` as an actual token. Flag text inside
a quoted message/body is no longer mistaken for a flag.

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

## Known gaps (accepted; CI is the backstop)
A real bypass written with an unbalanced quote/heredoc on the git-commit segment
won't lex and is skipped. Server CI re-validates every pushed commit message.
