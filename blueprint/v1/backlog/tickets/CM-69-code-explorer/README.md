# CM-69: Add the code-explorer agent: read-only code reconnaissance for the fleet

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-3-subagent-fleet
- **Type:** task
- **Status:** ✅ done

## Goal
Vendor the fleet's missing code-navigator — a read-only subagent that maps existing code (execution paths, dependencies, blast radius) before a change — closing the most-referenced gap in the playbooks (brownfield's primary primitive) and serving the understand-first step.

## Acceptance criteria
- [x] .claude/agents/code-explorer.md exists: read-only (Read, Grep, Glob), sonnet, with a job (trace execution paths, map layers, find dependencies/callers/blast radius, document patterns) and a tight output contract (map + path:line citations, no edits, no design opinions)
- [x] Its trigger is the working-memory axis, not just brownfield: use whenever the code to change isn't in context — brownfield always, AND grown greenfield where early code has fallen out of the window (your own old code becomes brownfield to your future self)
- [x] It is the code counterpart of librarian (docs) and explicitly distinct from architect (it describes what exists; architect judges the design after)
- [x] .claude/agents/README.md fleet roster gains a code-explorer row (least-privilege tools + model rationale)
- [x] docs/site/data/fleet.js gains a code-explorer card so the showcase roster matches the real fleet
- [x] scripts/ci.sh green (8 rungs)

## Verification
bash scripts/ci.sh green (JS-syntax rung covers fleet.js; markdown-links rung covers the agent + README cross-refs). The agent registers at session start (fleet caveat); first real use is on a brownfield/grown-greenfield ticket.

## Plan
Mirror librarian.md's house style (frontmatter name/description/tools/model + job + how-to-work + output contract). Read-only Read/Grep/Glob, sonnet (trace+enumerate, not open-ended judgment). Register in both rosters: the operational .claude/agents/README.md table and the showcase docs/site/data/fleet.js cards. Scope stays to introducing the agent; the playbook/greenfield prose sweep is separate.

## Notes
Identified in the docs gap-analysis: code-explorer is named as Brownfield's primary primitive (and used in Migration/Incident) but was never vendored into .claude/agents/ — only an external feature-dev:code-explorer plugin existed (same not-vendored issue as frontend-design). Key design refinement from the user: it is NOT brownfield-only. The real axis is 'is the code in working context or must it be recovered?' — a long greenfield build crosses that line, so early self-written code is effectively brownfield to the future self. librarian:docs :: code-explorer:code. Broader doc-drift sweep (greenfield playbook not naming build/ship/design-options) stays a separate ticket.
