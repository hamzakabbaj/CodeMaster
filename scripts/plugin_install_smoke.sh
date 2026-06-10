#!/bin/sh
# Plugin install smoke (CM-29; uses the real in-repo marketplace as of CM-76) — proves
# the `codemaster` plugin INSTALLS cleanly into ANOTHER project from this repo's own
# marketplace, WITHOUT touching the developer's real Claude config.
#
# Why this is NOT a ci.sh rung: it needs the Claude CLI and mutates plugin/marketplace
# state. It runs that state under a THROWAWAY CLAUDE_CONFIG_DIR, so the real ~/.claude
# is never modified. Run it on demand as a ship-readiness check.
#
# What it does: add THIS repo as a marketplace (the real .claude-plugin/marketplace.json
# -> source ./plugin), install codemaster@codemaster into the isolated config, assert the
# component inventory (skills + the 2 hooks), then tear everything down. Installing at
# user scope is exactly how another project would consume it.
set -e

command -v claude >/dev/null 2>&1 || { echo "✗ claude CLI required (npm i -g @anthropic-ai/claude-code)"; exit 1; }
ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

CFG=$(mktemp -d)
cleanup() { rm -rf "$CFG"; }
trap cleanup EXIT

export CLAUDE_CONFIG_DIR="$CFG"          # isolate ALL install state to a throwaway dir

echo "▸ marketplace add THIS repo (isolated CLAUDE_CONFIG_DIR=$CFG)"
claude plugin marketplace add "$ROOT" >/dev/null
echo "▸ install codemaster@codemaster"
claude plugin install codemaster@codemaster >/dev/null
echo "▸ component inventory"
out=$(claude plugin details codemaster 2>&1)
echo "$out" | sed -n '/Component inventory/,/Projected token/p' | sed 's/^/    /'
echo "$out" | grep -q "Skills"   || { echo "✗ FAIL: no skills in inventory"; exit 1; }
echo "$out" | grep -q "Hooks (2)" || { echo "✗ FAIL: the 2 hooks did not bundle"; exit 1; }
echo "▸ uninstall + remove marketplace"
claude plugin uninstall codemaster >/dev/null
claude plugin marketplace remove codemaster >/dev/null

echo "✓ install smoke passed — codemaster installs from its own marketplace (Skills + Hooks present); real ~/.claude untouched"
