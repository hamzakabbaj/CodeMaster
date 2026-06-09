# CM-72: Drop jq from block-no-verify.sh: parse hook input with python3 (close the fail-open)

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-0-delivery-infrastructure
- **Type:** fix
- **Status:** ✅ done

## Goal
Remove the undeclared jq dependency from the commit-bypass guard so the local cage no longer fails OPEN when jq is absent — parse the hook JSON with python3, which the script already requires and which is a declared repo dependency.

## Acceptance criteria
- [x] block-no-verify.sh no longer invokes jq; the hook input (.tool_input.command) is parsed by python3, the same interpreter already used for the shlex tokenization
- [x] Behaviour is unchanged: real `git commit --no-verify`/`-n` (incl. chained after &&) is blocked; the flag merely mentioned in a message is allowed; plain commits allowed
- [x] Empty input ({}) and malformed JSON both resolve to allow (fail-open with the CI backstop, as before) — now without depending on jq
- [x] The hook's deny output still matches the documented PreToolUse shape (hookSpecificOutput / permissionDecision: deny) verified against code.claude.com/docs/en/hooks
- [x] scripts/ci.sh green (8 rungs)

## Verification
Re-ran the hook test battery against the rewritten script: 7/7 behavioural cases pass (block/allow incl. empty + malformed input), and grep confirms jq appears only in the explanatory comment, not as a call. bash scripts/ci.sh green.

## Notes
Found by checking our hooks against code.claude.com/docs/en/hooks. The DEFINITION was already doc-compliant (matcher Bash, if Bash(git *), timeout, statusMessage, deny-via-JSON+exit0 all documented). The real gap was a dependency: jq is not among the repo's declared deps (git/python3/node) and was nowhere in ci.sh/setup.sh/CLAUDE.md — and if jq was missing the guard failed OPEN (empty cmd -> exit 0 -> allow). A deterministic guard must not silently disable itself. python3 is a hard dep already used in the same script, so the fix removes the dependency and the fail-open in one move. Behaviour/exit-code philosophy (fail-open + CI backstop) intentionally unchanged.
