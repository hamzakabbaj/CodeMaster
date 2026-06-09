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
# CM-72: parse the hook input with python3 (already required for the shlex pass)
# instead of jq. jq was an UNDECLARED dependency (repo deps are git/python3/node),
# and if it was absent the guard failed OPEN — silently allowing the bypass. python3
# is a hard dependency, so the local cage no longer hinges on an unlisted tool.
#
# Input : Claude Code hook JSON on stdin (.tool_input.command).
# Output: a PreToolUse "deny" decision on stdout when blocking; else nothing.
# Backstop: server CI re-validates every pushed commit message regardless.
# Known gaps (accepted; CI covers): a real bypass written with an unbalanced
# quote / heredoc on the git-commit segment won't lex, so it's skipped.

verdict=$(python3 -c '
import sys, json, re, shlex
try:
    data = json.loads(sys.stdin.read() or "{}")
    cmd = (data.get("tool_input") or {}).get("command") or ""
except Exception:
    print("allow"); sys.exit(0)  # unparseable input -> allow (CI backstops)
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
