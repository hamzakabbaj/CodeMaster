---
name: plane
description: Query AND modify a Plane project-management instance (cloud or self-hosted) over its REST API with bash + curl. Use when the user asks about, or wants to change, Plane projects, work items / issues, cycles, modules, states, labels, members, epics, or estimates — e.g. "what's in my Plane backlog", "list work items in project X", "create these tasks in Plane", "link these to the epic", "set estimates on these tasks".
argument-hint: "[what to query: project, work items, cycle, member, etc.]"
allowed-tools: Bash, Read
---

You are a Plane API assistant. You answer questions by calling the Plane REST API
with the helper script in this skill, then summarizing the JSON for the user.

## Setup (check first)

Credentials live in `plane.env` **inside this skill folder** (next to this
SKILL.md). It must define `PLANE_API_URL` and `PLANE_API_KEY`, and optionally
`PLANE_WORKSPACE_SLUG`. The user maintains this file themselves.

If a command fails with "credentials file not found", tell the user to create it
from the template (do NOT create or fill it yourself):

```bash
cp <skill>/plane.env.template <skill>/plane.env
chmod 600 <skill>/plane.env
# user edits it with their instance URL + personal access token
```

**Never read, cat, print, or echo `plane.env` or the API key.** The wrapper script
sources it without exposing the value — rely on that. Never write the key anywhere.

## The helper script

Always go through the wrapper — it handles auth, base URL, and pagination. It lives
next to this SKILL.md, at `scripts/plane-api.sh` in this skill folder:

```bash
SKILL="$(dirname <this SKILL.md>)/scripts/plane-api.sh"   # e.g. .claude/skills/plane/scripts/plane-api.sh

# Single GET (path is relative to /api/v1/, no leading slash):
"$SKILL" "workspaces/<slug>/projects/"

# Auto-paginate a list endpoint -> merged JSON array of all .results:
"$SKILL" --all "workspaces/<slug>/projects/<pid>/work-items/?expand=state,assignees"

# Write operations (only when the user explicitly asks):
"$SKILL" --raw PATCH "workspaces/<slug>/projects/<pid>/work-items/<id>/" \
  -H "Content-Type: application/json" -d '{"name":"New title"}'
```

Pipe output through `jq` to extract what you need. Parse `jq`, don't eyeball raw JSON.

## API basics

- **Base:** `<PLANE_API_URL>/api/v1/` — every path below is relative to that.
- **`PLANE_API_URL` must be the bare host** (e.g. `https://plane.example.com`), NOT
  including the workspace slug. If calls 404 and the root returns HTML, the slug was
  likely appended to the URL — strip everything after the host.
- **Auth:** `X-API-Key: <token>` header (the script adds it).
- **Rate limit:** 60 requests/min. Prefer `--all` + `expand`/`fields` over many calls.
- **Pagination:** cursor-based; responses have `results`, `next_cursor`,
  `next_page_results`, `total_count`. `--all` walks every page for you.
- **Useful query params:** `?expand=state,assignees,labels` (embed related objects),
  `?fields=id,name` (trim payload), `?per_page=100`, `?order_by=-created_at`.

## Endpoint catalog (all under `workspaces/<slug>/`)

| Resource    | List                                            | Detail (append `<id>/`) |
|-------------|-------------------------------------------------|-------------------------|
| Projects    | `projects/`                                     | `projects/<pid>/`       |
| Work items  | `projects/<pid>/work-items/`                    | `.../work-items/<id>/`  |
| States      | `projects/<pid>/states/`                        | `.../states/<id>/`      |
| Labels      | `projects/<pid>/labels/`                        | `.../labels/<id>/`      |
| Cycles      | `projects/<pid>/cycles/`                         | `.../cycles/<id>/`      |
| Modules     | `projects/<pid>/modules/`                        | `.../modules/<id>/`     |
| Members     | `projects/<pid>/members/`                        | `.../members/<id>/`     |
| Comments    | `projects/<pid>/work-items/<id>/comments/`       | `.../comments/<id>/`    |

