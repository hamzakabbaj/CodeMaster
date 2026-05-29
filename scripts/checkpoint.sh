#!/bin/sh
# Commit the current work as a GREEN checkpoint — only if the verification
# ladder passes. Embodies doc 02: checkpoint on green, never on red.
#
# Usage: scripts/checkpoint.sh "<conventional subject>"
#   e.g. scripts/checkpoint.sh "feat(x): wire up parser"
#
# Refuses to commit on a dirty-but-red tree. To recover from a broken iteration
# instead of checkpointing, discard back to the last checkpoint with:
#   git restore .            # drop unstaged changes
#   git reset --hard HEAD    # drop everything since the last commit (destructive)
set -e
ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

msg="$1"
if [ -z "$msg" ]; then
  echo "usage: scripts/checkpoint.sh \"<conventional subject>\"" >&2
  exit 2
fi

branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" = "main" ]; then
  echo "✗ refusing to checkpoint on main — branch first (CONTRIBUTING.md)" >&2
  exit 1
fi

if [ -z "$(git status --porcelain)" ]; then
  echo "nothing to checkpoint (clean tree)"
  exit 0
fi

echo "▸ running the verification ladder before checkpointing..."
sh scripts/ci.sh

git add -A
git commit -m "$msg"
echo "✓ green checkpoint: $msg"
