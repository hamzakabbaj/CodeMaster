# CLAUDE.md

> Always-loaded notes for this repo. Keep it short — it is paid every turn.

## What this repo is
CodeMaster is a Big-Tech-grade engineering operating system **on top of Claude Code**, packaged as the `codemaster` plugin (`plugin/`).
It used to be dogfooded here through a strict ticket/PR process; **that's retired.** We now **move fast directly on this repo** and validate the plugin in a separate context.

## How we work now (fast mode)
- **Commit directly to `main`.** No ticket-per-change, no feature branch, no PR, no reviewer agent, no backlog-status bookkeeping — unless I explicitly ask for one.
- **Git hooks are off** (no `core.hooksPath`); commits aren't gated. Conventional Commits are nice-to-have, not enforced.
- **The `blueprint/` JSON backlog + `ROADMAP.md` are no longer the source of truth we maintain.** Don't scaffold tickets or regenerate the board for routine work; touch them only on request.
- Push when it makes sense; just say so.

## Where things live
- `plugin/` — the `codemaster` plugin (skills, agents, commands, hooks, README, CHANGELOG). This is the product.
- `docs/` — the doctrine (capabilities, robust-code loop, delivery, profiles, orchestration). Start at `docs/00-index.md`.
- `scripts/` — generators + the `ci.sh` ladder (still runnable when wanted; not auto-enforced).
- `blueprint/`, `backlog/`, `CONTRIBUTING.md` — historical process artifacts; reference, not obligation.

## Working agreement
- Verify mechanics by running them; don't trust remembered behavior (esp. Claude Code internals).
- Be the discriminator: review output for design/security/perf, not just "does it run".