Work items reference `state`, `assignees`, `labels`, `priority` by ID. Resolve IDs
to names either with `?expand=...` or by fetching the `states/` and `members/` lists.

## Common workflows

**Resolve the workspace slug.** Use `PLANE_WORKSPACE_SLUG` if set; otherwise ask the
user (it's the path segment after the domain in the Plane web URL).

**Find a project by name** (the user gives a name, the API needs the UUID):
```bash
"$SKILL" --all "workspaces/$SLUG/projects/" | jq -r '.[] | "\(.id)\t\(.name)"'
```

**List work items in a project** (with readable state/assignee/priority):
```bash
"$SKILL" --all "workspaces/$SLUG/projects/$PID/work-items/?expand=state,assignees,labels" \
| jq -r '.[] | "\(.priority // "none")\t\(.state.name // "?")\t\(.name)"'
```

**Open / unfinished work items:** fetch `states/`, note which have `group` of
`backlog`/`unstarted`/`started` (vs `completed`/`cancelled`), then filter work items
whose `state` is in that set.

**Cycles / modules and their items:** list `cycles/` or `modules/`, then the active
one's work items via its detail endpoint.

## Writing data (create / update / link / estimate)

Only when the user explicitly asks. Confirm the target project + the plan first.

**Work item fields** (POST to `work-items/`, PATCH to `work-items/<id>/`):
- `name` (required), `description_html` (rich text), `priority`
  (`urgent`|`high`|`medium`|`low`|`none`), `state` (state id), `assignees` (id list),
  `labels` (id list), `start_date`, `target_date`, `parent` (work item id),
  `estimate_point` (estimate-point id — see below).

**Bulk pattern (create/PATCH many).** Don't fire 27 separate curls. Source the creds
once via bash (Python's naive `.env` parse can choke on trailing chars/quotes), then
loop in Python with `urllib`, a `time.sleep(0.25)` between calls (stay under 60/min),
and stop on the first error. Save created ids to a temp file so a follow-up step
(linking, estimating) can reuse them:

```bash
cd <skill folder>; set -a; source ./plane.env; set +a   # exports PLANE_API_* to env
python3 - <<'PY'
import os, json, urllib.request, time
URL=os.environ["PLANE_API_URL"].strip().rstrip("/"); KEY=os.environ["PLANE_API_KEY"].strip()
SLUG=os.environ["PLANE_WORKSPACE_SLUG"].strip(); PID="<project id>"
def req(method, path, body=None):
    r=urllib.request.Request(f"{URL}/api/v1/workspaces/{SLUG}/projects/{PID}/{path}",
        data=(json.dumps(body).encode() if body else None), method=method,
        headers={"X-API-Key":KEY,"Content-Type":"application/json"})
    return json.loads(urllib.request.urlopen(r,timeout=30).read())
# ... loop: req("POST","work-items/",{"name":...}); time.sleep(0.25)
PY
```

**Adding work items to a Cycle (or Module).** Use the batch sub-endpoint, not a PATCH
on each item:
- Cycle: `POST cycles/<cycle-id>/cycle-issues/` with `{"issues": ["<id>", ...]}`
  (accepts the whole list in one call). Note the path uses `cycle-issues`, not
  `work-items`. Verify with `GET cycles/<cycle-id>/cycle-issues/`.
- Module: `POST modules/<module-id>/module-issues/` with `{"issues": [...]}`.
- Listing these endpoints returns the **full work-item objects** (paginated with
  `.results`), so the per-item id is `.id`, NOT `.issue`. Also: module/cycle names
  often have emoji prefixes (e.g. "🚀 Dashboard") — match by partial/contains, not `^name$`.

**Linking work items to an Epic.** This Plane's public API has **no `/epics/` endpoint
(404)**. Epics show up in the normal `work-items/` list (often named with a 👑 emoji,
`type_id: null`). Link children by PATCHing the child's `parent` to the epic's work
item id: `{"parent": "<epic-work-item-id>"}`.

**Setting estimates — important quirks.**
- The project must have an estimate configured (`projects/<pid>/` → `.estimate`).
- `/estimates/` returns **404** and `expand=estimate_point` returns `{}` — so the
  estimate's **value labels are NOT readable via the API**. The issue `point` field is
  a separate free-form number, NOT the estimate value; ignore it for estimates.
- To set an estimate, PATCH `{"estimate_point": "<estimate-point-id>"}` (a UUID).
  Sending a number gives `Invalid pk`.
- **Discovering value→id mapping:** list existing work items, collect distinct
  `estimate_point` ids and an example item for each, then have the user read those
  items' estimate values from the Plane UI (or a screenshot). That bridges
  value → id. Cache the result in memory so you don't repeat the dance.

## Reading images embedded in work items (internal API — requires session cookie)

Work item descriptions can embed images as `<image-component src="<asset-uuid>" ...>`
tags inside `description_html`. The asset UUID is **not** a URL — it must be fetched
through the internal asset endpoint, which requires the same session cookie auth as
Pages (the public `/api/v1/` does not expose assets; API key gives 401).

**Workflow:**
1. Get the work item: `"$SKILL" "workspaces/$SLUG/projects/$PID/work-items/$WID/"`,
   extract `description_html`.
2. Parse out the asset UUID from `<image-component src="<uuid>" ...>` (or `<img>`
   tags with a similar src). There can be several per description.
3. Download via `GET /api/assets/v2/workspaces/<slug>/projects/<pid>/<asset-id>/`
   with `Cookie: session-id=<value>` + `Referer: <PLANE_API_URL>`. The endpoint
   302-redirects to a signed S3 URL — use `curl -L` to follow it.
4. Save with the correct file extension (`.png`, `.jpg`, ...) based on the response
   `Content-Type`. **Crucial:** the Read tool only decodes binary as an image if the
   path ends in a known image extension; a name like `/tmp/asset` is read as raw
   bytes (useless). Use `/tmp/<wid>_<idx>.png`.
5. Use the Read tool on the renamed file to view it.

```bash
cd <skill folder>; set -a; source ./plane.env; set +a
ASSET="<uuid-from-description_html>"; PID="<project-id>"; OUT="/tmp/asset.png"
/usr/bin/curl -sL -o "$OUT" \
  -w "HTTP %{http_code}\nContent-Type: %{content_type}\n" \
  -H "Cookie: session-id=$PLANE_SESSION_COOKIE" \
  -H "Referer: $PLANE_API_URL" \
  "$PLANE_API_URL/api/assets/v2/workspaces/$PLANE_WORKSPACE_SLUG/projects/$PID/$ASSET/"
# then: Read tool on $OUT (must have an image extension matching Content-Type)
```

Use `/usr/bin/curl` explicitly: sourcing `plane.env` can shadow `PATH` in some
shells, breaking bare `curl`/`head` calls. 401 → refresh the session cookie (same
mechanism as Pages). 400 on an asset path usually means the project id is missing
from the URL — assets are project-scoped.

## Uploading images to a work item (internal API — requires session cookie)

Mirror of the read flow. Plane uses a three-step presigned-S3 upload (the API key
again gives 401 — session cookie + CSRF only):

1. **Request a presigned upload.** `POST /api/assets/v2/workspaces/<slug>/projects/<pid>/`
   with JSON `{"name":"foo.png","type":"image/png","size":<bytes>,"entity_type":"ISSUE_DESCRIPTION","entity_identifier":"<work-item-id>"}`.
   Returns `{"asset_id":"<uuid>","upload_data":{"url":"<s3-bucket>","fields":{...}}}`.
   `entity_identifier` is optional but should be set to the target work item id so
   Plane can attribute the asset. `size` must match the file exactly — the policy
   enforces it.
2. **POST the file to S3** as `multipart/form-data` to `upload_data.url`. **Order
   matters:** every key in `upload_data.fields` (`key`, `policy`, signature, etc.)
   must come **before** the `file` field, or S3 rejects the policy. Success = 204.
3. **Mark complete.** `PATCH /api/assets/v2/workspaces/<slug>/projects/<pid>/<asset-id>/`
   with empty body `{}` and the session+CSRF headers. Success = 204. Skipping this
   leaves the asset in an uncommitted state and it may not appear in the UI.

After step 3, the asset can already be re-downloaded via the read endpoint
documented above. To make it **appear inside a work item's description**, PATCH the
item's `description_html` and embed:

```html
<image-component src="<asset-id>" width="400px" height="auto"
  aspectratio="1" alignment="left" status="uploaded"></image-component>
```

(Width/height/aspectratio are presentation-only; the editor recalculates them.)

```bash
cd <skill folder>; set -a; source ./plane.env; set +a
python3 - <<'PY'
import os, json, urllib.request, http.cookiejar, uuid
URL=os.environ["PLANE_API_URL"].strip().rstrip("/")
SESSION=os.environ["PLANE_SESSION_COOKIE"].strip()
SLUG=os.environ["PLANE_WORKSPACE_SLUG"].strip()
PID="<project-id>"; WID="<work-item-id>"; FILE="/path/to/image.png"
SIZE=os.path.getsize(FILE)

# CSRF bootstrap
cj=http.cookiejar.CookieJar()
opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
opener.open(urllib.request.Request(f"{URL}/auth/get-csrf-token/",
    headers={"Cookie": f"session-id={SESSION}"}))
csrf=json.loads(opener.open(urllib.request.Request(f"{URL}/auth/get-csrf-token/",
    headers={"Cookie": f"session-id={SESSION}"})).read())["csrf_token"]
csrfcookie=next(c.value for c in cj if c.name=="csrftoken")
H={"Cookie":f"session-id={SESSION}; csrftoken={csrfcookie}",
   "X-CSRFToken":csrf,"Content-Type":"application/json","Referer":URL}

# 1. presign
meta={"name":os.path.basename(FILE),"type":"image/png","size":SIZE,
      "entity_type":"ISSUE_DESCRIPTION","entity_identifier":WID}
r=urllib.request.Request(f"{URL}/api/assets/v2/workspaces/{SLUG}/projects/{PID}/",
    data=json.dumps(meta).encode(), method="POST", headers=H)
out=json.loads(urllib.request.urlopen(r,timeout=30).read())
asset_id=out["asset_id"]; up=out["upload_data"]

# 2. multipart POST to S3 — fields FIRST, file LAST
b="----plane"+uuid.uuid4().hex; CRLF="\r\n"
body=b""
for k,v in up["fields"].items():
    body+=f"--{b}{CRLF}Content-Disposition: form-data; name=\"{k}\"{CRLF}{CRLF}{v}{CRLF}".encode()
with open(FILE,"rb") as f: data=f.read()
body+=(f"--{b}{CRLF}Content-Disposition: form-data; name=\"file\"; "
       f"filename=\"{os.path.basename(FILE)}\"{CRLF}Content-Type: image/png{CRLF}{CRLF}").encode()
body+=data+CRLF.encode()+f"--{b}--{CRLF}".encode()
urllib.request.urlopen(urllib.request.Request(up["url"], data=body, method="POST",
    headers={"Content-Type": f"multipart/form-data; boundary={b}"}), timeout=60)

# 3. mark complete
urllib.request.urlopen(urllib.request.Request(
    f"{URL}/api/assets/v2/workspaces/{SLUG}/projects/{PID}/{asset_id}/",
    data=b"{}", method="PATCH", headers=H), timeout=30)
print("asset_id:", asset_id)
PY
```

**Gotchas:**
- `entity_type` must be `ISSUE_DESCRIPTION` for work item images. Other valid values
  exist for comments, page covers, etc. — discover by inspecting the network tab in
  the Plane UI while uploading.
- Don't reuse a presigned URL — each is single-use and expires (~1 h).
- The asset is project-scoped: the project id in the path must match the project
  that owns the target work item.
- Verify by re-downloading the asset (`GET .../<asset-id>/`) and diffing the bytes.

## Pages (internal API — requires session cookie)

The public API (`/api/v1/`) does **not** expose Pages. Pages use the internal API
(`/api/` without `v1/`) which requires Django session auth, not an API key.

**Setup:** The user must set `PLANE_SESSION_COOKIE` in `plane.env` with their
`session-id` cookie value from the browser (DevTools → Application → Cookies).
The cookie expires periodically — if calls return 401, ask the user to refresh it.

**How to get the cookie:** Safari: Develop → Show Web Inspector → Storage → Cookies.
Chrome: DevTools → Application → Cookies. Copy the `session-id` value.

**Auth flow for internal API calls:**
1. GET `/auth/get-csrf-token/` with `Cookie: session-id=<value>` → returns `{"csrf_token": "..."}` + sets `csrftoken` cookie
2. All POST/PATCH/DELETE requests need both cookies + `X-CSRFToken` header

**Page endpoints** (all under `/api/workspaces/<slug>/projects/<pid>/`):

| Action            | Method | Path                          |
|-------------------|--------|-------------------------------|
| List pages        | GET    | `pages/`                      |
| Create page       | POST   | `pages/`                      |
| Get page          | GET    | `pages/<page-id>/`            |
| Update page meta  | PATCH  | `pages/<page-id>/`            |
| Update content    | PATCH  | `pages/<page-id>/description/`|
| Delete page       | DELETE | `pages/<page-id>/`            |
| Duplicate page    | POST   | `pages/<page-id>/duplicate/`  |
| Archive page      | POST   | `pages/<page-id>/archive/`    |

**Create page fields:** `name` (string), `access` (0=public, 1=private).
**Update content:** PATCH `{"description_html": "<h1>...</h1>"}` to `pages/<id>/description/`.

**Bulk pattern for pages** (Python with session auth):

```bash
cd <skill folder>; set -a; source ./plane.env; set +a
python3 - <<'PY'
import os, json, urllib.request, http.cookiejar, time
URL = os.environ["PLANE_API_URL"].strip().rstrip("/")
SESSION = os.environ["PLANE_SESSION_COOKIE"].strip()
SLUG = os.environ["PLANE_WORKSPACE_SLUG"].strip()
PID = "<project-id>"

# 1. Get CSRF token
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
resp = opener.open(urllib.request.Request(f"{URL}/auth/get-csrf-token/",
    headers={"Cookie": f"session-id={SESSION}"}))
csrf = json.loads(resp.read())["csrf_token"]
csrfcookie = next((c.value for c in cj if c.name == "csrftoken"), "")

HEADERS = {
    "Cookie": f"session-id={SESSION}; csrftoken={csrfcookie}",
    "X-CSRFToken": csrf,
    "Content-Type": "application/json",
    "Referer": URL,
}

def create_page(name, html):
    req = urllib.request.Request(f"{URL}/api/workspaces/{SLUG}/projects/{PID}/pages/",
        data=json.dumps({"name": name, "access": 0}).encode(), method="POST", headers=HEADERS)
    result = json.loads(urllib.request.urlopen(req, timeout=15).read())
    page_id = result["id"]
    # Set content
    req2 = urllib.request.Request(f"{URL}/api/workspaces/{SLUG}/projects/{PID}/pages/{page_id}/description/",
        data=json.dumps({"description_html": html}).encode(), method="PATCH", headers=HEADERS)
    urllib.request.urlopen(req2, timeout=15)
    time.sleep(0.5)
    return page_id
PY
```

## Instance-specific data → memory

Host, slug, project ids, epic ids, and the estimate value→id map for a known instance
are recorded in the [[plane-instance]] memory. Read it first; it saves re-deriving the
estimate mapping and project ids. Update it when you learn new ids.

## Output rules

- Summarize for humans: group by project / state / cycle, show title, priority, state,
  assignee, and due date. Don't dump raw JSON unless the user asks.
- Translate UUIDs to names; never show bare UUIDs as the primary identifier.
- **Default to read-only.** Only POST/PATCH/DELETE when the user explicitly asks to
  create or change something, and confirm the target first.
- If a request 401s, the key is wrong/expired; if it 404s, re-check the slug/project id.
