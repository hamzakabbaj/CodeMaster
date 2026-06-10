---
description: Start work on a ticket — create its feature branch and flip its status to in progress (via the active tracker).
argument-hint: <ticket id>  (e.g. /start-ticket 12  or  /start-ticket PROJ-123)
---

You are starting work on ticket **$ARGUMENTS**. **Where** the ticket lives is decided by the active
**tracker provider** — resolve it from `.codemaster/config.json` (`tracker` field, default `folder`);
load its verb mechanics from `.codemaster/provider.md` if present, else the bundled
`plugin/tracker/providers/<tracker>.md`. Contract: `plugin/tracker/README.md`.

Do exactly this:

1. If `$ARGUMENTS` is empty, ask which ticket id to start and stop. (For the `folder` provider a bare number `12` means `<idPrefix>-12`; a remote tracker takes its full id, e.g. `PROJ-123`.)
2. Run `git status`. You must be on `main` (up to date with origin). If you are on another branch, surface it and stop. **Uncommitted changes are fine** — a fresh `new-ticket` scaffold is expected and will be carried onto the new branch.
3. **`read`** the ticket via the active provider to resolve its canonical **`id`**, **`title`**/`slug`, and `acceptance_criteria`. If it doesn't exist, offer to create one with `new-ticket` first, then stop.
4. Create and switch to the branch: `git switch -c feat/<id>-<slug>` (id from the tracker — never assume a prefix; carries any uncommitted scaffold).
5. **`transition(<id>, in_progress)`** via the provider. (For `folder` that sets `"status"` in the ticket and regenerates `ROADMAP.md` via `gen_roadmap.py` — never hand-edit the board; for a remote tracker it moves the item to the mapped state.)
6. Confirm back: the branch name, the ticket title, and the acceptance criteria to satisfy. Then await direction — do not start implementing yet.

Guardrails: branch only off an up-to-date `main`; one ticket → one branch. Do not commit anything in this command. Intended flow: `new-ticket` (mint) → `/start-ticket <id>` (branch + status). Status and persistence belong to the provider — call `read`/`transition`, don't hand-edit a backend.
