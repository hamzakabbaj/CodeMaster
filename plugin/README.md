# CodeMaster — the plugin

> A Big-Tech-grade engineering operating system, packaged as a Claude Code plugin.

CodeMaster turns Claude Code into a disciplined engineering team: a top-down pipeline — **design → roadmap → spec → backlog → frame → build → ship** — whose engine is a **generate → verify → checkpoint → critique** loop, run by a fleet of specialist subagents behind a **deterministic cage** of hooks, tests, and CI. The guiding idea: trustworthy AI engineering comes from the *cage you build around* a probabilistic model — not from the model behaving. This plugin bundles that judgment — the commands, skills, agents, and hooks — so you can install it into any project.

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
| `/spec` | Write the half-page brief for one **feature** that carries a riskiest assumption — sharpen the unknown, sketch the approach — then stop for review before slicing. Features without an unknown skip it. |
| `/start-ticket` | Create a ticket's feature branch and flip its status to in progress. `--worktree` cuts an isolated git worktree, so independent tickets build in parallel (pairs with `plane`; `ship` cleans it up). |
| `/design-options` | Generate 2–3 throwaway UI variants as a `file://`-openable gallery, then stop for you to pick. The decision lands in the ticket's `design-options` doc slot; the gallery is thrown away. |
| `/ship` | PR → both gates → review → (confirm) → squash-merge → verify main. |
| `/codemaster-init` | **Run this first in a new repo.** Set up where the backlog lives — scaffold `.codemaster/` for the `folder` or `plane` provider; with no flags (or `--check`) it's a **doctor** that diagnoses and repairs an existing setup (see **Tracker** below). `/tracker-init` is an alias. |

### Skills — multi-step procedures (invoked by name or auto-matched)

| Skill | What it does |
|---|---|
| `design-thinking` | Guide the Design Thinking methodology (brief, empathy maps, personas, wireframes…). |
| `technical-design` | Guide technical architecture and system design (APIs, schema, design system). |
| `roadmap` | The structure above tickets: split a designed product into **epics** (each with its product-level bet), or — run on one epic, when you start it — split that epic into **features** of 2–5 stories. |
| `backlog` | Slice one **feature** into its 2–5 Ready tickets, promoting the feature's riskiest assumption (if any) to an enabler that's built first. |
| `frame` | Set one ticket up to build — DoR gate → ground the code → plan if gnarly → design the acceptance tests — then stop at the done-contract. |
| `build` | Run the robust-code loop on a framed ticket — generate (test-first) → verify → checkpoint → critique — until the acceptance tests pass and `verify` is green. |
| `new-ticket` | Scaffold one already-shaped ticket via the tracker — optionally under a feature or an epic. |
| `intake` | Front door for an out-of-the-blue request — triage it to the right level (ticket · feature · epic), suggest a parent, mint it, and name the next step. With Plane, can pull from its **Intake** queue. |

### Agents — specialist subagents the fleet delegates to

