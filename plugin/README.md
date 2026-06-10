# CodeMaster — the plugin

> A Big-Tech-grade engineering operating system, packaged as a Claude Code plugin.

CodeMaster turns Claude Code into a disciplined engineering team: a **spec → plan → generate → verify → critique** loop, run by a fleet of specialist subagents, behind a **deterministic cage** of hooks, tests, and CI. The guiding idea: trustworthy AI engineering comes from the *cage you build around* a probabilistic model — not from the model behaving. This plugin bundles that judgment — the commands, skills, agents, and hooks — so you can install it into any project.

This README is the front page for someone who just installed the plugin. The full doctrine lives in [`docs/`](../docs/00-index.md); the rationale and status live in the repo's backlog.

## Install

CodeMaster ships an **in-repo marketplace**, so any checkout is installable:

```bash
claude plugin marketplace add hamzakabbaj/CodeMaster   # or a local path to the repo
claude plugin install codemaster@codemaster            # user scope: available in all projects
```

Then **restart Claude Code** so the skills, agents, commands, and hooks register. The name reads `codemaster@codemaster` because it's `<plugin>@<marketplace>` — this repo is both the catalog *and* the single plugin in it.

### Updating

The install is a **cached copy**, not a live link. After editing the plugin, refresh it:

```bash
claude plugin uninstall codemaster
claude plugin install codemaster@codemaster
```

