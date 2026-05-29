#!/bin/sh
# Print the next free CodeMaster ticket number (max existing CM-<n> + 1).
# Deterministic helper for the new-ticket skill. Dependency-free.
set -e
ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

max=$(grep -rhoE 'CM-[0-9]+' ROADMAP.md backlog/ 2>/dev/null \
  | grep -oE '[0-9]+' | sort -n | tail -1)
echo $(( ${max:-0} + 1 ))
