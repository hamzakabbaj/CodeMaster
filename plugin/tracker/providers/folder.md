# Provider: `folder`

Work items and their docs are files in a **gitignored local backlog** — the solo dev's private
scratch, never committed. This is CodeMaster's default provider; only the product (code + tests)
reaches git. The process skills never touch these files directly — they call the verbs below.

## Config

```json
{ "tracker": "folder", "verify": "npm test", "folder": { "root": ".codemaster/backlog", "idPrefix": "ETK" } }
```

- `root` — backlog directory, repo-relative, **gitignored in its entirety** (`/codemaster-init` adds it
  to `.gitignore`). **None of it is committed.**
- `idPrefix` — uppercase project tag for **tickets** (`ETK-12`). Not `E` or `F` — those are the epic
  and feature id letters.

Resolve `ROOT` and `PREFIX` from config — **there is no fallback**: if `.codemaster/config.json` is
absent the repo is unconfigured and the calling skill stops, sending the user to `/codemaster-init`.
All paths below are relative to the repo root.

## Layout — built to be read in a file explorer

```
<root>/
  epics/
      E1-daily-pick-loop/                  item.json
  features/
      E1-F1-pick-reminders/                item.json · spec.md
      E1-F2-weekly-digest/                 item.json
  1-⬜ todo/
      E1-F1-ETK-3-snooze/                  item.json
      ETK-2-crash-on-empty-list/           item.json            ← standalone, no prefix
  2-🟡 doing/
      E1-F1-ETK-1-reminder-settings/       item.json · plan.md · acceptance-tests.md
  3-⛔ blocked/
  4-✅ done/
      E1-F1-ETK-5-reminder-timezone-rule/  item.json · evidence.md
```

- **Epics and features** live in `epics/` and `features/`, one folder each, and never move between
  folders. Their status is the `status` field in their `item.json`.
- **Tickets** live in the four **status folders**, and their status **is the folder they're in** —
  there is no `status` field in a ticket's `item.json`. The number prefix keeps the folders in
  workflow order in any file explorer.
- **Folder names are derived, never parsed.** The truth is in `item.json` (`id`, `parent`, `title`);
  the name is a readable view of it, rewritten by the verbs whenever the parent changes. Doc slots are
  `<name>.md` files beside `item.json`, which conforms to [`../item.schema.json`](../item.schema.json).

### Folder names

`slug` = kebab-case of the title, cut to ~40 characters.

| Item | Name | Example |
|---|---|---|
| Epic | `<epic-id>-<slug>` | `E1-daily-pick-loop` |
| Feature | `[<epic-id>-]<feature-id>-<slug>` | `E1-F1-pick-reminders` |
| Ticket | `[<epic-id>-][<feature-id>-]<ticket-id>-<slug>` | `E1-F1-ETK-3-snooze` |

A ticket's `<epic-id>` is its parent epic, or its feature's parent epic. Missing levels are simply
left out (`E1-ETK-9-…` sits directly under an epic; `ETK-2-…` stands alone). The explorer's natural
sort then groups each status folder by epic and feature.

## ID scheme & timing — one counter per level

**Local — computed before create.** Epics are `E<n>`, features `F<n>`, tickets `<PREFIX>-<n>`; each
level counts on its own, so the first epic is `E1` and the first ticket is `ETK-1`.

```sh
max_n() {  # $1 = the id pattern; the other args = folders to scan
  pat=$1; shift
  n=$(for d in "$@"; do ls "$d"; done 2>/dev/null | grep -oE "$pat" | grep -oE '[0-9]+' | sort -n | tail -1)
  echo "${n:-0}"
}
echo "E$((  $(max_n '^E[0-9]+-'              "$ROOT/epics")    + 1 ))"    # next epic
echo "F$((  $(max_n '(^|-)F[0-9]+-'          "$ROOT/features") + 1 ))"    # next feature
echo "$PREFIX-$(( $(max_n "(^|-)$PREFIX-[0-9]+-" "$ROOT"/[1-4]-*) + 1 ))" # next ticket
```

