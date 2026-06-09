#!/bin/sh
# Plugin install smoke (CM-29) — proves the `codemaster` plugin INSTALLS cleanly as a
# unit, WITHOUT making this repo depend on installation and WITHOUT touching the
# developer's real Claude config.
#
# Why this is NOT a ci.sh rung: it needs the Claude CLI and mutates plugin/marketplace
# state. It runs that state under a THROWAWAY CLAUDE_CONFIG_DIR, so the real ~/.claude
# is never modified. Run it on demand as a ship-readiness check.
#
# What it does: build a local marketplace pointing at a copy of .claude, install from
# it into the isolated config, assert the component inventory (skills + the 2 hooks),
# then tear everything down.
set -e

command -v claude >/dev/null 2>&1 || { echo "✗ claude CLI required (npm i -g @anthropic-ai/claude-code)"; exit 1; }
ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

CFG=$(mktemp -d)
MKT=$(mktemp -d)
cleanup() { rm -rf "$CFG" "$MKT"; }
trap cleanup EXIT

export CLAUDE_CONFIG_DIR="$CFG"          # isolate ALL install state to a throwaway dir
mkdir -p "$MKT/.claude-plugin"
cp -R plugin "$MKT/codemaster-src"       # plugin/ is the real plugin root (CM-75)
cat > "$MKT/.claude-plugin/marketplace.json" <<JSON
{ "name": "cm-smoke", "version": "0.0.0", "owner": { "name": "smoke" },
  "plugins": [ { "name": "codemaster", "source": "./codemaster-src", "description": "install smoke" } ] }
JSON

echo "▸ marketplace add (isolated CLAUDE_CONFIG_DIR=$CFG)"
claude plugin marketplace add "$MKT" >/dev/null
echo "▸ install codemaster@cm-smoke"
claude plugin install codemaster@cm-smoke >/dev/null
echo "▸ component inventory"
out=$(claude plugin details codemaster 2>&1)
echo "$out" | sed -n '/Component inventory/,/Projected token/p' | sed 's/^/    /'
echo "$out" | grep -q "Skills"   || { echo "✗ FAIL: no skills in inventory"; exit 1; }
echo "$out" | grep -q "Hooks (2)" || { echo "✗ FAIL: the 2 hooks did not bundle"; exit 1; }
echo "▸ uninstall + remove marketplace"
claude plugin uninstall codemaster >/dev/null
claude plugin marketplace remove cm-smoke >/dev/null

echo "✓ install smoke passed — codemaster installs as a unit (Skills + Hooks present); real ~/.claude untouched"
