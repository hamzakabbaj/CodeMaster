#!/bin/sh
# One-time local setup after cloning. Two activations:
#   1. versioned git hooks (core.hooksPath — local config, NOT carried by clone)
#   2. the codemaster plugin (skills/agents/commands/hooks) via its in-repo marketplace
# Run once after cloning; re-run the install step after editing the plugin to pick up
# changes (installs run from a cached copy — CM-77).
set -e
ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

git config core.hooksPath .githooks
chmod +x .githooks/* scripts/*.sh plugin/hooks/*.sh plugin/skills/*/*.sh 2>/dev/null || true
echo "✓ git hooks activated (core.hooksPath=.githooks)"

# Install the codemaster plugin from this repo's marketplace (user scope -> available in
# every project). This is the ONLY way the plugin loads (no symlinks, CM-77).
if command -v claude >/dev/null 2>&1; then
  claude plugin marketplace add "$ROOT" >/dev/null 2>&1 || true
  if claude plugin install codemaster@codemaster >/dev/null 2>&1; then
    echo "✓ codemaster plugin installed — restart Claude Code to load skills/agents/commands/hooks"
  else
    echo "  ! codemaster already installed (or install skipped) — to refresh after editing plugin/:"
    echo "    claude plugin uninstall codemaster && claude plugin install codemaster@codemaster"
  fi
else
  echo "  ! claude CLI not found — then: claude plugin marketplace add . && claude plugin install codemaster@codemaster"
fi

echo "✓ run 'scripts/ci.sh' to execute local gates"
