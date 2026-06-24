---
description: Set up a project's CodeMaster tracker — write .codemaster/ for the chosen provider (folder | plane).
argument-hint: <folder | plane>
---

You are initializing the CodeMaster **tracker** for this repo: materialize a project-local
`.codemaster/` runtime for provider **$ARGUMENTS** so the process skills can call the tracker verbs
without depending on an unresolvable plugin path. Run once per repo (re-run to switch providers).

## 1. Locate the plugin source (no `${CLAUDE_PLUGIN_ROOT}` — discover it)
```sh
if [ -d plugin/tracker ]; then
  SRC="plugin/tracker"                                   # running inside the CodeMaster source repo
else
  SRC="$(ls -d "$HOME"/.claude/plugins/cache/codemaster/codemaster/*/tracker 2>/dev/null | sort -V | tail -1)"
fi
[ -n "$SRC" ] && [ -d "$SRC" ] || { echo "codemaster plugin not found — install it first"; exit 1; }
```

## 2. Scaffold `.codemaster/` for the provider

`mkdir -p .codemaster`. Then, by `$ARGUMENTS`:

### `folder`
- Ask for `root` (default `blueprint/v1/backlog`) and `idPrefix` (default `CM`).
- Write `.codemaster/config.json`:
  ```json
  { "tracker": "folder", "folder": { "root": "<root>", "idPrefix": "<PREFIX>" } }
  ```
- `cp "$SRC/providers/folder.md" .codemaster/provider.md`.

### `plane`
- Ask for the workspace slug and project id (UUID) — or tell the user where to find them (the web URL path segment; the project settings).
- Write `.codemaster/config.json` (statusMap defaults shown — adjust per the instance):
  ```json
  {
    "tracker": "plane",
    "plane": { "workspace": "<slug>", "project": "<pid>" },
    "statusMap": { "todo": "unstarted", "in_progress": "started", "done": "completed", "blocked": "blocked" }
  }
  ```
- `cp "$SRC/providers/plane.md" .codemaster/provider.md`
- `mkdir -p .codemaster/bin && cp "$SRC/providers/plane/bin/plane-api.sh" .codemaster/bin/ && chmod +x .codemaster/bin/plane-api.sh`
- `cp "$SRC/providers/plane/plane.env.template" .codemaster/plane.env && chmod 600 .codemaster/plane.env`
- Ensure `.gitignore` contains `.codemaster/plane.env` (the secret) — add it if missing. **Never commit `plane.env`.**

## 3. Validate + confirm
- Validate `.codemaster/config.json` against the schema (`"$SRC/config.schema.json"`) — at minimum, it's valid JSON and `tracker` matches `$ARGUMENTS`.
- Confirm what was written. For `plane`, tell the user to **fill `.codemaster/plane.env`** with their `PLANE_API_URL` / `PLANE_API_KEY` / `PLANE_WORKSPACE_SLUG`, then sanity-check connectivity:
  `.codemaster/bin/plane-api.sh "workspaces/<slug>/projects/<pid>/states/" | jq '.results[]|{name,group}'` (lists the states the status map relies on).
- From here, `intake` / `new-ticket` / `backlog` / `/start-ticket` / `/ship` all route through the active provider automatically.

## Guardrails
- `.codemaster/config.json` and `.codemaster/provider.md` are **committed** (project config); `.codemaster/plane.env` is **gitignored** (secret).
- Don't hand-write provider mechanics — they're copied from the plugin so they stay in sync with the installed version. Re-run `tracker init` after a plugin update to refresh `provider.md` + the wrapper.
