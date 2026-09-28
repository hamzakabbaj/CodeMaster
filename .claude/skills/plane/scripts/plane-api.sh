#!/usr/bin/env bash
# Thin wrapper around the Plane REST API.
#
# Credentials are read from $PLANE_ENV (default: plane.env in the skill folder,
# i.e. next to this scripts/ dir), which must define PLANE_API_URL and
# PLANE_API_KEY. PLANE_WORKSPACE_SLUG is optional.
#
# Usage:
#   plane-api.sh <path> [extra curl args...]
#       Single GET. <path> is relative to the API root (no leading slash), e.g.
#         plane-api.sh "workspaces/$PLANE_WORKSPACE_SLUG/projects/"
#
#   plane-api.sh --all <path> [extra curl args...]
#       Auto-paginate a list endpoint and print the merged .results array.
#
#   plane-api.sh --raw <method> <path> [extra curl args...]
#       Arbitrary method (GET/POST/PATCH/DELETE). Pass a body with -d '...'.
#
# Examples:
#   plane-api.sh "workspaces/acme/projects/"
#   plane-api.sh --all "workspaces/acme/projects/<pid>/work-items/?expand=state,assignees"
#   plane-api.sh --raw PATCH "workspaces/acme/projects/<pid>/work-items/<id>/" \
#       -H "Content-Type: application/json" -d '{"name":"new title"}'
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
CONFIG="${PLANE_ENV:-$SKILL_DIR/plane.env}"
if [ -f "$CONFIG" ]; then
  # shellcheck disable=SC1090
  source "$CONFIG"
else
  echo "error: credentials file not found at $CONFIG" >&2
  echo "Create it from the template in the plane skill folder." >&2
  exit 1
fi

: "${PLANE_API_URL:?Set PLANE_API_URL in $CONFIG}"
: "${PLANE_API_KEY:?Set PLANE_API_KEY in $CONFIG}"

BASE="${PLANE_API_URL%/}/api/v1"

_curl() {
  curl -sS --fail-with-body \
    -H "X-API-Key: $PLANE_API_KEY" \
    -H "Accept: application/json" \
    "$@"
}

case "${1:-}" in
  --all)
    shift
    path="$1"; shift
    cursor=""
    tmp="$(mktemp)"
    while :; do
      if [ -n "$cursor" ]; then
        sep="?"; [[ "$path" == *\?* ]] && sep="&"
        resp="$(_curl "$BASE/${path}${sep}cursor=${cursor}" "$@")"
      else
        resp="$(_curl "$BASE/$path" "$@")"
      fi
      echo "$resp" | jq -c '.results // []' >> "$tmp"
      more="$(echo "$resp" | jq -r '.next_page_results // false')"
      cursor="$(echo "$resp" | jq -r '.next_cursor // empty')"
      { [ "$more" = "true" ] && [ -n "$cursor" ]; } || break
    done
    jq -s 'add' "$tmp"
    rm -f "$tmp"
    ;;
  --raw)
    shift
    method="$1"; shift
    path="$1"; shift
    _curl -X "$method" "$BASE/$path" "$@"
    ;;
  "")
    echo "usage: plane-api.sh <path> | --all <path> | --raw <method> <path>" >&2
    exit 2
    ;;
  *)
    path="$1"; shift
    _curl "$BASE/$path" "$@"
    ;;
esac
