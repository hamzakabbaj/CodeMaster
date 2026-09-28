# Tracker — the pluggable backlog seam

CodeMaster's process skills never touch a backlog directly. They call a small set of
**tracker verbs**; a **provider** implements them; a per-project **config file** picks
the provider. Swap where work items live — repo folders, Plane, anything later — by
changing one config line. The loop, the fleet, and the cage don't change.

## Selecting a provider

A consuming project carries `.codemaster/config.json` at its root:

```json
{ "tracker": "folder", "folder": { "root": ".codemaster/backlog", "idPrefix": "CM" } }
```

- **If the file is absent the repo is *unconfigured*, not "folder by default".** Every skill that
  needs a verb stops and routes the user to **`/codemaster-init`**. There is deliberately no silent
  fallback: the old one handed a fresh project an un-gitignored backlog at CodeMaster's own
  historical path (`blueprint/v1/backlog`), which quietly violates "the repo holds only the product".
- To invoke a verb, a skill: (1) reads `.codemaster/config.json` → `tracker`, (2) follows
  the matching provider doc in [`providers/`](providers/) for that verb. Nothing else in the
  skill is provider-aware.

Config is validated by [`config.schema.json`](config.schema.json).

## The ticket vocabulary (provider-agnostic)

Every provider serializes the same core item. These are the only fields the process
skills know about; each provider maps them to its native schema.

| Field | Meaning |
|---|---|
| `id` | canonical handle — `CM-80`, `ETK-12`, `PROJ-123`. Format + when it's assigned is provider-defined. |
| `title` | one line |
| `type` | `task` · `story` · `spike` · `fix` · `epic` |
| `status` | `todo` · `in_progress` · `done` · `blocked` |
| `goal` *or* `story` | a task carries `goal` (one sentence); a story carries `story` ("As a … I want … so that …") |
| `acceptance_criteria[]` | testable, checkable |
| `riskiest_assumption` | **epics only** — the one thing most likely to be wrong (named by `roadmap`, sharpened by `/spec`, promoted to an enabler ticket by `backlog`) |
| `parent` | id of the epic/parent, if any |
| `links` | `{ branch?, pr? }` — VCS artifacts attached to the item |

## The verbs

A provider is **defined by implementing these seven** — five for the work-item, two for its
docs. Signatures are conceptual — each provider doc says exactly how it realizes them.

| Verb | Used by | Contract |
|---|---|---|
| `mint(item) → id` | `intake`, `backlog`, `new-ticket` | Create a tracked item from the vocabulary fields at initial status `todo`; **return the canonical `id`.** Folds "assign id + persist + register". |
| `read(id) → item` | `start-ticket`, `build` | Fetch the full item (title, type, status, goal/story, acceptance_criteria, parent, links). |
| `list(query) → [item]` | `intake`, "what's ready/next" | Enumerate items, filterable by status / parent. |
| `transition(id, status)` | `start-ticket`, `ship` | The **only** writer of `status`. Maps the CodeMaster status to the provider's native state. |
| `link(id, {branch?, pr?})` | `start-ticket`, `ship` | Attach VCS artifacts to the item (and, in reverse, the branch name is derived from `id`). |
| `attach_doc(id, name, markdown)` | `/spec`, `/design-options`, `frame`, `build` | Store a markdown **doc** against an item — one of the **six named slots** below. **Never committed to the repo** — the provider decides where it lives. |
| `read_doc(id, name) → markdown` | `backlog`, `frame`, `build` | Fetch a doc previously attached. (e.g. `build` reads the `acceptance-tests` doc to transcribe it into executable tests.) |

### The six doc slots

`attach_doc`/`read_doc` take a **fixed, named slot** — not a free-form filename. The set is closed so
every provider stores the same six things and any skill can ask for one by name.

