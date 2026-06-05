# CM-53: Greenfield — add System Design (Step 2) + the `blueprint/` structured record

- **Epic:** D — Docs Site (reference showcase)
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-53-greenfield-system-design-blueprint`

## Goal
Evolve the greenfield deep-dive from a 5-step to a **6-step** arc by inserting **Step 2 — System Design** (the engineering design-doc beat, engine = `technical-design` skill), and establish the **`blueprint/`** versioned, structured project record as the home for the upstream planning artifacts.

## Acceptance criteria
- [ ] Greenfield arc shows **six** steps: Design Thinking · System Design · /spec · Backlog · Build · Ship (all "five steps" copy updated)
- [ ] A new **Step 2 — System Design** stepgroup: I/O table, sub-flow (architecture · API · DB schema · design system), the design-doc review gate, the big-tech parallel (PRD + TDD), and the altitude note (full run for epics; lighter for small work)
- [ ] The `blueprint/` layout is documented (a code block): `blueprint/v1/{design-thinking,system-design,specs,backlog}/`, versioned, structured/JSON where the skills define schemas
- [ ] The artifact-chain flow + every step's I/O table repoint upstream outputs to `blueprint/v1/…`; Steps 3–6 renumbered correctly
- [ ] A callout reconciles the two serializations: a project built via CodeMaster uses the JSON `blueprint/` model (demonstrated in `examples/etikets/`); CodeMaster's own meta-repo keeps the markdown `backlog/tickets/CM-n/` variant for now
- [ ] Both skills cited as engines: `design-thinking` (Step 1) and `technical-design` (Step 2)
- [ ] Renders over `file://` with zero console errors; full 6-rung ladder green

## Verification
chrome-devtools MCP on `greenfield.html` → no console errors; arc shows 6 nodes; Step 2 System Design expands and renders its sub-flow + blueprint layout; artifact chain points at `blueprint/v1/…`. `node --check` on greenfield.js; full `scripts/ci.sh` green.

## Notes
Decisions taken with the user this session: (1) keep design-thinking + technical-design outputs **structured/JSON**, and make the backlog structured too — to unlock future machine capabilities; (2) house all of it in one versioned per-project folder named **`blueprint/`**; (3) System Design is **its own step between 1 and 3**, not folded into `/spec`. This ticket is docs-only — it does **not** rewire the skills (Ticket B) or convert `examples/etikets/` to JSON (Ticket C); it documents the decided model. Field-level JSON schemas for specs/backlog are intentionally not invented here — they earn their shape in the worked example (Ticket C). Specs stay narrative markdown inside `blueprint/v1/specs/` (a plan is prose); the JSON-structured parts are design-thinking + system-design, whose skills already ship `schema.json`.
