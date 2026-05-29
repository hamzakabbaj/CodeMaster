#!/bin/sh
# Local CI — the SAME gates GitHub Actions runs. Run before you push.
# Verification ladder (doc 02): cheapest first, fail fast (set -e stops at the
# first red rung). Deps: git + python3 always; shellcheck for the lint rung
# (falls back to `sh -n` with an install hint if absent — never a silent skip).
#
# Extension point: language repos (Track B/C) add typecheck/unit/integration/e2e
# rungs after lint, before the structure rungs.
set -e

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

echo "▸ 1/4 Shell lint"
sh_files=$(git ls-files --cached --others --exclude-standard -- '*.sh' '.githooks/*')
if [ -z "$sh_files" ]; then
  echo "  (no shell files)"
elif command -v shellcheck >/dev/null 2>&1; then
  printf '%s\n' "$sh_files" | xargs shellcheck
  echo "  ✓ shellcheck clean"
else
  echo "  ! shellcheck not found — syntax check only (install to mirror CI: brew install shellcheck)"
  printf '%s\n' "$sh_files" | xargs -n1 sh -n
  echo "  ✓ syntax ok"
fi

echo "▸ 2/4 JSON validity"
json_files=$(git ls-files --cached --others --exclude-standard -- '*.json')
if [ -z "$json_files" ]; then
  echo "  (no JSON files yet)"
else
  printf '%s\n' "$json_files" | while IFS= read -r f; do
    python3 -m json.tool "$f" >/dev/null || exit 1
    echo "  ✓ $f"
  done
fi

echo "▸ 3/4 Markdown links"
python3 scripts/check_links.py

echo "▸ 4/4 Commit message (HEAD) conforms to Conventional Commits"
git log -1 --format='%B' > /tmp/cm_head_msg
.githooks/commit-msg /tmp/cm_head_msg
echo "  ✓ HEAD commit message OK"

echo "✓ CI passed"
