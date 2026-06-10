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

`feature-intake` → `/spec` → `backlog` → `/start-ticket` → `/build` → `/ship`. Each step stops at a human checkpoint; the hooks and CI enforce the invariants regardless of what the model decides. The doctrine behind each is in [docs/02 (robust-code loop)](../docs/02-robust-code-process.md) and [docs/03 (delivery)](../docs/03-delivery-process.md).

## Heads-up: CodeMaster ships its own primitives

CodeMaster is a **meta-project — it's dogfooded on its own repo.** Several backlog/generation skills (`new-ticket`, `backlog`, `build`) drive *this* repo's machinery — its JSON backlog under `blueprint/`, the `scripts/gen_roadmap.py` generators, the `scripts/ci.sh` verification ladder. Installed into a **foreign project**, the install reliably delivers the **agents, hooks, and thin commands**; the repo-specific backlog skills assume CodeMaster's own structure and won't be turnkey there. See [docs/03 §6](../docs/03-delivery-process.md#6-release-management) for the full picture. Treat a cross-project install as "borrow the fleet and the cage," not "drop in the whole backlog system."

## Learn more

- [docs/00 — index](../docs/00-index.md) · the doctrine, start here
- [docs/01 — capabilities](../docs/01-claude-capabilities.md) · what each Claude Code primitive is for
- [CHANGELOG.md](CHANGELOG.md) · what changed, version by version

## License

MIT — see the repository root.
