---
description: Start work on a ticket — create its feature branch (optionally an isolated git worktree) and flip its status to in progress (via the active tracker).
argument-hint: <ticket id> [--worktree]   (e.g. /start-ticket 12  ·  /start-ticket PROJ-123 --worktree)
---

You are starting work on ticket **$ARGUMENTS**. **Where** the ticket lives is decided by the active
**tracker provider** — resolve it from `.codemaster/config.json` (`tracker` field, default `folder`);
load its verb mechanics from `.codemaster/provider.md` if present, else the bundled
`plugin/tracker/providers/<tracker>.md`. Contract: `plugin/tracker/README.md`.

**Flag — `--worktree`:** create the branch in an **isolated git worktree** (its own directory)
instead of switching the current checkout, so several **independent** tickets can be built in
parallel without branch-switching. Default is in-place. Only parallelize tickets with **no
`depends_on` edge between them** — the dependency graph tells you which are safe.

Do exactly this:

1. **Parse args.** Separate the ticket id from the optional `--worktree` flag. If the id is empty,
   ask which ticket to start and stop. (folder: a bare `12` → `<idPrefix>-12`; a remote tracker
   takes its full id, e.g. `PROJ-123`.)
2. **`read`** the ticket via the active provider → its canonical **`id`**, **`title`**/`slug`, and
   `acceptance_criteria`. If it doesn't exist, offer to create one with `new-ticket` first, then stop.
3. **Branch — in place, or in a worktree:**
   - **In place (default).** Run `git status`: you must be on `main`, up to date with origin
     (uncommitted scaffold is fine — it carries onto the branch). Then `git switch -c feat/<id>-<slug>`.
   - **`--worktree`.** You may be on any branch. `git fetch origin`, then cut the worktree from an
     up-to-date `main` into a sibling directory:
     ```sh
     git worktree add ../<repo>-worktrees/<id>-<slug> -b feat/<id>-<slug> origin/main
     ```
     Tell the user the worktree path — `frame` / `build` / `ship` for this ticket all run **inside
     it** (cwd). `ship` removes it after merge.
     > **Shared-backlog requirement.** Worktree mode assumes the backlog is shared across worktrees.
     > With **`plane`** it is (the tracker is remote) — clean. With the **`folder`** provider the
     > gitignored backlog lives only in the **main** checkout, so run tracker verbs against the main
     > dir, not the worktree, or the per-worktree backlogs diverge. Worktrees pair best with `plane`.
4. **`transition(<id>, in_progress)`** via the provider. (For `folder` that sets `"status"` in the
   ticket; for a remote tracker it moves the item to the mapped state.)
5. **Confirm back:** the branch name (and the worktree path, if any), the ticket title, and the
   acceptance criteria to satisfy. Then await direction — do not start implementing yet.

Guardrails: branch off an up-to-date `main`; one ticket → one branch (→ one worktree in `--worktree`
mode). Do not commit anything in this command. A `--worktree` is cleaned up by `ship` after the
merge. Status and persistence belong to the provider — call `read`/`transition`, don't hand-edit a backend.
