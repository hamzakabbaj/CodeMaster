# CodeMaster Implementation Roadmap

> Building a Big-Tech-grade engineering operating system on Claude Code.
> **Strategy:** Track A (standalone proving ground) → Track B (extract to plugin) → Track C (install in real repos).
> **Pilot:** CodeMaster itself. **Ceremony:** full — git, Conventional Commits, tickets, PR-style review, CI from day one.

## How to read this doc
- Each **phase = an epic**. Each **task = a ticket** (`CM-<n>`) → branch → commit(s) → self-review → green CI → close.
- Status legend: ⬜ todo · 🟦 in progress · ✅ done · ⏸️ blocked.
- This is a **living doc** — update status as we go. It is itself versioned (we dogfood doc 03).

## Status overview

| Phase | Epic | Track | Status |
|---|---|---|---|
| 0 | Delivery Infrastructure | A | ✅ |
| 1 | Capabilities Proving Ground | A | ✅ |
| 2 | Robust-Code Loop | A | 🟦 |
| 3 | Subagent Fleet | A | ⬜ |
| 4 | Orchestration | A | ⬜ |
| 5 | Package as Plugin | B | ⬜ |
| 6 | Pilot in Real Repo | C | ⬜ |

---

## Phase 0 — Delivery Infrastructure
*Dogfood [doc 03](docs/03-delivery-process.md): the process becomes both product and method.*

- [x] `CM-1` — repo already existed (`main` + GitHub remote); added `.gitignore` + branch convention in `CONTRIBUTING.md`
- [x] `CM-2` — Conventional Commits via dependency-free `.githooks/commit-msg` + `core.hooksPath` (no commitlint/Node)
- [x] `CM-3` — `backlog/` structure: epic + ticket templates, DoR/DoD
- [x] `CM-4` — Filed **Phase 1** tickets (CM-7…CM-11) just-in-time; Phases 2–5 stay as roadmap line-items until pulled
- [x] `CM-5` — `.github/workflows/ci.yml` + `scripts/ci.sh` (JSON, md-links, commit-msg) + `scripts/setup.sh`
- [x] `CM-6` — Baseline commit on `feat/CM-0-delivery-infrastructure`
- [ ] `CM-35` — Enable branch protection on main ⏸️ blocked (needs Pro/public; script ready, deferred to public/plugin stage)

**Exit:** ✅ repo conventions + hooks + CI + backlog in place; CI is *real* (live remote).

## Phase 1 — Capabilities Proving Ground
*Validate [doc 01](docs/01-claude-capabilities.md) live — build one of each primitive and run it.*

- [x] `CM-7` — `CLAUDE.md` (invariants only)
- [x] `CM-8` — Hook: PreToolUse deny-gate blocking `git commit --no-verify` (scope narrowed; live activation via `/hooks`)
- [x] `CM-9` — `librarian` subagent (read-only, scoped tools); mechanic validated via `Explore` (custom persona registers next session)
- [x] `CM-34` (fix, from CM-8) — harden `--no-verify` guard: token-aware (shlex) detection, kills false positives; 7-case pipe-test
- [x] `CM-10` — `new-ticket` skill (+ bundled `next-number.sh`); deterministic core verified live (auto-trigger pending reload)
- [x] `CM-11` — `/start-ticket <CM-n>` slash command (branch + status flip); explicit-only counterpart to the `new-ticket` skill
- [x] `CM-36` (fix, from CM-11) — `/start-ticket` arg substitution (`$ARGUMENTS`) + composable guard; verified live

**Exit:** ✅ one of each primitive built; mechanics confirmed live (and corrected doc 01: hooks/agents/skills/commands all register only at session start).

## Phase 2 — Robust-Code Loop
*Make [doc 02](docs/02-robust-code-process.md) executable.*

- [x] `CM-12` — Verification ladder: shellcheck lint rung + 4-rung fail-fast `ci.sh`/CI (typecheck/test = extension point for real repos)
- [ ] `CM-13` — `/spec` + plan-review flow
- [ ] `CM-14` — Checkpoint/rollback helper
- [ ] `CM-15` — DoD checklist template
- [ ] `CM-16` — Run the full loop on a tiny sample feature (with tests)

**Exit:** full loop demonstrated end-to-end inside CodeMaster.

## Phase 3 — Subagent Fleet
*Materialize [doc 04](docs/04-team-profiles.md).*

- [ ] `CM-17` — `architect.md` (capable model, read-heavy, design review)
- [ ] `CM-18` — `tester.md` (adversarial edge-case authoring)
- [ ] `CM-19` — `devops.md` (CI/CD, IaC, deploy reasoning)
- [ ] `CM-20` — `security.md` (threat model, secrets, authz)
- [ ] `CM-21` — `reviewer.md` (PR review vs our conventions)
- [ ] `CM-22` — Scoped tools + model routing + per-agent memory dirs

**Exit:** each role-agent validated on a real task.

## Phase 4 — Orchestration
*Materialize [doc 05](docs/05-orchestration.md).*

- [ ] `CM-23` — Review-board workflow: dev → tester → security/perf/correctness → reviewer pipeline
- [ ] `CM-24` — Adversarial-verify pattern baked in
- [ ] `CM-25` — Bounded live workflow run; observe structured output

**Exit:** orchestration demonstrated; review board runs as a pipeline.

## Phase 5 — Package as Plugin *(Track B)*

- [ ] `CM-26` — `plugin.json` / marketplace manifest
- [ ] `CM-27` — Bundle agents + hooks + skills + commands + workflows
- [ ] `CM-28` — Version + changelog
- [ ] `CM-29` — Local install test

**Exit:** CodeMaster installable as one unit.

## Phase 6 — Pilot in a Real Repo *(Track C — gated, future)*

- [ ] `CM-30` — Install into Tigris or Argon
- [ ] `CM-31` — Adapt conventions to the target repo
- [ ] `CM-32` — Ship one real feature through the CodeMaster process
- [ ] `CM-33` — Measure impact; feed learnings back to the plugin

**Exit:** real feature shipped end-to-end via CodeMaster.

---

## Decisions log
- **2026-05-29** — Endgame = Both-in-sequence (standalone → plugin → install). Pilot = CodeMaster only. Ceremony = full Big-Tech.
- **2026-05-29** — CM-35 branch protection deferred: blocked by GitHub plan (private + free → 403 on protection & rulesets). Local hooks + CI enforce meanwhile; apply the ready script when repo goes public or upgrades.
- **2026-05-29** — Phase 0: discovered repo already existed (`main` + GitHub remote `hamzakabbaj/CodeMaster`) → CI is real, not theoretical. Chose dependency-free shell hook over commitlint (docs repo, no Node). Phase 0 ships as one PR (interdependent bootstrap); finer-grained branches from Phase 1. Backlog refined just-in-time.
