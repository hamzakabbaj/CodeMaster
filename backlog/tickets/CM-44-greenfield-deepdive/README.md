# CM-44: Greenfield deep-dive page — Step 1 (Design Thinking)

- **Epic:** D — Docs Site (reference showcase)
- **Type:** task
- **Status:** ✅ done (Step 1; Steps 2–5 to follow)
- **Branch:** `feat/CM-44-greenfield-deepdive`

## Goal
Add a greenfield deep-dive page that details the process step by step, grounded in CodeMaster's real primitives — starting with Step 1 (Design Thinking) fully fleshed out; Steps 2–5 shown as the arc to come.

## Acceptance criteria
- [ ] New page `docs/site/greenfield.html` + `docs/site/data/greenfield.js`
- [ ] Step 1 detailed: purpose/exit, the Design-vs-`/spec` boundary, the sub-flow (frame → diverge → wireframe → converge → architect review → approve), artifact layout (committed `design/` + gitignored throwaway `prototypes/`, UI-only wireframe), the design-review gate, mechanics (design rides the cage), and the new machinery it implies
- [ ] Captures the resolved principle: design altitude follows work altitude (global greenfield design vs ticket-scoped brownfield design)
- [ ] Steps 2–5 shown as the upcoming arc (flow); page links back to Playbooks; Playbooks greenfield section links to the deep dive
- [ ] Renders over `file://` with zero console errors; CI ladder green (incl. JS rung)

## Verification
chrome-devtools MCP loads `file://.../docs/site/greenfield.html` → no console errors, blocks render, back-link + cross-link resolve. `node --check` clean. Full 6-rung ladder green.

## Notes
Reuses existing block types (hero/callout/flow/section/table/steps/code/cards/divider) — no renderer changes. Not added to top nav (drill-down reached from Playbooks). Decisions baked in: always-separate `design.md`, wireframe not versioned (gitignored), wireframe UI-only.
