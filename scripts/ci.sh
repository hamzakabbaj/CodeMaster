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

echo "▸ 1/9 Shell lint"
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

echo "▸ 2/9 JS syntax (site)"
# Scope to docs/site only: workflow scripts (.claude/workflows/*.mjs) run inside
# the Workflow runtime's function wrapper (top-level await/return, injected
# globals) and are NOT standalone modules — node --check rightly rejects them.
js_files=$(git ls-files --cached --others --exclude-standard -- docs/site | grep -E '\.js$' || true)
if [ -z "$js_files" ]; then
  echo "  (no site JS)"
elif command -v node >/dev/null 2>&1; then
  printf '%s\n' "$js_files" | while IFS= read -r f; do node --check "$f" || exit 1; done
  echo "  ✓ node --check clean"
else
  echo "  ! node not found — skipping JS syntax (install node to mirror CI)"
fi

echo "▸ 3/9 Unit tests"
if [ -d tests ]; then
  python3 -m unittest discover -s tests -p 'test_*.py'
  echo "  ✓ tests pass"
else
  echo "  (no tests yet)"
fi

echo "▸ 4/9 JSON validity"
json_files=$(git ls-files --cached --others --exclude-standard -- '*.json')
if [ -z "$json_files" ]; then
  echo "  (no JSON files yet)"
else
  printf '%s\n' "$json_files" | while IFS= read -r f; do
    python3 -m json.tool "$f" >/dev/null || exit 1
    echo "  ✓ $f"
  done
fi

echo "▸ 5/9 Blueprint schema conformance"
# Every populated blueprint data.json must validate against its skill's schema.json.
# Dependency-free (no ajv); empty {} stubs and guide-only steps are skipped.
if command -v node >/dev/null 2>&1; then
  node scripts/validate-blueprint.js
else
  echo "  ! node not found — skipping blueprint conformance (install node to mirror CI)"
fi

echo "▸ 6/9 Plugin manifest validation"
# The .claude/ tree is packaged as the `codemaster` plugin (CM-26..28). Validate the
# manifest + components — this catches broken skill/agent frontmatter that would load
# as EMPTY metadata at runtime (it already caught two such bugs). Lenient `validate`:
# component ERRORS fail the rung; the two intentional agents/ README docs only warn.
# Needs the Claude CLI; graceful-degrade if absent (mirrors the shellcheck/node rungs).
if command -v claude >/dev/null 2>&1; then
  claude plugin validate .claude
else
  echo "  ! claude CLI not found — skipping plugin validation (install to mirror CI: npm i -g @anthropic-ai/claude-code)"
fi

echo "▸ 7/9 Generated views in sync (ROADMAP.md + ticket READMEs)"
python3 scripts/gen_roadmap.py --check
python3 scripts/gen_tickets.py --check

echo "▸ 8/9 Markdown links"
python3 scripts/check_links.py

echo "▸ 9/9 Commit message (HEAD) conforms to Conventional Commits"
git log -1 --format='%B' > /tmp/cm_head_msg
.githooks/commit-msg /tmp/cm_head_msg
echo "  ✓ HEAD commit message OK"

echo "✓ CI passed"