| Agent | Role |
|---|---|
| `architect` | Design-review: where complexity should live, whether an approach fits our conventions. |
| `test-designer` | Adversarial test design — acceptance tests (in `frame`) + edge cases (in `build`'s critique). |
| `devops` | CI/CD, gates, reproducibility — the `verify` command, hooks, CI, deploy/rollback. |
| `security` | AppSec threat-modeling — secrets, injection, authz, untrusted input, supply chain. |
| `reviewer` | PR review against our conventions and Definition of Done — approve/block verdict. |
| `librarian` | Read-only navigator/consistency-checker for the docs, ROADMAP, and backlog. |
| `code-explorer` | Read-only reconnaissance — traces execution paths and maps blast radius before a change. |

### Hooks — the always-on, deterministic guards (`hooks/hooks.json`)

| Hook | Event | Guarantee |
|---|---|---|
| `block-no-verify` | `PreToolUse` | Blocks `git commit --no-verify` (and friends) — the cage can't be bypassed. |

## How work is organized — epic → feature → ticket

| Level | What it is | Size | Gets a spec? |
|---|---|---|---|
| **Epic** | a product area or big outcome | months | no — just a goal, a product-level bet, and its features |
| **Feature** | one shippable capability | **2–5 stories** | **only if it has an unknown** (its riskiest assumption) |
| **Ticket** — `story` · `task` · `spike` · `fix` | one branch, one PR | hours–days | no — `frame` gives it a plan and acceptance tests |

Parents are **optional** and always point up: a ticket can sit under a feature, directly under an
epic, or stand alone (a stray bug is just a `fix`). Full rules:
[`tracker/README.md`](tracker/README.md#the-hierarchy--epic--feature--ticket).

## How it composes — the flow

```
   greenfield — a new product:

      design-thinking → technical-design   upstream design
            |
      roadmap              product -> epics (each with its product-level bet)
            |
      roadmap <epic>       when you start an epic: epic -> features of 2-5 stories
            |
      /spec <feature>      only if the feature has an unknown: a half-page brief
            |              > spec review                (human checkpoint)
      backlog <feature>    slice into 2-5 Ready tickets (enabler first)
            |
      /start-ticket        feature branch + status -> in_progress
            |
      frame                DoR -> ground -> plan -> acceptance tests
            |              > done-contract review       (human checkpoint)
      build                generate (test-first) -> verify -> checkpoint -> critique
            |                (repeat until the acceptance tests pass & verify is green)
            |
      /ship                verify -> PR -> checks -> reviewer
            |              > merge confirm              (human checkpoint)
            v
      main                 squash-merged, branch deleted

   out-of-the-blue request -> intake (size picks the level; an unknown picks a spec):
      epic-sized       -> mint an epic      -> roadmap <epic>
      2-5 stories      -> mint a feature    -> /spec (if unknown) -> backlog
      one story / fix  -> mint a ticket     -> /start-ticket -> frame -> build -> /ship

   ── the deterministic cage runs underneath the whole flow ──
   your `verify` command + your repo's git hooks and CI (+ the plugin's
   no-bypass hook) enforce the invariants no matter what the model decides.
```

The doctrine behind each step is in [docs/02 (robust-code loop)](../docs/02-robust-code-process.md) and [docs/03 (delivery)](../docs/03-delivery-process.md).

## Using it — recipes

What to actually run, in order, for the common starting points. (Commands carry the `/`; skills are bare but also work as `/name`.)

**Once per repo, before anything else:** `/codemaster-init` — picks where the backlog lives and
records your `verify` command. Nothing below works until it has run; the skills stop and point you
back here rather than guessing a default.

**A new feature (2–5 stories).**
1. Describe the request and run `intake` — it mints a **feature**, suggests which epic it belongs to, and names the next step.
2. `/spec <feature-id>` — **only if the feature has an unknown**: a half-page brief, then **stops for your review**.
3. `backlog <feature-id>` — slices it into 2–5 Ready tickets.
4. `/start-ticket <id>` — branches and flips the ticket to in-progress.
5. `frame <id>` — grounds, plans, and designs the acceptance tests, then **stops at the done-contract**.
6. `/build` — runs the robust-code loop until the acceptance tests pass and `verify` is green.
7. `/ship` — opens the PR, waits for the checks + the reviewer, then **stops for your merge confirm**.
8. Repeat 4–7 for each ticket.

**A single ticket, a bug, or a chore.**
- `intake` (or `new-ticket` if you already know its shape) → `/start-ticket <id>` → `frame <id>` *(lightweight — the contract is small)* → `/build` → `/ship`.

**Exploring a UI/UX decision.** This happens *inside* `frame`'s plan step, not as a separate stage:
- when a ticket hinges on an open UI choice, `frame` runs `/design-options <id>` — 2–3 throwaway variants as a `file://` gallery — **stops for you to pick**, records the choice in the ticket's `design-options` doc, and `build` reads it back and implements that variant for real.

**A new product.**
- `design-thinking` → `technical-design` → `roadmap` (epics) → then, per epic when you start it, `roadmap <epic-id>` (features) → per feature, the steps above.

### Best-practice rules
- **Don't skip the checkpoints.** Let `/spec` stop at review, `frame` stop at the done-contract, and `/ship` stop at merge confirm — those pauses are where *you* are the discriminator, not the model.
- **One ticket = one branch = one PR.** `/start-ticket` and `/ship` assume this.
- **Frame before build.** `build` refuses without `frame`'s done-contract — the acceptance tests that *define* done. Frame is where "done" gets made executable and reviewed; build just drives the code to it.
- **Trust the cage, verify the output.** `verify`, the hooks, and your CI guarantee the invariants; your job at each checkpoint is to review design, security, and correctness — not just "does it run".

## Tracker — where the backlog lives (pluggable)

The process skills never touch a backlog directly. They call seven **tracker verbs**
(`mint · read · list · transition · link · attach_doc · read_doc`); a **provider** implements them; a one-line
per-project config picks the provider. Swap where work items live without changing the loop,
the fleet, or the cage.

| Provider | Backlog lives in | Use when |
|---|---|---|
| `folder` *(default)* | a **gitignored** local backlog (`<root>/items/<id>-<slug>/` — one flat folder per item) | solo / repo-native, no external tool |
| `plane` | a [Plane](https://plane.so) project, via its REST API | the team tracks work in Plane |

**Switch it on — this is the first thing you run in a new repo:**

```bash
/codemaster-init --tracker=folder --id-prefix=ETK     # or: --tracker=plane --workspace=acme --project=<uuid>
/codemaster-init                                      # no flags → doctor: report state, then ask
/codemaster-init --check                              # diagnose only, write nothing (CI-friendly)
```

It scaffolds `.codemaster/` in your repo — `config.json` (committed) + the chosen provider's
mechanics; for `plane` it also drops in the API wrapper and a gitignored `plane.env` for your token,
and **verifies the setup for real** (credentials resolve; every `statusMap` value names a state group
that actually exists in your instance). Re-running with the same provider is an idempotent refresh
after a plugin update; switching providers over a non-empty backlog orphans its items and so needs
`--force`. `/tracker-init` is kept as an alias.

**There is no silent default.** A repo without `.codemaster/config.json` is unconfigured — `intake` /
`roadmap` / `new-ticket` / `backlog` / `/spec` / `/start-ticket` / `/ship` stop and send you here
rather than guessing. Once configured they all route through the active provider automatically.
Full contract: [`tracker/README.md`](tracker/README.md).

> The tracker owns the **whole backlog** — work-items, status, **and** the six markdown doc slots
> (`spec` · `design-options` · `plan` · `architecture` · `acceptance-tests` · `evidence`), via the
> `attach_doc`/`read_doc` verbs. The git repo
> holds only the **product** (code + tests); the backlog and its docs are **never committed** —
> Plane cards for teams, a gitignored local backlog for solo. The lone bridge: `build` reads the
> `acceptance-tests` doc and transcribes it into executable tests, which *are* committed.

## What your repo provides

CodeMaster brings the process; your repo brings its own proof. The plugin ships no test runner and
no CI — `build` and `ship` run **your** checks, via the `verify` command `/codemaster-init` records
in `.codemaster/config.json` (e.g. `npm test && npm run lint`). If your repo has commit hooks or CI,
they stay in charge: the plugin's `block-no-verify` hook stops the agent from skipping them, and
`/ship` waits for your PR checks before it asks to merge.

## Learn more

- [docs/00 — index](../docs/00-index.md) · the doctrine, start here
- [docs/01 — capabilities](../docs/01-claude-capabilities.md) · what each Claude Code primitive is for
- [CHANGELOG.md](CHANGELOG.md) · what changed, version by version

## License

MIT — see the repository root.
