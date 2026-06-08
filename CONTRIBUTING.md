# Contributing to CodeMaster

The git + delivery contract. Enforced by hooks (`.githooks/`) and CI (`.github/workflows/ci.yml`) — not by goodwill. See [docs/03-delivery-process.md](docs/03-delivery-process.md) for the full process.

## Branching

- **Trunk:** `main` — always green, always deployable. No direct pushes.
- **Feature branches:** `feat/CM-<n>-short-desc` (e.g. `feat/CM-8-determinism-hook`).
- **Other prefixes:** `fix/`, `chore/`, `docs/`, `refactor/`, `test/` + `CM-<n>` when a ticket exists.
- Short-lived: branch → PR → merge → delete. Rebase on `main` before opening the PR.

## Commits — Conventional Commits

Format (enforced by `.githooks/commit-msg`):

```
<type>(<optional-scope>): <subject>
```

- **Types:** `feat` `fix` `chore` `docs` `refactor` `test` `perf` `build` `ci` `revert`
- Subject ≤ 72 chars, imperative mood, no trailing period.
- Reference the ticket in body or subject when one exists (e.g. `CM-8`).

Examples:
```
feat(hooks): add PreToolUse deny-gate for protected paths
docs: expand orchestration patterns in doc 05
chore(ci): add markdown link checker
```

## Pull requests

- One PR per ticket (Phase 1+). Interdependent bootstrap may batch an epic.
- PR must: link the ticket, describe what/why, show test/CI evidence, state rollback.
- **The PR title must itself be a valid Conventional Commit** — `<type>(<scope>): <subject>`, **subject ≤ 72 chars** (the ` (#N)` GitHub appends doesn't count). Squash-merge uses the PR title as the `main` commit subject, so a bad title (wrong type *or* too long) turns `main` red *after* merge even when the PR's own CI was green. Enforced before merge by the **`PR title`** check (`.github/workflows/pr-title.yml`), which runs the same `commit-msg` hook on the title.
- **Green CI required** before merge. Automated review first, human review second.
- Squash-merge to keep `main` history linear and readable.

## Definition of Ready / Done

See [backlog/README.md](backlog/README.md).

## Local checks

Run the same gates CI runs, before you push:

```sh
scripts/ci.sh
```

The lint rung uses **shellcheck**. Install it to fully mirror CI (`brew install shellcheck`); without it, `ci.sh` falls back to a `sh -n` syntax check and warns.