…then restart. This is the one, deliberate loading mechanism — see [docs/03 §6](../docs/03-delivery-process.md#6-release-management) for why.

## What's inside

### Commands — thin orchestration prompts (`/codemaster:<name>`)

| Command | What it does |
|---|---|
| `/spec` | Produce a spec + plan for a ticket or feature, then stop for plan-review before any code. |
| `/start-ticket` | Create a ticket's feature branch and flip its status to in progress. |
| `/design-options` | Generate 2–3 throwaway UI variants as a `file://`-openable gallery, then stop for you to pick. |
| `/ship` | PR → both gates → review → (confirm) → squash-merge → verify main. |
| `/tracker-init` | Set up where the backlog lives — scaffold `.codemaster/` for the `folder` or `plane` provider (see **Tracker** below). |

### Skills — multi-step procedures (invoked by name or auto-matched)

| Skill | What it does |
|---|---|
| `build` | Implement one Ready ticket via the robust-code loop until acceptance criteria are met and the ladder is green. |
| `backlog` | Slice an approved plan into a dependency-ordered backlog of Ready tickets. |
| `new-ticket` | Scaffold one already-shaped ticket as JSON and register it in the canonical roadmap. |
| `feature-intake` | Front door for an out-of-the-blue request — triage it to the right altitude (fix · story · stories · epic) and route it. |
| `design-thinking` | Guide the Design Thinking methodology (brief, empathy maps, personas, wireframes…). |
| `technical-design` | Guide technical architecture and system design (APIs, schema, design system). |

### Agents — specialist subagents the fleet delegates to

| Agent | Role |
|---|---|
| `architect` | Design-review: where complexity should live, whether an approach fits our conventions. |
| `tester` | Adversarial test design — edge cases, failure modes, boundary inputs. |
| `devops` | CI/CD, gates, reproducibility — the verification ladder, hooks, Actions, deploy/rollback. |
| `security` | AppSec threat-modeling — secrets, injection, authz, untrusted input, supply chain. |
| `reviewer` | PR review against our conventions and Definition of Done — approve/block verdict. |
| `librarian` | Read-only navigator/consistency-checker for the docs, ROADMAP, and backlog. |
| `code-explorer` | Read-only reconnaissance — traces execution paths and maps blast radius before a change. |

### Hooks — the always-on, deterministic guards (`hooks/hooks.json`)

| Hook | Event | Guarantee |
|---|---|---|
| `block-no-verify` | `PreToolUse` | Blocks `git commit --no-verify` (and friends) — the cage can't be bypassed. |
| `trace-subagent` | `SubagentStop` | Persists a trace when a subagent finishes, for auditability. |

## How it composes — the greenfield flow

`feature-intake` → `/spec` → `backlog` → `/start-ticket` → `build` → `/ship` (commands carry the `/`; skills are bare, matching the catalog above — though a skill is also invocable as `/build`). Each step stops at a human checkpoint; the hooks and CI enforce the invariants regardless of what the model decides.

```
   a request
      |
   feature-intake     triage to the right altitude (fix / story / stories / epic)
      |
   /spec              produce a spec + plan
      |               > plan review            (human checkpoint)
   backlog            slice the plan into Ready tickets
      |
   /start-ticket      feature branch + status -> in_progress
      |
   build              the robust-code loop:
      |                  generate -> verify -> checkpoint -> critique
      |                  (repeat until acceptance criteria met & the ladder is green)
      |
   /ship              open PR -> both CI gates -> reviewer
      |               > merge confirm           (human checkpoint)
      v
   main               squash-merged, branch deleted

   ── the deterministic cage runs underneath the whole flow ──
   git hooks (commit-msg, pre-commit) + the CI ladder enforce the
   invariants no matter what the model decides.
```

The doctrine behind each step is in [docs/02 (robust-code loop)](../docs/02-robust-code-process.md) and [docs/03 (delivery)](../docs/03-delivery-process.md).

## Using it — recipes

What to actually run, in order, for the common starting points. (Commands carry the `/`; skills are bare but also work as `/name`.)

**A brand-new feature — the full arc.** When a request might be several stories or an epic:
1. Describe the request, then run `feature-intake` — it triages the altitude and, for anything epic-sized, routes you into spec.
2. `/spec <feature-or-CM-n>` — produces the spec + plan, then **stops for your plan review**.
3. `backlog` — slices the approved plan into Ready tickets.
4. `/start-ticket <CM-n>` — branches and flips the ticket to in-progress.
5. `/build` — runs the robust-code loop until the acceptance criteria are met and the ladder is green.
6. `/ship` — opens the PR, waits for both gates + the reviewer, then **stops for your merge confirm**.
7. Repeat 4–6 for each ticket.

**A single, already-shaped ticket.** When you already know it's one well-formed unit of work:
- `new-ticket` *(only if it doesn't exist yet)* → `/start-ticket <CM-n>` → `/build` → `/ship`.

**A quick fix or chore.** The ticket exists and the change is small:
- `/start-ticket <CM-n>` → `/build` → `/ship`.

**Exploring a UI/UX decision.** Before committing to an implementation:
- `/design-options <CM-n>` — generates 2–3 throwaway variants as a `file://` gallery and **stops for you to pick** → then `/build` the chosen one.

**Upstream design, before any tickets exist.** For a greenfield product or a big feature:
- `design-thinking` → `technical-design` → `/spec` (architecture decides ticket boundaries, so it precedes slicing).

### Best-practice rules
- **Don't skip the checkpoints.** Let `/spec` stop at plan review and `/ship` stop at merge confirm — those pauses are where *you* are the discriminator, not the model.
- **One ticket = one branch = one PR.** `/start-ticket` and `/ship` assume this; the git hooks enforce it.
- **Build only after a Ready ticket exists.** `/build` expects acceptance criteria to check against — that's what "Ready" means.
- **Trust the cage, verify the output.** The hooks + CI guarantee the invariants; your job at each checkpoint is to review design, security, and correctness — not just "does it run".

## Tracker — where the backlog lives (pluggable)

The process skills never touch a backlog directly. They call five **tracker verbs**
(`mint · read · list · transition · link`); a **provider** implements them; a one-line
per-project config picks the provider. Swap where work items live without changing the loop,
the fleet, or the cage.

| Provider | Backlog lives in | Use when |
|---|---|---|
| `folder` *(default)* | repo files + a generated board (`<root>/roadmap.json` + `tickets/…`) | solo / repo-native, no external tool |
| `plane` | a [Plane](https://plane.so) project, via its REST API | the team tracks work in Plane |

**Switch it on:**

```bash
/tracker-init folder      # or: /tracker-init plane
```

`tracker-init` scaffolds `.codemaster/` in your repo — `config.json` (committed) + the chosen
provider's mechanics; for `plane` it also drops in the API wrapper and a gitignored `plane.env`
for your token. From then on `feature-intake` / `new-ticket` / `backlog` / `/start-ticket` / `/ship`
route through the active provider automatically. Full contract: [`tracker/README.md`](tracker/README.md).

> Status + work items are pluggable; **design artifacts** (`/spec` output, blueprints) stay as repo
> files either way — they version with the code and are reviewed in the PR.

## Heads-up: CodeMaster ships its own primitives

CodeMaster is a **meta-project — it's dogfooded on its own repo.** The **backlog** is now pluggable
(see **Tracker** above — `folder` or `plane`), but some skills still lean on *this* repo's
machinery — the `scripts/gen_roadmap.py` generators and the `scripts/ci.sh` verification ladder.
Installed into a **foreign project**, the install reliably delivers the **fleet, hooks, thin commands,
and the tracker**; the CI/generator scripts assume CodeMaster's own structure, so a consuming project
wires its own CI. See [docs/03 §6](../docs/03-delivery-process.md#6-release-management) for the full picture.

## Learn more

- [docs/00 — index](../docs/00-index.md) · the doctrine, start here
- [docs/01 — capabilities](../docs/01-claude-capabilities.md) · what each Claude Code primitive is for
- [CHANGELOG.md](CHANGELOG.md) · what changed, version by version

## License

MIT — see the repository root.