A branch can be named from a ticket id immediately (the id exists before persistence).

## Resolving an id

`resolve <id>` = the one folder whose name carries that id as a whole segment:

| Id | Search | Name must match |
|---|---|---|
| `E<n>` | `epics/` | `^E<n>-` |
| `F<n>` | `features/` | `^(E[0-9]+-)?F<n>-` |
| `<PREFIX>-<n>` | the four status folders | `^(E[0-9]+-)?(F[0-9]+-)?<PREFIX>-<n>-` |

Match the whole segment (anchored, with the trailing `-`), so `F1` never matches `F12` and `ETK-3`
never matches `ETK-31`. Status folder names contain spaces and emoji — **always quote paths**.

```sh
for d in "$ROOT"/[1-4]-*; do ls "$d" | grep -E "^(E[0-9]+-)?(F[0-9]+-)?$ID-" | sed "s|^|$d/|"; done  # a ticket
```

## Status map

Identity: `todo · in_progress · done · blocked` ↔ `1-⬜ todo` · `2-🟡 doing` · `4-✅ done` ·
`3-⛔ blocked` for tickets; the same four values verbatim in `item.json` for epics and features.

## Verbs

### `mint(item) → id`
1. **Check the parent**, if one is given: it must exist (`resolve`) and be a **higher level** — a
   ticket's parent is a feature or an epic, a feature's parent is an epic, an epic has none. Reject
   anything else rather than writing it.
2. Compute the next id for the item's level (above) and derive its folder name.
3. Write `item.json` with the vocabulary fields:
   - epic → `epics/<name>/`, feature → `features/<name>/`, both with `"status": "todo"`;
   - ticket → `"$ROOT/1-⬜ todo/<name>/"`, **without** a `status` field.
4. Return the id.

> JSON write convention: end every `json.dump` with a trailing newline.

### `read(id) → item`
Read `item.json` from `resolve <id>`. For a ticket, add `status` from the status folder it sits in.

### `list(query) → [item]`
Glob `"$ROOT"/{epics,features,[1-4]-*}/*/item.json`, parse each (tickets take their status from the
folder), and filter by `type` / `status` / `parent` as asked. A feature's tickets are
`list(parent: <feature-id>)`; an epic's features are `list(type: feature, parent: <epic-id>)`.

### `transition(id, status)`
The only writer of status.
- **Ticket** → `mv` its folder into the target status folder (name unchanged).
- **Epic / feature** → set `status` in its `item.json`. Children aren't touched — before closing a
  container, check `list(parent: <id>)` and say what's still open.

### `set_parent(id, parent | none)`
1. Check the new parent as in `mint` (exists, higher level). `none` makes the item standalone.
2. Set or remove `parent` in `item.json`, then **rename the folder** to its newly derived name.
3. **A feature moving to another epic renames its tickets too** — their `<epic-id>` prefix changes.

### `link(id, {branch?, pr?})`
The branch name **is** the link: `feat/<id>-<slug>`. No separate write is required (the PR
references the ticket via `Closes <id>` / the branch name). Optionally record `links` in `item.json`
if a project wants them explicit.

### `attach_doc(id, name, markdown)`
Write `resolve <id>/<name>.md` — a **gitignored** markdown file beside `item.json`. Overwrite if it
exists. `name` is the bare doc name (no extension); it must be one of the **six named slots**
([`../README.md`](../README.md#the-six-doc-slots)) **for that item's level** (`spec` on a feature;
the five ticket slots on a ticket) — reject anything else rather than creating a new file.

### `read_doc(id, name) → markdown`
Read `resolve <id>/<name>.md`. Return its contents, or empty if absent.

## Notes
- **No inbox.** The folder provider has no incoming-report queue — `inbox_list` is empty; a solo
  dev's requests come straight to `intake`. (That's Plane's `intake-issues` module's job.)
- **Paths move.** A ticket's folder moves on every status change and is renamed when its parent
  changes, so skills always go through `resolve <id>` — never keep a path around.
