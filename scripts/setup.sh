#!/bin/sh
# One-time local setup after cloning. Activates versioned git hooks.
# core.hooksPath is local config and is NOT carried by `git clone`,
# so every contributor must run this once.
set -e
ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

git config core.hooksPath .githooks
chmod +x .githooks/* scripts/*.sh 2>/dev/null || true

echo "✓ git hooks activated (core.hooksPath=.githooks)"
echo "✓ run 'scripts/ci.sh' to execute local gates"
