---
description: Ship a finished CodeMaster ticket — PR → both gates → review → (confirm) → squash-merge → verify main. Runs after build; the only outward-facing, irreversible step.
argument-hint: <CM-number>  (e.g. /ship 67) — defaults to the current branch's ticket
---

You are shipping ticket **$ARGUMENTS** through the Step-6 ceremony. `build` got the branch to green; you get it reviewed and merged behind the enforced gates. **The merge is the only irreversible step — you stop for explicit confirmation before it.** Backlog status lives in the active **tracker** — resolve it from `.codemaster/config.json` (default `folder`; mechanics in `.codemaster/provider.md` or `plugin/tracker/providers/<tracker>.md`; contract `plugin/tracker/README.md`).

Do exactly this:

1. **Resolve the ticket.** If `$ARGUMENTS` is empty, infer the ticket **id** from the current branch name (`feat/<id>-<slug>`); if you still can't, ask and stop.
2. **Assert preconditions.** Run `git status` and `git rev-parse --abbrev-ref HEAD`. You must be on `feat/<id>-<slug>` (**NOT `main`**) — if not, surface it and stop. The feature work should already be committed by `build`; the only expected pending change is the status→done transition in step 4. Surface anything else before continuing.
3. **Confirm the work is done.** `read` the ticket via the active provider; confirm its acceptance criteria are met (and demonstrated). If they aren't, stop and send it back to `build` — `ship` does not write feature code.
4. **Final gate, then close the ticket.** Run `sh scripts/ci.sh` **first** — build's output is what you're shipping, so verify it's green before you touch anything. Only then **`transition(<id>, done)`** via the provider:
   - **`folder`** — the status flip is a *repo* change, so it must ride **in** the PR: the provider flips `"status": "done"` and regenerates the board; make the green checkpoint `scripts/checkpoint.sh "chore(backlog): mark <id> done"` (re-runs the ladder, **refuses on red**), then `git push -u origin feat/<id>-<slug>`. The flip lands atomically with the squash — never a separate direct-to-`main` commit.
   - **remote (e.g. Plane)** — status lives in the backend, not the repo, so just `git push -u origin feat/<id>-<slug>` now and fire `transition(<id>, done)` **at merge** (step 11).
5. **Build and VALIDATE the PR title (deterministic guard).** Compose a Conventional-Commit title: `type(scope): subject (<id>)`. **The PR title becomes the squash-merge commit subject on `main`**, so it must pass the same gate. Validate it before opening the PR:
   ```sh
   printf '%s\n' "<your title>" > /tmp/ship_title && .githooks/commit-msg /tmp/ship_title
   ```
   If it's rejected (subject >72 chars after the ` (#n)` strip, or wrong format), **shorten and re-validate** until it passes. Do not skip this — a bad squash subject turns `main` red *after* merge (this has happened twice; the `PR title` Action is the CI backstop, this step is the local one).
6. **Open the PR.** `gh pr create --base main --head feat/<id>-<slug>` with the validated title and a body following `.github/pull_request_template.md` (**What · Why · Test evidence · Risk/rollback · Definition of Done**, referencing the ticket `<id>`). End the body with the PR trailer: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
7. **Wait for both required gates.** `gh pr checks <pr> --watch` until both `PR title is a Conventional Commit` and `Quality gates` report. If **either fails**, stop, surface the failing logs, and fix — **never merge on a red gate.**
8. **Automated review (review second is human).** Run the automated review on the branch diff — the `reviewer` agent for a normal diff, or the `review-board` workflow for a larger/riskier change. Surface findings: **act on `high`/`critical` now** (loop back to `build` if code must change), note `low`/`nit`. This complements `build`'s in-loop `build-critique`; it is the conventions + Definition-of-Done pass.
9. **STOP for confirmation.** Present: the PR link, both gates green, and the review summary. **Ask the user for explicit go before merging** — the squash-merge changes `main` and deletes the branch, and it's the one step you can't cheaply undo.
10. **Merge.** On confirmation: `gh pr merge <pr> --squash --delete-branch`.
11. **Sync, close, verify.** `git checkout main && git pull`. Then `link(<id>, {pr})` to attach the PR to the item, and — for a **remote** tracker — fire `transition(<id>, done)` now (the `folder` provider already closed it in-PR). Finally **verify the post-merge `main` CI is green** (`gh run list --branch main --limit 1`) — a standing step after every merge, because the squash subject and merge skew are only exercised on `main`. If it's red, surface it immediately.
12. **Report.** The merged commit SHA, the ticket now `done` in the tracker, and `main` green.

Guardrails:
- **Never merge on red CI or a failing gate**, and **never `--no-verify`** (a PreToolUse hook blocks it).
- **The PR title is the squash subject** — validate it through `.githooks/commit-msg` (step 5) before opening the PR. One definition of "valid," reused.
- **Confirm before the squash-merge** — it's outward-facing and hard to reverse. Branch protection is staged (CM-35); until it lands, this command + the discipline are the enforcement.
- One ticket → one PR. `ship` does **not** write feature code (that's `build`) and assumes the branch is already green.
- Optional: for a ticket that warrants proof-of-done, record pointers (green CI run / PR / tests) via `attach_doc(<id>, "evidence", …)` — link the cage, don't duplicate it; no committed binaries.
