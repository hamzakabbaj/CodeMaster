---
description: Start work on a CodeMaster ticket — create its feature branch and flip its status to in progress.
argument-hint: <CM-number>  (e.g. /start-ticket 12)
---

You are starting work on ticket **CM-$ARGUMENTS** following the CodeMaster contract (CONTRIBUTING.md, CLAUDE.md).

Do exactly this:

1. If `$ARGUMENTS` is empty, ask which ticket number to start and stop.
2. Run `git status`. You must be on `main` (up to date with origin). If you are on another branch, surface it and stop. **Uncommitted changes are fine** — a fresh `new-ticket` scaffold is expected and will be carried onto the new branch.
3. Locate the ticket folder `blueprint/v1/backlog/tickets/CM-$ARGUMENTS-*/` and its `ticket.json` (the ticket body); the `<slug>` is the folder name after `CM-$ARGUMENTS-`. If no ticket folder exists, offer to create one with the `new-ticket` skill first, then stop.
4. Create and switch to the branch: `git switch -c feat/CM-$ARGUMENTS-<slug>` (carries any uncommitted scaffold).
5. Flip status to in progress: set `"status": "in_progress"` in the ticket's `ticket.json`, then run `python3 scripts/gen_roadmap.py` to refresh the generated `ROADMAP.md`. **Never hand-edit `ROADMAP.md`** — it is generated from the JSON backlog.
6. Confirm back: the branch name, the ticket title, and the acceptance criteria to satisfy. Then await direction — do not start implementing yet.

Guardrails: branch only off an up-to-date `main`; one ticket → one branch (CONTRIBUTING.md). Do not commit anything in this command. Intended flow: `new-ticket` (scaffold) → `/start-ticket <n>` (branch + status).
