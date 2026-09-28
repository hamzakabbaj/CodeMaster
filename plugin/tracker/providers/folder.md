# Provider: `folder`

Work items and their docs are files in a **gitignored local backlog** — the solo dev's private
scratch, never committed. This is CodeMaster's default provider; only the product (code + tests)
reaches git. The process skills never touch these files directly — they call the verbs below.

## Config

```json
{ "tracker": "folder", "verify": "npm test", "folder": { "root": ".codemaster/backlog", "idPrefix": "CM" } }
```

- `root` — backlog directory, repo-relative, **gitignored in its entirety** (`/codemaster-init` adds it
  to `.gitignore`). **None of it is committed.**
- `idPrefix` — uppercase tag; every item's id is `<idPrefix>-<n>` (e.g. `ETK-12`), at every level.

Resolve `ROOT` and `PREFIX` from config — **there is no fallback**: if `.codemaster/config.json` is
absent the repo is unconfigured and the calling skill stops, sending the user to `/codemaster-init`.
All paths below are relative to the repo root.

## Layout — flat, by id

Every item — epic, feature, or ticket — is one folder directly under `items/`. The hierarchy lives
**only** in each item's `parent` field, never in the folder structure, so re-parenting a ticket is a
one-field edit and a standalone item needs no special home.

```
<root>/items/
  ETK-1-daily-pick-loop/          item.json   (type: epic)
  ETK-2-pick-reminders/           item.json   (type: feature, parent: ETK-1) · spec.md
  ETK-3-reminder-timezone-rule/   item.json   (type: task, subtype: enabler, parent: ETK-2) · plan.md · acceptance-tests.md · evidence.md
  ETK-4-crash-on-empty-list/      item.json   (type: fix — standalone, no parent)
```

`item.json` conforms to [`../item.schema.json`](../item.schema.json). Doc slots are `<name>.md` files
beside it.

## ID scheme & timing

**Local — computed before create.** The next id is `PREFIX-(max + 1)` over the existing item folders:

```sh
n=$(ls "$ROOT/items" 2>/dev/null | grep -oE "^$PREFIX-[0-9]+" | grep -oE '[0-9]+$' | sort -n | tail -1)
echo "$PREFIX-$(( ${n:-0} + 1 ))"
```

A branch can be named from the id immediately (the id exists before persistence).

## Status map

Identity: `todo / in_progress / done / blocked` are stored verbatim in `item.json`'s `status` field.

## Verbs

`resolve <id>` below means: the single folder matching `"$ROOT"/items/<id>-*/` (ids are unique).

### `mint(item) → id`
1. **Check the parent**, if one is given: it must exist (`resolve`) and be a **higher level** — a
   ticket's parent is a `feature` or `epic`, a feature's parent is an `epic`, an epic has none. Reject
   anything else rather than writing it.
2. Compute the next id (above). Derive `slug` = kebab-case of the title.
3. Write `"$ROOT"/items/<id>-<slug>/item.json` with the vocabulary fields and `status: "todo"`.
   Validate it against the item schema.
4. Return `<id>`.

> JSON write convention: end every `json.dump` with a trailing newline.

### `read(id) → item`
Read `item.json` from `resolve <id>`. Return its fields.

### `list(query) → [item]`
Glob `"$ROOT"/items/*/item.json`, parse each, filter by `type` / `status` / `parent` as asked. A
feature's tickets are `list(parent: <feature-id>)`; an epic's features are `list(type: feature,
parent: <epic-id>)`.

### `transition(id, status)`
Set `"status"` in `resolve <id>`/`item.json`. This is the only writer of status. (Closing a feature
or an epic? Its children aren't touched — check `list(parent: <id>)` first and say what's still open.)

### `link(id, {branch?, pr?})`
The branch name **is** the link: `feat/<id>-<slug>`. No separate write is required (the PR
references the ticket via `Closes <id>` / the branch name). Optionally record `links` in `item.json`
if a project wants them explicit.

### `attach_doc(id, name, markdown)`
Write `resolve <id>/<name>.md` — a **gitignored** markdown file beside `item.json`. Overwrite if it
exists. `name` is the bare doc name (no extension); it must be one of the **six named slots**
([`../README.md`](../README.md#the-six-doc-slots)) **at that item's altitude** (`spec` on a feature;
the five ticket slots on a ticket) — reject anything else rather than creating a new file.

### `read_doc(id, name) → markdown`
Read `resolve <id>/<name>.md`. Return its contents, or empty if absent.

## Notes
- **No inbox.** The folder provider has no incoming-report queue — `inbox_list` is empty; a solo
  dev's requests come straight to `intake`. (That's Plane's `intake-issues` module's job.)
