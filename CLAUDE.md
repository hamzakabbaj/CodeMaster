# CLAUDE.md

> Always-loaded invariants for CodeMaster. Keep this short — it is paid every turn.
> Procedures live in skills; status lives in `ROADMAP.md`; rationale lives in `docs/`.

## What this repo is
CodeMaster builds a Big-Tech-grade engineering operating system **on top of Claude Code**.
It is a meta-project: we prove the process by dogfooding it on this repo itself.

## Where things live
- `docs/` — the doctrine (capabilities, robust-code loop, delivery, profiles, orchestration). Start at `docs/00-index.md`.
- `ROADMAP.md` — single source of truth for **what** and **status** (phases, tickets `CM-<n>`).
- `backlog/` — ticket detail + templates + DoR/DoD. Tickets refined just-in-time.
- `.githooks/`, `scripts/` — the deterministic gates (git hook, CI mirror, setup).
- `CONTRIBUTING.md` — the full git/commit/PR contract.

## Non-negotiable invariants
- **Trunk = `main`.** Never commit directly to `main`; branch `feat/CM-<n>-short-desc`.
- **Conventional Commits**, enforced by `.githooks/commit-msg`. Never use `--no-verify`.
- **Run `scripts/ci.sh` and make it green before pushing.** Local must mirror CI.
- **One ticket → one branch → PR → green CI → merge.** Update `ROADMAP.md` status on merge.
- New checkout? Run `scripts/setup.sh` once to activate hooks.

## Guiding principle
Guarantees come from the **deterministic cage** (hooks, tests, CI) around a probabilistic model —
not from the model behaving. When adding a safeguard, prefer code over instruction.

## Working agreement
- Verify mechanics by running them; don't trust remembered behavior (esp. Claude Code internals).
- Be the discriminator: review generated output for design/security/perf, not just "does it run".
