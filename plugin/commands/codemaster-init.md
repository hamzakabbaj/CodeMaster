---
description: Initialize or check CodeMaster in this repo — pick the tracker provider, scaffold .codemaster/, and verify it actually works. Run once per repo; re-run to refresh or to diagnose.
argument-hint: "[--tracker=folder|plane] [--root=…] [--id-prefix=…] [--workspace=…] [--project=…] [--check] [--force]"
---

You are initializing (or diagnosing) **CodeMaster** in this repo. The job is to materialize a
project-local `.codemaster/` runtime so every process skill can call the tracker verbs without
depending on an unresolvable plugin path — **and to prove it works before the user hits `/ship`.**

**There is no silent default.** A repo with no `.codemaster/config.json` is *unconfigured*, not
"folder by default" — the skills stop and route here. That is deliberate: the old fallback handed a
fresh project an un-gitignored backlog at CodeMaster's own historical path.

## 0. Parse `$ARGUMENTS`

| Flag | Meaning |
|---|---|
| `--tracker=folder\|plane` | which provider to configure. A **bare positional** (`folder` / `plane`) means the same thing — that's the legacy `/tracker-init` form. |
| `--root=<path>` | `folder` only — backlog root (default `.codemaster/backlog`). |
| `--id-prefix=<PREFIX>` | `folder` only — uppercase id prefix (default: the repo name's initials, else `CM`). |
| `--workspace=<slug>` | `plane` only — workspace slug. |
| `--project=<uuid>` | `plane` only — project id. |
| `--check` | **doctor only**: run §1 + §2, report, write nothing. Exit non-zero-ish (say so plainly) if anything is broken. Useful in CI. |
| `--force` | permit a **provider switch** over an existing, non-empty backlog (see §3). |

**No flags at all → doctor mode**: run §1 + §2, report the state, then *ask* what to do. Never
scaffold silently on a bare invocation of an already-configured repo.

Ask only for what a flag didn't supply, and only for the chosen provider.

## 1. Locate the plugin source (no `${CLAUDE_PLUGIN_ROOT}` — discover it)
```sh
if [ -d plugin/tracker ]; then
  SRC="plugin/tracker"                                   # running inside the CodeMaster source repo
else
  SRC="$(ls -d "$HOME"/.claude/plugins/cache/codemaster/codemaster/*/tracker 2>/dev/null | sort -V | tail -1)"
fi
[ -n "$SRC" ] && [ -d "$SRC" ] || { echo "codemaster plugin not found — install it first"; exit 1; }
```

## 2. Doctor — report before you touch anything

Always run this first, whatever the flags. Report each line as **ok / missing / stale / broken**:

```sh
test -f .codemaster/config.json && jq -e '.tracker' .codemaster/config.json    # configured? which provider?
test -f .codemaster/provider.md                                                # mechanics materialized?
cmp -s .codemaster/provider.md "$SRC/providers/$(jq -r .tracker .codemaster/config.json).md"  # stale vs installed plugin?
```

Then the provider-specific checks — **these are the ones that actually catch breakage**:

### `folder`
- `config.folder.root` and `idPrefix` present and schema-valid.
- **`<root>/` is gitignored.** `git check-ignore -q "<root>" && echo ok` — if it isn't, the backlog
  is on a path to being committed, which violates the "repo holds only the product" rule. Broken.
- If `<root>/` exists, report how many items are in it (that number decides §3).

### `plane`
- `.codemaster/plane.env` exists, is `chmod 600`, is **gitignored**, and has all three of
  `PLANE_API_URL` / `PLANE_API_KEY` / `PLANE_WORKSPACE_SLUG` filled (not the template placeholders).
- `.codemaster/bin/plane-api.sh` exists and is executable.
- **Connectivity + status map, for real** — don't tell the user to run this, run it:
  ```sh
  W=$(jq -r .plane.workspace .codemaster/config.json); P=$(jq -r .plane.project .codemaster/config.json)
  GROUPS=$(.codemaster/bin/plane-api.sh "workspaces/$W/projects/$P/states/" | jq -r '.results[].group' | sort -u)
  ```
  Assert **every value in `statusMap` appears in `$GROUPS`.** Plane's groups are
  `backlog · unstarted · started · completed · cancelled` — anything else is a misconfiguration that
  would only surface later, when `/ship` tries to transition a ticket.
- **`blocked` must NOT be in `statusMap`.** Plane has no `blocked` group — the provider models
  blocked as a **label** ([`providers/plane.md`](../tracker/providers/plane.md) §Status map). A
  `"blocked": "blocked"` entry is broken config; report it and drop it.

**`--check` stops here.** Print the verdict — `CodeMaster: ok (<provider>)` or a list of the broken
lines with the exact fix for each — and do nothing else.

## 3. Decide the action (and guard it)

From the doctor result, classify — say which one you're doing before you do it:

| State | Action |
|---|---|
| no `.codemaster/` | **fresh init** — scaffold §4. |
| configured, same provider requested | **refresh** — re-copy `provider.md` (+ the `plane` wrapper) from `$SRC`, leave `config.json` and `plane.env` alone. Idempotent; this is what you run after a plugin update. |
| configured, **different** provider requested | **switch — a migration, not a rewrite.** |

**The switch guard.** Changing `tracker` orphans everything in the current backlog — the items don't
move. So: if the current backlog is **non-empty** (folder items on disk, or a Plane project with work
items), **stop** unless `--force`. Tell the user exactly what would be orphaned (the count and where
it lives) and that CodeMaster has no migration verb — the items must be moved by hand or abandoned
deliberately. With `--force`, proceed and say plainly what was left behind.

Also fix any repair the doctor found (missing gitignore entry, wrong `plane.env` mode, stale
`provider.md`, `blocked` in `statusMap`) — repairs are safe and never need `--force`.

## 4. Scaffold

`mkdir -p .codemaster`. Then, by provider:

### `folder`
- `root` default `.codemaster/backlog`; `idPrefix` default from the repo name (`CodeMaster` → `CM`), else `CM`.
- Write `.codemaster/config.json`:
  ```json
  { "tracker": "folder", "folder": { "root": "<root>", "idPrefix": "<PREFIX>" } }
  ```
- `cp "$SRC/providers/folder.md" .codemaster/provider.md`
- **Gitignore the backlog** — ensure `.gitignore` contains `<root>/`. The folder backlog (work-items
  **and** docs) is the solo dev's private scratch; only the product (code + tests) is committed.
  **Never commit `<root>/`.**

### `plane`
- Need the workspace slug and project id (UUID). If a flag didn't supply them, ask — and say where to
  look: the slug is the path segment after the domain in the Plane web URL; the project id is in the
  project's settings (or the URL after `/projects/`).
- Write `.codemaster/config.json` — **no `blocked` key**, per §2:
  ```json
  {
    "tracker": "plane",
    "plane": { "workspace": "<slug>", "project": "<pid>" },
    "statusMap": { "todo": "unstarted", "in_progress": "started", "done": "completed" }
  }
  ```
- `cp "$SRC/providers/plane.md" .codemaster/provider.md`
- `mkdir -p .codemaster/bin && cp "$SRC/providers/plane/bin/plane-api.sh" .codemaster/bin/ && chmod +x .codemaster/bin/plane-api.sh`
- `cp "$SRC/providers/plane/plane.env.template" .codemaster/plane.env && chmod 600 .codemaster/plane.env` — **only if it doesn't already exist**; never clobber filled-in credentials.
- Ensure `.gitignore` contains `.codemaster/plane.env`. **Never commit it.**

## 5. Verify — re-run the doctor

Validate `.codemaster/config.json` against `"$SRC/config.schema.json"`, then **re-run §2 against what
you just wrote.** Init is not done until the doctor is green.

For a fresh `plane` init the credentials are still placeholders, so connectivity *will* fail — that's
expected, not a bug. Say so explicitly: "fill `.codemaster/plane.env`, then run `/codemaster-init
--check`", and make that the single next action. Do not report success on an unverified Plane setup.

## 6. Confirm

Report: the action taken (fresh / refresh / switch), every file written, the doctor verdict, and the
**one** next action — `/codemaster-init --check` if Plane creds are pending, else `intake` or
`roadmap`. From here `intake` / `new-ticket` / `roadmap` / `backlog` / `/spec` / `/start-ticket` /
`/ship` all route through the active provider automatically.

## Guardrails
- `.codemaster/config.json` and `.codemaster/provider.md` are **committed** (project config);
  `.codemaster/plane.env` is **gitignored** (secret), as is the `folder` backlog root.
- Don't hand-write provider mechanics — they're copied from the plugin so they stay in sync with the
  installed version. Re-run this after a plugin update to refresh `provider.md` + the wrapper.
- Never print the contents of `plane.env` or the API key, including in the doctor report. Report
  presence and shape ("set" / "still the template placeholder"), never the value.
- This command configures; it does not create work. It never mints, transitions, or deletes items.
