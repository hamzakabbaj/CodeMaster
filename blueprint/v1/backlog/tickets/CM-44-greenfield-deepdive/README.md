# CM-44: Greenfield deep-dive page — Step 1 (Design Thinking)

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** epic-d-docs-site-reference-showcase
- **Type:** task
- **Status:** ✅ done

## Goal
Add a greenfield deep-dive page that details the process step by step, grounded in CodeMaster's real primitives — starting with Step 1 (Design Thinking) fully fleshed out; Steps 2–5 shown as the arc to come.

## Acceptance criteria
- [x] New page `docs/site/greenfield.html` + `docs/site/data/greenfield.js`
- [x] Step 1 detailed: purpose/exit, the Design-vs-`/spec` boundary, the sub-flow (frame → diverge → wireframe → converge → architect review → approve), artifact layout (committed `design/` + gitignored throwaway `prototypes/`, UI-only wireframe), the design-review gate, mechanics (design rides the cage), and the new machinery it implies
- [x] Captures the resolved principle: design altitude follows work altitude (global greenfield design vs ticket-scoped brownfield design)
- [x] Steps 2–5 shown as the upcoming arc (flow); page links back to Playbooks; Playbooks greenfield section links to the deep dive
- [x] Renders over `file://` with zero console errors; CI ladder green (incl. JS rung)

## Verification
chrome-devtools MCP loads `file://.../docs/site/greenfield.html` → no console errors, blocks render, back-link + cross-link resolve. `node --check` clean. Full 6-rung ladder green.

## Notes
Reuses existing block types (hero/callout/flow/section/table/steps/code/cards/divider) — no renderer changes. Not added to top nav (drill-down reached from Playbooks). Decisions baked in: always-separate `design.md`, wireframe not versioned (gitignored), wireframe UI-only.
