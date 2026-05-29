#!/bin/sh
# Local CI — the SAME gates GitHub Actions runs. Run before you push.
# Dependency-free: git + python3 only. Exits non-zero on first failure.
set -e

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

echo "▸ 1/3 JSON validity"
# Include untracked-but-not-ignored files so new configs are validated locally
# before they're committed (CI sees everything anyway). Same fix as check_links.
json_files=$(git ls-files --cached --others --exclude-standard -- '*.json')
if [ -n "$json_files" ]; then
  for f in $json_files; do
    python3 -m json.tool "$f" >/dev/null && echo "  ✓ $f"
  done
else
  echo "  (no JSON files yet)"
fi

echo "▸ 2/3 Markdown links"
python3 scripts/check_links.py

echo "▸ 3/3 Commit message (HEAD) conforms to Conventional Commits"
git log -1 --format='%B' > /tmp/cm_head_msg
# NOT wrapped in `if` — set -e must abort here on failure (a swallowed
# failure here is a false-green; see Phase 0 notes).
.githooks/commit-msg /tmp/cm_head_msg
echo "  ✓ HEAD commit message OK"

echo "✓ CI passed"
