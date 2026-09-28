# Provider: `plane`

Work items live in a [Plane](https://plane.so) project; the tracker verbs are REST calls over
the CLI wrapper `plane-api.sh`. Adapted from the standalone `plane` skill. **Remote provider:**
ids are server-assigned, status lives in Plane (not the repo), and secrets are project-local.

## Setup (`/codemaster-init --tracker=plane` materializes this)

```
.codemaster/
  config.json        { "tracker": "plane", "plane": { "workspace": "<slug>", "project": "<pid>" }, "statusMap": {...} }
  plane.env          PLANE_API_URL / PLANE_API_KEY / PLANE_WORKSPACE_SLUG   (gitignored — never commit)
  bin/plane-api.sh   the wrapper (its default env path resolves to .codemaster/plane.env)
```

Resolve once, at the start of any verb:

```sh
API=".codemaster/bin/plane-api.sh"                  # cwd-relative; always resolves
SLUG=$(jq -r '.plane.workspace' .codemaster/config.json)
PID=$(jq -r '.plane.project'   .codemaster/config.json)
BASE="workspaces/$SLUG/projects/$PID"
```

**Never read/print `plane.env` or the key** — the wrapper sources it without exposing the value.

## ID scheme & timing — **server-assigned**

Plane mints the id on create. A work item has a UUID (`id`) used by the API and a human
`sequence_id`; the project has an `identifier` (e.g. `PROJ`). The **canonical id** the verbs
pass around is `<identifier>-<sequence_id>` (e.g. `PROJ-123`) — that's what names the branch.
Because creation assigns the id, the flow is **`mint` first, then branch** (so `/start-ticket`
only ever `read`s an existing item; it never invents an id).

Resolve `<identifier>` once: `"$API" "$BASE/" | jq -r '.identifier'`.
To turn a canonical id back into the API UUID, match the trailing number against `sequence_id`:

```sh
seq="${ID##*-}"
uuid=$("$API" --all "$BASE/work-items/?fields=id,sequence_id" | jq -r --argjson s "$seq" '.[]|select(.sequence_id==$s)|.id')
```

## Status map — by **state group**

Plane states are per-project UUIDs, but each carries a stable `group`:
`backlog · unstarted · started · completed · cancelled`. Map CodeMaster status → a group, then
pick a state in that group. Defaults (override in config `statusMap`):

| CodeMaster | Plane group |
|---|---|
| `todo` | `unstarted` |
| `in_progress` | `started` |
| `done` | `completed` |
| `blocked` | *(a `blocked` **label**, kept alongside the state — Plane has no "blocked" group)* |

Resolve a group to a concrete state id:

```sh
state_id() { "$API" "$BASE/states/" | jq -r --arg g "$1" '[.results[]|select(.group==$g)][0].id'; }
```

## Verbs

### `mint(item) → id`
Render the vocabulary into a Plane work item. `description_html` carries the **goal/story** and an
`<h4>Acceptance criteria</h4>` + `<ul>` of the criteria (Plane descriptions are HTML).

```sh
TODO=$(state_id "$(jq -r '.statusMap.todo // "unstarted"' .codemaster/config.json)")
"$API" --raw POST "$BASE/work-items/" -H "Content-Type: application/json" -d "$(jq -n \
  --arg name "$TITLE" --arg html "$DESC_HTML" --arg state "$TODO" --arg parent "$EPIC_UUID" \
  '{name:$name, description_html:$html, state:$state} + (if $parent=="" then {} else {parent:$parent} end)')"
```

The response holds `id` (UUID) + `sequence_id`. **Return `<identifier>-<sequence_id>`** as the
canonical id. Epics are ordinary work items (often a 👑-named, `type_id:null` item) minted by the
`roadmap` skill — for an epic, `description_html` carries the **goal** and an
`<h4>Riskiest assumption</h4>` block instead of acceptance criteria; a child links via
`parent: <epic UUID>`.

### `read(id) → item`
Resolve the UUID (above), then `"$API" "$BASE/work-items/$uuid/?expand=state"`. Map back:
`name`→title, `state.group`→CodeMaster status (reverse of the table), `description_html`→goal +
acceptance_criteria, `parent`→parent id.

### `list(query) → [item]`
`"$API" --all "$BASE/work-items/?expand=state"` then `jq` filter by `.state.group` (and `.parent`
for an epic's children). Reverse-map each `state.group` to a CodeMaster status.

### `transition(id, status)`
Resolve the UUID; resolve the target group's state id; `"$API" --raw PATCH "$BASE/work-items/$uuid/"
-H "Content-Type: application/json" -d '{"state":"<state_id>"}'`. For `blocked`, instead add/remove
the `blocked` label (`labels: [...]`) and leave the state. This is the only writer of status.

### `link(id, {branch?, pr?})`
Resolve the UUID; attach the VCS artifact as a work-item **comment** (the public API's reliable
channel — no guaranteed issue-links endpoint):

```sh
"$API" --raw POST "$BASE/work-items/$uuid/comments/" -H "Content-Type: application/json" \
  -d "$(jq -n --arg html "<p>PR: <a href=\"$PR_URL\">$PR_URL</a> · branch <code>$BRANCH</code></p>" '{comment_html:$html}')"
```

### `attach_doc(id, name, markdown)`
The card **is** the home for docs — nothing goes to the repo. Convert the markdown to HTML and
attach it to the work item, by `name`:
`name` must be one of the **six named slots** ([`../README.md`](../README.md#the-six-doc-slots)).

- **`spec`** (epic) / **`plan`** (ticket) → the work item's **description** (`description_html`).
  Set the relevant `<h4>` section so the body stays readable. These are the durable, reviewed-on-the-card docs.
- **`design-options` · `architecture` · `acceptance-tests` · `evidence`** → a **comment** on the work
  item (`comments/`, `comment_html`), each prefixed with an `<h4>` naming the doc. Comments keep the
  agent-output trail without bloating the description.

```sh
# description docs (spec/plan): PATCH the work item
"$API" --raw PATCH "$BASE/work-items/$uuid/" -H "Content-Type: application/json" \
  -d "$(jq -n --arg html "$DOC_HTML" '{description_html:$html}')"
# trail docs (design-options/architecture/acceptance-tests/evidence): POST a comment
"$API" --raw POST "$BASE/work-items/$uuid/comments/" -H "Content-Type: application/json" \
  -d "$(jq -n --arg html "<h4>$NAME</h4>$DOC_HTML" '{comment_html:$html}')"
```

> `design-options` is a comment, not the description: the decision is a **point-in-time record**
> ("variant B, because…") that shouldn't compete with the plan for the card's body. It stays
> readable in the card's timeline, next to the moment the human picked.

### `read_doc(id, name) → markdown`
Resolve the UUID; fetch the work item (`?expand=state` is unneeded here). For `spec`/`plan`, return
the `description_html`; for the trail docs, GET `comments/` and return the latest comment whose
`<h4>` matches `name`. (`build` calls `read_doc(id, "acceptance-tests")` to transcribe the contract
into executable tests in the repo.)

## Intake queue — `intake-issues` (user-reported requests)

Plane's **Intake** module (formerly "Inbox") is a queue where anyone files a request before it's
triaged into the backlog — the natural source for CodeMaster's `intake` skill. An intake item is a
**wrapper around a work item**, not a work item itself:

- top-level `id` (the intake-entry id, **distinct** from the issue id) + `status` (the triage status, enum below);
- `issue_detail{}` — the embedded work item (`id`, `name`, `state` with group `triage`, `priority`, `description_html`, …).

New items land in a special **Triage** state group (`group: "triage"`), separate from
backlog/unstarted/started/completed/cancelled.

**Triage status enum** (Plane's intake values):

| value | meaning |
|---|---|
| `-2` | Pending — awaiting triage |
| `-1` | Rejected / declined |
| `0`  | Snoozed |
| `1`  | Accepted |
| `2`  | Marked as duplicate |

### `inbox_list() → [report]`
List the **pending** reports for `intake` to triage:

```sh
"$API" --all "$BASE/intake-issues/" \
  | jq '[.[] | select(.status==-2) | {intake_id:.id, issue_id:.issue_detail.id, title:.issue_detail.name, priority:.issue_detail.priority, desc:.issue_detail.description_html}]'
```

### `inbox_resolve(intake_id, decision)`
PATCH the **intake entry's** `status` (not the embedded issue): `accept`=1 · `decline`=-1 · `snooze`=0 · `duplicate`=2.

```sh
"$API" --raw PATCH "$BASE/intake-issues/<intake_id>/" -H "Content-Type: application/json" -d '{"status": 1}'
```

On **accept**, Plane moves the embedded work item out of Triage into the backlog; `intake` then
routes it (set `parent` epic + `type`, or escalate to a new epic) per its altitude table.

> ⚠️ **Verified vs. not:** the **read path** (`intake-issues/` list) and the **status enum** are
> confirmed against a live instance. The **write payloads** (`inbox_resolve` accept/decline/snooze)
> are **not yet exercised** — confirm the exact PATCH body against your Plane before relying on them.

## Assumptions (confirm against your instance when you test)
- `todo → unstarted` (default Plane projects also have a `backlog` group — switch in `statusMap` if you prefer it).
- `blocked` is a **label**, not a state.
- VCS links go in a **comment** (vs. a custom field / external-link integration).
- `mint` puts goal + acceptance criteria in the work item's **description**; `attach_doc` adds the
  spec/plan to the description and the agent-output docs as comments — **all docs live in Plane, none in the repo.**

## Rate limits & bulk
60 req/min. Prefer `--all` + `expand`/`fields` over many calls. For a bulk `mint` (the `backlog`
skill slicing many tickets), loop in Python via the wrapper's env (`set -a; source .codemaster/plane.env; set +a`)
with `time.sleep(0.25)` between calls and stop on the first error — see the `plane` skill's bulk pattern.
