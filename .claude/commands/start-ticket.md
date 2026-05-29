---
description: Start work on a CodeMaster ticket — create its feature branch and flip its status to in progress.
argument-hint: <CM-number>  (e.g. /start-ticket 12)
---

You are starting work on ticket **CM-$ARGUMENTS** following the CodeMaster contract (CONTRIBUTING.md, CLAUDE.md).

Do exactly this:

1. If `$ARGUMENTS` is empty, ask which ticket number to start and stop.
2. Run `git status`. You must be on `main` (up to date with origin). If you are on another branch, surface it and stop. **Uncommitted changes are fine** — a fresh `new-ticket` scaffold is expected and will be carried onto the new branch.
3. Locate the ticket file `backlog/tickets/CM-$ARGUMENTS-*.md`. Read its title to derive a kebab-case `<slug>`. If no ticket file exists, offer to create one with the `new-ticket` skill first, then stop.
4. Create and switch to the branch: `git switch -c feat/CM-$ARGUMENTS-<slug>` (carries any uncommitted scaffold).
5. Flip status to in progress: set the ticket file's `Status:` to `🟦 in progress`, and set the matching phase row in `ROADMAP.md` to `🟦` if it isn't already.
6. Confirm back: the branch name, the ticket title, and the acceptance criteria to satisfy. Then await direction — do not start implementing yet.

Guardrails: branch only off an up-to-date `main`; one ticket → one branch (CONTRIBUTING.md). Do not commit anything in this command. Intended flow: `new-ticket` (scaffold) → `/start-ticket <n>` (branch + status).
