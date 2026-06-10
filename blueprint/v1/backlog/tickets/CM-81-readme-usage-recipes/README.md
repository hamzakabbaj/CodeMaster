# CM-81: Add a usage-recipes section to plugin/README.md

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-5-package-as-plugin-track-b
- **Type:** task
- **Status:** ✅ done

## Goal
Give the README a practical 'what to run, in order' runbook — concrete command sequences for the common starting points (full greenfield feature, a single already-shaped ticket, a quick fix, exploring a UI decision, upstream design) — so an installer knows exactly which skill/command to invoke first, next, and so on, rather than inferring it from the abstract flow diagram.

## Acceptance criteria
- [x] plugin/README.md gains a 'Using it — recipes' section with named scenarios, each a short ordered list of the exact commands/skills to run (e.g. `feature-intake` → `/spec` → `backlog` → `/start-ticket` → `/build` → `/ship`).
- [x] Covers at least: full greenfield feature, a single shaped ticket, a quick fix/chore, exploring a UI/UX decision (`/design-options`), and upstream design (`design-thinking` → `technical-design` → `/spec`).
- [x] Includes a few best-practice rules (let `/spec` stop at plan review; one ticket = one branch = one PR; let `/ship` stop at merge confirm; you are the discriminator at each checkpoint).
- [x] Command-vs-skill notation matches the rest of the README (commands carry `/`, skills bare); only the names that actually exist are used (cross-checked against the catalog).
- [x] scripts/ci.sh green (9 rungs); markdown links resolve. Reopen + re-close the phase-5 epic to done in this same PR.

## Verification
Render-read README on the branch; cross-check every command/skill name against plugin/commands/ and plugin/skills/; bash scripts/ci.sh green; scripts/check_links.py green.

## Plan
1) Reopen phase-5 epic. 2) Add 'Using it — recipes' section after 'How it composes' in plugin/README.md (scenarios + best-practice rules). 3) check_links + ci green. 4) Re-close phase-5 epic in the same PR. 5) ship + refresh the installed plugin.

## Notes
User request: add best-practice 'run /this then /this' usage guidance to the README. Complements CM-80's diagram (abstract flow) with action-oriented recipes. Single-ticket reopen/re-close of phase-5 (plugin README artifact), same pattern as CM-80.
