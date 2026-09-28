# Provider: `folder`

Work items and their docs are files in a **gitignored local backlog** — the solo dev's private
scratch, never committed. This is CodeMaster's default provider; only the product (code + tests)
reaches git. All mechanics that used to live inside `new-ticket` / `start-ticket` / `ship` live
here now — those skills just call the verbs.

## Config

```json
{ "tracker": "folder", "folder": { "root": ".codemaster/backlog", "idPrefix": "CM" } }
```

- `root` — backlog directory, repo-relative, **gitignored in its entirety** (`/codemaster-init` adds it
  to `.gitignore`). Holds `roadmap.json` + co-located epics:
  `epics/<epic-id>/{spec.md, tickets/<id>-<slug>/{ticket.json, design-options.md, plan.md, acceptance-tests.md, …}}`.
  Everything about one epic — its brief, its tickets, and their docs — lives in that epic's folder,
  and **none of it is committed.**
- `idPrefix` — uppercase tag; ticket ids are `<idPrefix>-<n>` (e.g. `CM-80`); epic ids are kebab-case.

Resolve `ROOT` and `PREFIX` from config — **there is no fallback**: if `.codemaster/config.json` is
absent the repo is unconfigured and the calling skill stops, sending the user to `/codemaster-init`.
All paths below are relative to the repo root.

## ID scheme & timing

**Local — computed before create.** The next id is `PREFIX-(max + 1)`:

```sh
echo "$PREFIX-$(( $(grep -rhoE "$PREFIX-[0-9]+" ROADMAP.md "$ROOT" 2>/dev/null | grep -oE '[0-9]+' | sort -n | tail -1) + 1 ))"
```

A branch can be named from the id immediately (the id exists before persistence).

## Status map

Identity: `todo / in_progress / done / blocked` are stored verbatim in `ticket.json`'s
`status` field. `ROADMAP.md` renders `[x]` for `done`, `[ ]` otherwise.

## Verbs

### `mint(item) → id`

**An `epic` mints differently from a ticket** — `type: epic` registers the epic in the index and
scaffolds its folder; everything else mints a ticket.

**Ticket** (`type: task | story | spike | fix`):
1. Compute the next id (above). Derive `slug` = kebab-case of the title. The ticket's `epic`
   (parent) names the epic folder it lands in — that epic must already exist (minted by `roadmap`).
2. Write `"$ROOT"/epics/<epic-id>/tickets/<id>-<slug>/ticket.json` with the vocabulary fields
   (`id`, `title`, `epic`→parent, `type`, `status: "todo"`, `goal` **or** `story`,
   `acceptance_criteria`). Co-located under its epic. Conforms to the ticket schema bundled with
   the `backlog` skill.
3. Register in `"$ROOT"/roadmap.json`: append `<id>` to the right epic's `tickets[]` and add a
   `board_summaries["<id>"] = "— <title>"` line.
4. Regenerate the board: `python3 scripts/gen_roadmap.py` (and `gen_tickets.py` for the per-ticket
   README). **Never hand-edit `ROADMAP.md`.**
5. Return `<id>`.

**Epic** (`type: epic`, minted by the `roadmap` skill):
1. `id` = **kebab-case of the title** (e.g. "Daily Pick Loop" → `daily-pick-loop`) — *not* the
   `PREFIX-<n>` counter; that's tickets only.
2. Append an entry to `"$ROOT"/roadmap.json` `epics[]` mapping the vocabulary fields:
   `title`→`name`, plus `id`, `status: "todo"`, `goal`, `riskiest_assumption`,
   `depends_on`/`blocks`, and an **empty `tickets[]`** (the `backlog` skill fills it later).
   Conforms to `backlog/schema/roadmap.schema.json`.
3. Scaffold the epic folder: `mkdir -p "$ROOT"/epics/<id>` (empty until `/spec` writes `spec.md`).
   No ticket file is written.
4. Regenerate the board: `python3 scripts/gen_roadmap.py`.
5. Return `<id>`.

> JSON write convention: end every `json.dump` with a trailing newline.

### `read(id) → item`
Read `"$ROOT"/epics/*/tickets/<id>-*/ticket.json` (the id is unique across epics; the `<slug>`
is the folder suffix). Return its fields.

### `list(query) → [item]`
Glob `"$ROOT"/epics/*/tickets/*/ticket.json`, parse each, filter by `status` / `epic` as asked.
The generated `ROADMAP.md` is a fast human view of the same data.

### `transition(id, status)`
Set `"status"` in `"$ROOT"/epics/*/tickets/<id>-*/ticket.json`, then `python3 scripts/gen_roadmap.py`
to refresh the board. This is the only writer of status. (Closing an epic? flip each child
ticket's status too — the board check verifies markdown==JSON, not JSON self-consistency.)

### `link(id, {branch?, pr?})`
The branch name **is** the link: `feat/<id>-<slug>`. No separate write is required for the
folder provider (the PR references the ticket via `Closes <id>` / the branch name). Optionally
record `links` in `ticket.json` if a project wants them explicit.

### `attach_doc(id, name, markdown)`
Write the doc as a **gitignored** markdown file in the item's own folder:
- an **epic** id → `"$ROOT"/epics/<id>/<name>.md` — only `spec.md` lives at this altitude.
- a **ticket** id → `"$ROOT"/epics/*/tickets/<id>-*/<name>.md` — the five ticket slots:
  `design-options.md`, `plan.md`, `architecture.md`, `acceptance-tests.md`, `evidence.md`.

Overwrite if it exists. `name` is the bare doc name (no extension); the provider adds `.md`, and it
must be one of the **six named slots** ([`../README.md`](../README.md#the-six-doc-slots)) — reject
anything else rather than creating a new file.

### `read_doc(id, name) → markdown`
Read `<name>.md` from that same folder (resolve the item's folder as in `read`). Return its
contents, or empty if absent.

## Notes
- **No inbox.** The folder provider has no incoming-report queue — `inbox_list` is empty; a solo
  dev's requests come straight to `intake`. (That's Plane's `intake-issues` module's job.)
- Generators (`gen_roadmap.py`, `gen_tickets.py`) and the schema are CodeMaster-repo scripts;
  the folder provider assumes a repo that carries them (CodeMaster itself, or the `backlog`
  skill's output structure). A non-CodeMaster repo using `folder` supplies its own equivalent
  or drops the regen step.
- **Co-location vs. the bundled generators:** the verb paths above are co-located
  (`epics/<epic-id>/tickets/…`). CodeMaster's own `gen_roadmap.py`/`gen_tickets.py` and its
  historical `blueprint/v1/backlog/` predate this and still read the **flat** `tickets/…` layout —
  they need updating before the regen step works against a co-located board. Until then, a
  co-located project drops the regen step (the `roadmap.json` index is still authoritative).
