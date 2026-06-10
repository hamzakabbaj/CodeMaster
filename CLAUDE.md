# CLAUDE.md

> Always-loaded invariants for CodeMaster. Keep this short — it is paid every turn.
> Procedures live in skills; status lives in the JSON backlog (`blueprint/v1/backlog/`); rationale lives in `docs/`.

## What this repo is
CodeMaster builds a Big-Tech-grade engineering operating system **on top of Claude Code**.
It is a meta-project: we prove the process by dogfooding it on this repo itself.

## Where things live
- `docs/` — the doctrine (capabilities, robust-code loop, delivery, profiles, orchestration). Start at `docs/00-index.md`.
- `blueprint/v1/backlog/` — **single source of truth** for **what** + **status**: `roadmap.json` (epics, order, prose) + `tickets/CM-<n>-<slug>/ticket.json` (per-ticket body). `ROADMAP.md` is **generated** from it (`scripts/gen_roadmap.py`) — never hand-edit it.
- `backlog/` — process doctrine + templates + DoR/DoD (ticket detail now lives in `blueprint/v1/backlog/`).
- `.githooks/`, `scripts/` — the deterministic gates (git hook, CI mirror, setup).
- `CONTRIBUTING.md` — the full git/commit/PR contract.

## Non-negotiable invariants
- **Trunk = `main`.** Never commit directly to `main`; branch `feat/CM-<n>-short-desc`.
- **Conventional Commits**, enforced by `.githooks/commit-msg`. Never use `--no-verify`.
- **Run `scripts/ci.sh` and make it green before pushing.** Local must mirror CI.
- **One ticket → one branch → PR → green CI → merge.** Update ticket `status` in `blueprint/v1/backlog/` on merge (`ROADMAP.md` regenerates via the pre-commit hook).
- New checkout? Run `scripts/setup.sh` once — it activates the git hooks **and** installs the codemaster plugin (skills/agents/commands/hooks) from the in-repo marketplace.

## Guiding principle
Guarantees come from the **deterministic cage** (hooks, tests, CI) around a probabilistic model —
not from the model behaving. When adding a safeguard, prefer code over instruction.

## Working agreement
- Verify mechanics by running them; don't trust remembered behavior (esp. Claude Code internals).
- Be the discriminator: review generated output for design/security/perf, not just "does it run".
