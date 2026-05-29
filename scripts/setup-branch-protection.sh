#!/bin/sh
# Enforce the PR + green-CI rule on the trunk via GitHub branch protection.
# Idempotent (PUT replaces the rule each run). Reusable across repos (Track B/C).
#
# Usage: scripts/setup-branch-protection.sh [owner/repo] [branch]
# Defaults: derive owner/repo from the `origin` remote, branch = main.
#
# Policy (solo-dev tuned):
#   - require a PR before merging (0 approvals — no second reviewer needed)
#   - require the "Quality gates" status check, branch must be up to date
#   - block force-pushes and deletion of the trunk
#   - enforce_admins=false so we can recover if CI ever wedges
set -e

REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
BRANCH="${2:-main}"

gh api -X PUT "repos/$REPO/branches/$BRANCH/protection" \
  -H "Accept: application/vnd.github+json" \
  --input - >/dev/null <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["Quality gates"] },
  "enforce_admins": false,
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON

echo "✓ branch protection applied to $REPO@$BRANCH"
