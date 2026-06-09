#!/bin/sh
# Claude Code SubagentStop hook — per-ticket traceability (CM-73).
#
# When a FLEET subagent finishes while you're working on a ticket branch, append
# its returned conclusion to a per-agent trace file in that ticket's folder, so
# what each agent concluded is persisted alongside plan.md / evidence.md (the
# durable record, not a transcript).
#
# Verified via the CM hook probe (a spike): the SubagentStop payload exposes
# `agent_type` (matchable identity) and `last_assistant_message` (the agent's
# returned text), plus `cwd`. Registered with matcher = the fleet agent types,
# so it never fires for a workflow's internal skeptics or unrelated subagents.
#
# Read-only agents can't write; the main thread (this hook) persists their output
# — consistent with the fleet's "agents advise, the main thread writes" rule.
# No jq (an undeclared dep, see CM-72); parse with python3, the declared interpreter.

payload=$(cat)                                          # SubagentStop JSON on stdin
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null) || exit 0
case "$branch" in
  feat/CM-*) ticket="${branch#feat/}" ;;                # feat/CM-73-slug -> CM-73-slug
  *) exit 0 ;;                                          # only on a ticket branch
esac
case "$ticket" in */*|*..*) exit 0 ;; esac              # defense-in-depth: never escape tickets/
root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
dir="$root/blueprint/v1/backlog/tickets/$ticket"
[ -d "$dir" ] || exit 0                                 # ticket folder must already exist

CM_DIR="$dir" CM_PAYLOAD="$payload" python3 -c '
import os, json, datetime, sys
try:
    d = json.loads(os.environ.get("CM_PAYLOAD") or "{}")
except Exception:
    sys.exit(0)                                         # unparseable -> no-op
agent = d.get("agent_type") or ""
msg = (d.get("last_assistant_message") or "").rstrip()
if not agent or not msg:
    sys.exit(0)
fname = {
    "code-explorer": "explore.md",
    "reviewer":      "review.md",
    "architect":     "architect.md",
    "security":      "security.md",
    "tester":        "tester.md",
}.get(agent)
if not fname:
    sys.exit(0)                                         # not a traced fleet agent
ts = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
path = os.path.join(os.environ["CM_DIR"], fname)
new = not os.path.exists(path)
with open(path, "a", encoding="utf-8") as f:
    if new:
        f.write(f"# {agent} trace\n\n> Appended by the SubagentStop hook (trace-subagent.sh) — what {agent} concluded, per run.\n\n")
    f.write(f"## {ts}\n\n{msg}\n\n---\n\n")
'
exit 0
