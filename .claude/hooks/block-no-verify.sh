#!/bin/sh
# Claude Code PreToolUse hook (Bash matcher).
# Blocks `git commit --no-verify` / `-n` so the agent cannot bypass the
# .githooks/commit-msg gate. Deterministic; uses jq + POSIX grep only.
#
# Input : Claude Code hook JSON on stdin (.tool_input.command holds the bash cmd)
# Output: a PreToolUse permission decision JSON on stdout when blocking;
#         nothing + exit 0 means "allow".
#
# NOTE on defense-in-depth: --no-verify specifically bypasses the local git
# hook, so THIS hook is the early guard. The real backstop is server CI, which
# re-validates every pushed commit's message regardless of --no-verify.

cmd=$(jq -r '.tool_input.command // empty' 2>/dev/null)

# Portable boundaries (no GNU \b): match a real `git commit` invocation...
is_commit=$(printf '%s' "$cmd" | grep -Ec '(^|[[:space:]])git[[:space:]]+commit([[:space:]]|$)')
# ...carrying --no-verify or a standalone -n flag.
has_skip=$(printf '%s' "$cmd" | grep -Ec '(--no-verify|(^|[[:space:]])-n([[:space:]]|$))')

if [ "$is_commit" -gt 0 ] && [ "$has_skip" -gt 0 ]; then
  printf '%s' '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Blocked by CodeMaster invariant: git commit --no-verify/-n bypasses the .githooks/commit-msg gate. Remove the flag and let the hook validate the message. (Server CI also re-checks this.)"}}'
  exit 0
fi

exit 0
