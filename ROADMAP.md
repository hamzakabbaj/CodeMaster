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
| 2 | Robust-Code Loop | A | ✅ |
| 3 | Subagent Fleet | A | ✅ |
| 4 | Orchestration | A | ✅ |
| 5 | Package as Plugin | B | 🟦 |
| 6 | Pilot in Real Repo | C | ⬜ |
| D | Docs Site (reference showcase) | A | ✅ |

---

## Phase 0 — Delivery Infrastructure
*Dogfood [doc 03](docs/03-delivery-process.md): the process becomes both product and method.*

- [x] `CM-1` — repo already existed (`main` + GitHub remote); added `.gitignore` + branch convention in `CONTRIBUTING.md`
- [x] `CM-2` — Conventional Commits via dependency-free `.githooks/commit-msg` + `core.hooksPath` (no commitlint/Node)
- [x] `CM-3` — `backlog/` structure: epic + ticket templates, DoR/DoD
- [x] `CM-4` — Filed **Phase 1** tickets (CM-7…CM-11) just-in-time; Phases 2–5 stay as roadmap line-items until pulled
- [x] `CM-5` — `.github/workflows/ci.yml` + `scripts/ci.sh` (JSON, md-links, commit-msg) + `scripts/setup.sh`
- [x] `CM-6` — Baseline commit on `feat/CM-0-delivery-infrastructure`
- [x] `CM-37` (fix, from CM-12) — `commit-msg` strips squash `(#n)` suffix before length check; fixes post-merge main CI
- [ ] `CM-35` — Enable branch protection on main ⏸️ blocked (needs Pro/public; script ready, deferred to public/plugin stage)
- [x] `CM-49` — Folder-per-ticket model (ticket + plan + evidence); migrate tooling + existing tickets
- [x] `CM-50` — Propagate folder-per-ticket to examples/etikets + the site greenfield doc
- [x] `CM-62` — Migrate the backlog to JSON as the source of truth (folder-per-ticket); generate ROADMAP.md from it
- [x] `CM-63` — Generate a synced README.md next to each ticket.json (GitHub-rendered ticket views)
- [x] `CM-64` — Cite the canonical DoR in the backlog skill instead of paraphrasing it
- [x] `CM-65` — Add a feature-intake skill: triage an out-of-the-blue request to the right altitude
- [x] `CM-66` — Add the build skill + build-critique workflow (the Step-5 robust-code loop engine)
- [x] `CM-67` — Add the ship command: encode the Step-6 PR -> review -> merge ceremony
- [x] `CM-68` — Add the design-options command: pick a UI/UX variant before building it
- [x] `CM-70` — Stop tracking Python bytecode: untrack __pycache__ and gitignore *.pyc
- [x] `CM-71` — Wire code-explorer into build Plan beat as the terrain-uncertainty hatch
- [x] `CM-72` — Drop jq from block-no-verify.sh: parse hook input with python3 (close the fail-open)

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
- [x] `CM-13` — `/spec` command: spec + plan-review gate before code
- [x] `CM-14` — `scripts/checkpoint.sh`: green-gated checkpoint commit (rollback documented)
- [x] `CM-15` — DoD checklist as `.github/pull_request_template.md`
- [x] `CM-16` — `roadmap_stats.py` + unittest tests; activates the ladder's test rung; loop run end-to-end

**Exit:** ✅ full loop demonstrated end-to-end inside CodeMaster (spec → verify → critique; test rung live).

## Phase 3 — Subagent Fleet
*Materialize [doc 04](docs/04-team-profiles.md).*

- [x] `CM-17` — `architect.md` (opus, read-only, design review vs doctrine)
- [x] `CM-18` — `tester.md` (sonnet, adversarial test design)
- [x] `CM-19` — `devops.md` (sonnet, gates/CI/reproducibility)
- [x] `CM-20` — `security.md` (opus, threat model/secrets/authz)
- [x] `CM-21` — `reviewer.md` (sonnet, PR review vs conventions/DoD; read-only Bash)
- [x] `CM-22` — Scoped tools + model routing + memory **convention**; `.claude/agents/README.md`
- [x] `CM-69` — Add the code-explorer agent: read-only code reconnaissance for the fleet
- [x] `CM-73` — Persist fleet-agent output per ticket via a SubagentStop trace hook

