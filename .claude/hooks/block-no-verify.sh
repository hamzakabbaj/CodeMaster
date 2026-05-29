#!/bin/sh
# Claude Code PreToolUse hook (Bash matcher).
# Blocks `git commit --no-verify` / `-n` so the agent cannot bypass the
# .githooks/commit-msg gate.
#
# CM-34: token-aware detection. The naive substring version (CM-8) false-blocked
# any command that merely MENTIONED the flag in a message/body argument. We now
# tokenize with shell-correct lexing (Python shlex) and split on && ; | newline,
# blocking only when a real `git commit` segment carries the flag as an actual
# token — not as text inside a quoted argument.
#
# Input : Claude Code hook JSON on stdin (.tool_input.command).
# Output: a PreToolUse "deny" decision on stdout when blocking; else nothing.
# Backstop: server CI re-validates every pushed commit message regardless.
# Known gaps (accepted; CI covers): a real bypass written with an unbalanced
# quote / heredoc on the git-commit segment won't lex, so it's skipped.

cmd=$(jq -r '.tool_input.command // empty' 2>/dev/null)
[ -z "$cmd" ] && exit 0

verdict=$(printf '%s' "$cmd" | python3 -c '
import sys, re, shlex
cmd = sys.stdin.read()
blocked = False
for seg in re.split(r"&&|\|\||[;\n|]", cmd):
    try:
        toks = shlex.split(seg, posix=True)
    except ValueError:
        continue  # unbalanced quotes/heredoc -> cannot lex; skip (CI backstops)
    if len(toks) >= 2 and toks[0] == "git" and toks[1] == "commit":
        if "--no-verify" in toks or "-n" in toks:
            blocked = True
            break
print("block" if blocked else "allow")
' 2>/dev/null)

if [ "$verdict" = "block" ]; then
  printf '%s' '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Blocked by CodeMaster invariant: git commit --no-verify/-n bypasses the .githooks/commit-msg gate. Remove the flag and let the hook validate the message. (Server CI also re-checks this.)"}}'
fi
exit 0
