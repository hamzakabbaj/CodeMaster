# Tracker — the pluggable backlog seam

CodeMaster's process skills never touch a backlog directly. They call a small set of
**tracker verbs**; a **provider** implements them; a per-project **config file** picks
the provider. Swap where work items live — repo folders, Plane, anything later — by
changing one config line. The loop, the fleet, and the cage don't change.

## Selecting a provider

A consuming project carries `.codemaster/config.json` at its root:

```json
{ "tracker": "folder", "folder": { "root": "blueprint/v1/backlog", "idPrefix": "CM" } }
```

- If the file is absent, the provider defaults to **`folder`** with `root: "blueprint/v1/backlog"`, `idPrefix: "CM"` (CodeMaster's own historical layout).
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
| `parent` | id of the epic/parent, if any |
| `links` | `{ branch?, pr? }` — VCS artifacts attached to the item |

## The verbs

A provider is **defined by implementing these five.** Signatures are conceptual — each
provider doc says exactly how it realizes them.

| Verb | Used by | Contract |
|---|---|---|
| `mint(item) → id` | `feature-intake`, `backlog`, `new-ticket` | Create a tracked item from the vocabulary fields at initial status `todo`; **return the canonical `id`.** Folds "assign id + persist + register". |
| `read(id) → item` | `start-ticket`, `build` | Fetch the full item (title, type, status, goal/story, acceptance_criteria, parent, links). |
| `list(query) → [item]` | `feature-intake`, "what's ready/next" | Enumerate items, filterable by status / parent. |
| `transition(id, status)` | `start-ticket`, `ship` | The **only** writer of `status`. Maps the CodeMaster status to the provider's native state. |
| `link(id, {branch?, pr?})` | `start-ticket`, `ship` | Attach VCS artifacts to the item (and, in reverse, the branch name is derived from `id`). |

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

## Materializing into a project — `tracker init`

A consuming repo doesn't reference the plugin's files directly (an installed plugin's path isn't
resolvable from skill-body bash). Instead, **`/tracker-init <provider>`** copies the chosen provider's
mechanics — and, for `plane`, its wrapper + an env template — into the project's `.codemaster/`:
`config.json` + `provider.md` are committed; `plane.env` (secrets) is gitignored. Skills then read
only cwd-relative `.codemaster/…`. Inside the CodeMaster source repo the bundled `plugin/tracker/…`
paths also resolve, so `folder` needs no init here.

> Scope: the tracker seam covers **work items + status only.** Design artifacts (the
> `/spec` output, design-thinking maps, blueprints) stay as repo files regardless of
> provider — they version with the code and are reviewed in the PR.