**Exit:** ✅ fleet defined with least-privilege tools + model routing; registers on reload (mechanic proven in CM-9). Live fleet validation folds into Phase 4 orchestration.

## Phase 4 — Orchestration
*Materialize [doc 05](docs/05-orchestration.md).*

- [x] `CM-23` — `review-board.mjs`: multi-dimension review pipeline (self-contained, cost-routed, bounded)
- [x] `CM-24` — Adversarial-verify: N haiku skeptics refute each finding; survivors only
- [x] `CM-25` — Bounded live run (11 agents): 4 considered → 3 confirmed; **found a real bug** unit tests missed (→ CM-38)
- [x] `CM-38` (fix, from CM-25) — `roadmap_stats.py`: `is_file()` + `try/except OSError`; +3 CLI tests (8 total). Closes the loop the review board opened.

**Exit:** ✅ orchestration demonstrated live; review board ran as a pipeline with adversarial verification and surfaced a genuine correctness bug.

## Phase 5 — Package as Plugin *(Track B)*

- [x] `CM-26` — `plugin.json` manifest (package `.claude/` as a plugin unit; no marketplace)
- [x] `CM-27` — Bundle hooks as a plugin component (`hooks.json`) + drift guard vs `settings.json`
- [x] `CM-28` — Version + `CHANGELOG.md` + `claude plugin tag` release discipline
- [ ] `CM-29` — Local install test
- [x] `CM-74` — Spike: can CodeMaster ship as an in-repo project @skills-dir plugin?

**Exit:** CodeMaster installable as one unit.

## Phase 6 — Pilot in a Real Repo *(Track C — gated, future)*

- [ ] `CM-30` — Install into Tigris or Argon
- [ ] `CM-31` — Adapt conventions to the target repo
- [ ] `CM-32` — Ship one real feature through the CodeMaster process
- [ ] `CM-33` — Measure impact; feed learnings back to the plugin

**Exit:** real feature shipped end-to-end via CodeMaster.

## Epic D — Docs Site (reference showcase)
*Data-driven static site, `file://`-openable, modern dark product. Site JS data is its own curated source; markdowns stay the canonical spec.*

- [x] `CM-39` — Site engine: `style.css` design system, `render.js` component renderer, `data/site.js`, `file://`-safe data pattern + Overview page
- [x] `CM-40` — Content pages (capabilities, loop, delivery, fleet, roadmap); all 6 pages render `file://` with no console errors (shipped with CM-39)
- [x] `CM-41` — `node --check` JS rung (rung 2/6, site-scoped, graceful degrade) in `ci.sh` + CI
- [x] `CM-42` — "How Big Tech Engineering Works" page (team topology, roles, ceremonies, career ladder) as context/inspiration
- [x] `CM-43` — "Playbooks" page: the process applied to 7 real scenarios (greenfield, brownfield, refactor, hotfix, spike, migration, incident)
- [x] `CM-44` — Greenfield deep-dive page: Step 1 (Design Thinking) fully detailed; Steps 2–5 to follow incrementally
- [x] `CM-51` — Greenfield page: explicit input/output/location per step (artifact chain) + collapsible steps
- [x] `CM-52` — Greenfield Build: document element-level mini-wireframes (variant gallery → plan.md); surface prototypes/ in outputs
- [x] `CM-45` — Greenfield deep-dive: Steps 2–5 (/spec & plan-review, Backlog, Build loop, Ship)
- [x] `CM-46` — Reference artifact set `examples/etikets/` (design → spec → backlog, worked example)
- [x] `CM-47` — Greenfield Step 4: add "Pull & refine to Ready" substep + Build→Backlog feedback
- [x] `CM-48` — Fix loop/ladder doc fidelity: restore the Plan beat; correct stale 5→6 rung counts
- [x] `CM-53` — Greenfield: add Step 2 **System Design** (6-step arc) + the `blueprint/` structured project record
- [x] `CM-54` — Adapt `design-thinking` + `technical-design` skills: prune React layer, add `Write`, repoint output to `blueprint/`
- [x] `CM-55` — Convert `examples/etikets/` to a worked JSON `blueprint/` (real import of design-thinking + system-design)
- [x] `CM-56` — Harden blueprint skills: fix guide paths (C), align design-thinking step numbering (G), add schema-conformance CI rung (D)
- [x] `CM-57` — Require Conventional-Commit PR titles (squash subject) — git contract doc
- [x] `CM-58` — Reconcile ticket conventions: convert CM-56/57 to folder-per-ticket; clear CM-57 status
- [x] `CM-59` — Author a `backlog` skill (greenfield Step 4) + roadmap/ticket schemas (extends the CM-56 conformance gate to Step 4)
- [x] `CM-60` — Lint PR titles in CI (reuse the `commit-msg` hook) so a bad title can't redden `main` post-merge
- [x] `CM-61` — Add CodeMaster's own `blueprint/` (navigational index mapping docs/ROADMAP/backlog to the 6-step model)

