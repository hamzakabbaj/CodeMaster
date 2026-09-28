---
description: Ship a finished CodeMaster ticket — PR → checks → review → (confirm) → squash-merge → verify main. Runs after build; the only outward-facing, irreversible step.
argument-hint: <ticket id>  (e.g. /ship 67 · /ship PROJ-123) — defaults to the current branch's ticket
---

You are shipping ticket **$ARGUMENTS**. `build` got the branch to green; you get it reviewed and merged behind the project's gates. **The merge is the only irreversible step — you stop for explicit confirmation before it.** Backlog status lives in the active **tracker** — resolve it from `.codemaster/config.json` (**absent → stop and send the user to `/tracker-init`**; there is no silent default. Mechanics in `.codemaster/provider.md` or `plugin/tracker/providers/<tracker>.md`; contract `plugin/tracker/README.md`).

Do exactly this:

1. **Resolve the ticket.** If `$ARGUMENTS` is empty, infer the ticket **id** from the current branch name (`feat/<id>-<slug>`); if you still can't, ask and stop.
2. **Assert preconditions.** Run `git status` and `git rev-parse --abbrev-ref HEAD`. You must be on `feat/<id>-<slug>` (**NOT `main`**) — if not, surface it and stop. The feature work should already be committed by `build`; surface any pending change before continuing.
3. **Confirm the work is done.** `read` the ticket via the active provider; confirm its acceptance criteria are met (and demonstrated in the `evidence` doc). If they aren't, stop and send it back to `build` — `ship` does not write feature code.
4. **Final gate, then push.** Run the configured **`verify`** command (`jq -r '.verify // empty' .codemaster/config.json`; empty → stop, `/tracker-init`) **first** — build's output is what you're shipping, so prove it's green before anything leaves the machine. Red → stop, back to `build`. Green → `git push -u origin feat/<id>-<slug>`. The ticket's status is **not** flipped yet: every provider keeps status outside the repo, so `transition(<id>, done)` fires at merge (step 11).
5. **Compose and validate the PR title.** **The PR title becomes the squash-merge commit subject on `main`**, so validate it before opening the PR. If the repo has its own commit-message check (a `commit-msg` hook, commitlint), run the title through **that**. Otherwise hold it to Conventional Commits — `type(scope): subject (<id>)`, ≤ 72 chars:
   ```sh
   T="<your title>"
   printf '%s' "$T" | grep -Eq '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9._/-]+\))?!?: .+' \
     && [ ${#T} -le 72 ] && echo ok || echo "rejected"
   ```
   Rejected → **shorten and re-validate** until it passes. A bad squash subject only fails *after* merge, on `main`.
6. **Open the PR.** `gh pr create --base main --head feat/<id>-<slug>` with the validated title. For the body, use the repo's PR template if it has one (`.github/pull_request_template.md` or similar); otherwise write **What · Why · Test evidence · Risk/rollback · Definition of Done** ([`definitions.md`](../definitions.md)), referencing the ticket `<id>`. End the body with the PR trailer: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
7. **Wait for the PR's checks.** `gh pr checks <pr> --watch` until every check reports. If **any required check fails**, stop, surface the failing logs, and fix — **never merge on a red check.** If the repo has **no CI at all**, say so plainly: step 4's `verify` run is then the only gate.
8. **Automated review (review second is human).** Send the `reviewer` agent at the branch diff; for a larger/riskier change, also send `security` (and `architect` if boundaries moved) **in parallel**. Confirm each `high`/`critical` finding against the code, then **act on it now** (loop back to `build` if code must change); note `low`/`nit`. This complements `build`'s in-loop critique (read its trail in the `evidence` doc); it is the conventions + Definition-of-Done pass.
9. **STOP for confirmation.** Present: the PR link, the checks, and the review summary. **Ask the user for explicit go before merging** — the squash-merge changes `main` and deletes the branch, and it's the one step you can't cheaply undo.
10. **Merge.** On confirmation: `gh pr merge <pr> --squash --delete-branch`.
11. **Sync, close, verify.** Return to `main` and pull:
    - **Normal checkout:** `git checkout main && git pull`.
    - **Worktree (you're shipping from a `--worktree`):** you can't `checkout main` here — it's checked out in the main worktree. Instead `cd` to the main checkout, `git checkout main && git pull`, then **remove the spent worktree**: `git worktree remove ../<repo>-worktrees/<id>-<slug>` (`--force` only if it complains about the now-merged branch). Detect the case with `git rev-parse --git-common-dir` ≠ `--git-dir`.

    Then `link(<id>, {pr})` to attach the PR to the item and fire **`transition(<id>, done)`**. If the repo has CI on `main`, **verify the post-merge run is green** (`gh run list --branch main --limit 1`) — the squash subject and merge skew are only exercised there. If it's red, surface it immediately.
12. **Report.** The merged commit SHA, the ticket now `done` in the tracker, and `main`'s state.

Guardrails:
- **Never merge on a red check or a red `verify`**, and **never `--no-verify`** (a PreToolUse hook blocks it).
- **The PR title is the squash subject** — validate it (step 5) before opening the PR.
- **Confirm before the squash-merge** — it's outward-facing and hard to reverse. Where the repo has no branch protection, this command + the discipline are the enforcement.
- One ticket → one PR. `ship` does **not** write feature code (that's `build`) and assumes the branch is already green.
- Complete the ticket's `evidence` doc via `attach_doc(<id>, "evidence", …)` with the merged PR and the green run — link the proof, don't duplicate it; no committed binaries.