| Slot | Altitude | Written by | Read by | Holds |
|---|---|---|---|---|
| `spec` | **epic** | `/spec` | `backlog`, `frame` | The epic brief. Tickets **inherit** it — a ticket never owns one. |
| `design-options` | ticket | `/design-options` | `build` | The **UI/interaction decision**: which variant was chosen, why, and why not the others. The gallery itself is throwaway (gitignored `prototypes/`); only the decision is durable. |
| `plan` | ticket | `frame` | `build` | The approach across layers, when the ticket is gnarly enough to earn one. Its presence is the `gnarly` signal for `build-critique`. |
| `architecture` | ticket | `frame` *or* `build` | `build`, `ship` | A boundary/coupling verdict — from the `architect` agent in frame, or from `build` when a critique round moves a boundary mid-loop. |
| `acceptance-tests` | ticket | `frame` | `build` | The done-contract. **The one bridge**: `build` transcribes it into executable tests, and *those* are committed. |
| `evidence` | ticket | `build`, completed by `ship` | humans, `ship` | Proof per acceptance criterion, the ladder run, what the critique changed, the merged PR. What makes "done" checkable rather than claimed. |

An **empty slot is a statement, not an omission** — no `architecture` doc means no boundary moved; no
`design-options` doc means there was no open UI choice. Skills must tolerate a missing slot and never
invent one; providers must not add slots of their own.

### Optional — inbox verbs (providers with an incoming-report queue)

Some trackers expose a queue where anyone files a request *before* it's triaged. A provider may
implement two more verbs so `intake` can pull from it:

| Verb | Used by | Contract |
|---|---|---|
| `inbox_list() → [report]` | `intake` | List untriaged user-reported requests waiting to enter the backlog. **Empty** for providers without a queue. |
| `inbox_resolve(id, decision)` | `intake` | Resolve a report — `accept` (→ route into the backlog) · `decline` · `snooze` · `duplicate`. |

The `folder` provider has **no inbox** (solo: requests come straight to `intake`); `plane` maps
these to its **Intake** module (`intake-issues`).

## Two things every provider must declare

These are what actually make the flow portable:

1. **ID scheme + assignment timing.** *Local* providers (folder) compute the next id
   **before** create, so a branch can be named up front. *Remote* providers (Plane) have
   the server **assign** the id on create — so the flow is "`mint` first, then branch off the
   returned id." Skills must treat `mint`'s return value as the source of truth for the id,
   never assume a prefix.
2. **Status map.** How `todo / in_progress / done / blocked` map to the provider's states,
   and which transition `ship` fires (→ `done` on merge; optionally → a review state on
   PR-open if one exists). For the `folder` provider this is the identity map; for Plane it
   maps to state *groups* and lives under `statusMap` in config.

## Providers

- [`providers/folder.md`](providers/folder.md) — files + git in the repo (the default; what CodeMaster has always done).
- [`providers/plane.md`](providers/plane.md) — a [Plane](https://plane.so) instance over its REST API via the bundled `plane-api.sh` CLI.

## Materializing into a project — `/codemaster-init`

A consuming repo doesn't reference the plugin's files directly (an installed plugin's path isn't
resolvable from skill-body bash). Instead, **`/codemaster-init --tracker=<provider>`** copies the
chosen provider's mechanics — and, for `plane`, its wrapper + an env template — into the project's
`.codemaster/`: `config.json` + `provider.md` are committed; `plane.env` (secrets) is gitignored, as
is the `folder` backlog root. Skills then read only cwd-relative `.codemaster/…`.

Run with **no flags** it's a **doctor**: it reports what's configured, whether `provider.md` has gone
stale against the installed plugin, whether the backlog/secrets are actually gitignored, and — for
`plane` — whether the credentials resolve and every `statusMap` value names a **real state group in
that instance**. `--check` runs the doctor and writes nothing (CI-friendly). Re-running with the same
provider is an idempotent **refresh**; requesting a *different* provider over a non-empty backlog is
a **switch**, which orphans the existing items and therefore requires `--force`.

`/tracker-init` remains as an alias. Inside the CodeMaster source repo the bundled
`plugin/tracker/…` paths also resolve, but the repo still needs a `config.json` — there is no
implicit default anywhere.

> Scope: the tracker owns **the whole backlog — work-items, status, *and* docs.** The git repo
> holds only the **product**: the code and its executable tests. Everything process — the backlog
> records and the six markdown doc slots (`spec` · `design-options` · `plan` · `architecture` ·
> `acceptance-tests` · `evidence`)
> — lives in the tracker and is **never committed**. For `plane` that means cards + comments (the
> team's shared surface); for `folder` it's gitignored local files (the solo dev's private scratch).
> The acceptance-tests doc is the one bridge: `build` reads it back and transcribes it into
> executable tests, which *are* committed — the contract is ephemeral, its executable form durable.