**Exit:** ✅ open `docs/site/index.html` offline → polished multi-page site; renderer verified via chrome-devtools MCP; JS rung green.

---

## Decisions log
- **2026-06-08** — Backlog migrated to JSON as the source of truth (CM-62): `blueprint/v1/backlog/roadmap.json` + folder-per-ticket `tickets/CM-<n>-<slug>/ticket.json` (README.md → ticket.json; plan/evidence kept as files). `ROADMAP.md` is now **generated** by `scripts/gen_roadmap.py` (pre-commit hook + CI sync rung), and the blueprint conformance gate validates every ticket. Supersedes the 2026-06-05 decision to keep CodeMaster's own backlog in markdown — CodeMaster now fully eats its own dogfood. `new-ticket` / `/start-ticket` / `/spec` rewired to the JSON; `next-number.sh` unchanged (greps `CM-<n>`).
- **2026-06-05** — Greenfield model evolved (CM-53): the arc is now **6 steps** with **System Design** as its own step between Design Thinking and `/spec` (architecture decides ticket boundaries, so it precedes slicing — the big-tech PRD+TDD split). Upstream planning artifacts live in one versioned per-project folder, **`blueprint/`** (`design-thinking/`, `system-design/`, `specs/`, `backlog/`), kept **structured/JSON** to unlock future tooling. Two imported skills (`design-thinking`, `technical-design`) are the engines for Steps 1–2. Reconciliation: a project built *via* CodeMaster uses the JSON `blueprint/` model (to be demonstrated in `examples/etikets/`); CodeMaster's own meta-repo keeps the markdown `new-ticket` backlog for now (avoids ripping up `next-number.sh`/`roadmap_stats.py`/`new-ticket`/`/start-ticket`). Follow-ups: **Ticket B** rewire skills to write into `blueprint/`; **Ticket C** convert `examples/etikets/` to the JSON blueprint.
- **2026-06-01** — Docs site: chose data-driven client-rendered site (JS data + component renderer) over a markdown generator — user wants flexible layouts (cards) + Claude-editable content. `file://` forces classic `<script>` globals (no fetch/ESM). Site content is a separate curated source from the markdowns (accepted tradeoff). Aesthetic: modern dark product.
- **2026-05-29** — Endgame = Both-in-sequence (standalone → plugin → install). Pilot = CodeMaster only. Ceremony = full Big-Tech.
- **2026-05-29** — CM-35 branch protection deferred: blocked by GitHub plan (private + free → 403 on protection & rulesets). Local hooks + CI enforce meanwhile; apply the ready script when repo goes public or upgrades.
- **2026-05-29** — Phase 0: discovered repo already existed (`main` + GitHub remote `hamzakabbaj/CodeMaster`) → CI is real, not theoretical. Chose dependency-free shell hook over commitlint (docs repo, no Node). Phase 0 ships as one PR (interdependent bootstrap); finer-grained branches from Phase 1. Backlog refined just-in-time.
