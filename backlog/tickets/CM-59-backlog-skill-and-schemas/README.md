# CM-59: Author a `backlog` skill (greenfield Step 4) + roadmap/ticket schemas

- **Epic:** Epic D — Docs Site (reference showcase) / blueprint skills
- **Type:** task
- **Status:** ⬜ todo
- **Branch:** `feat/CM-59-backlog-skill-and-schemas`

## Goal
Give greenfield **Step 4 (slice the backlog)** an engine and a contract: a `backlog` skill that scaffolds `blueprint/<version>/backlog/roadmap.json` + `tickets/<ID>.json` against JSON schemas, so the backlog is generated consistently and covered by the CM-56 conformance gate.

## Context / why
Surfaced while answering "is there a backlog skill?": there isn't. Steps 1–2 have skills (`design-thinking`, `technical-design`), each step schema-backed; **Step 4 has neither a skill nor a schema.** The blueprint backlog is currently produced freehand (EtiKets, TabSplit), and is the *only* blueprint module the CM-56 schema-conformance rung does not validate.

## Acceptance criteria (draft — refine at pull-in)
- [ ] A `backlog` skill (`.claude/skills/backlog/SKILL.md`) documenting the Step-4 method: read `specs/` + `system-design/`, slice vertically (one concern / DoR per ticket), dependency-order, promote the riskiest assumption to its own enabler ticket.
- [ ] A `roadmap.schema.json` and a `ticket.schema.json` defining the structured backlog (epics + order; ticket goal/AC/verification/deps/plan).
- [ ] `scripts/validate-blueprint.js` extended to validate `blueprint/*/backlog/roadmap.json` and `tickets/*.json` against those schemas.
- [ ] EtiKets + TabSplit backlogs validated against the new schemas (fix or document any drift).

## Open design decisions (resolve at refinement)
- **Flat JSON vs folder for blueprint tickets.** Current doctrine (greenfield.js) shows flat `tickets/<ID>.json`; the folder-per-ticket layout (README/plan/evidence) is the *build-time* representation. Decide whether the skill keeps Step-4 tickets as flat JSON (recommended — they're the sliced plan, not yet in-build) or unifies the two.
- **Ticket id prefix.** Doctrine illustration uses `CM-n.json`; examples localize per project (`ETK-`, `TS-`). Pick one and document it.

## Verification
`node scripts/validate-blueprint.js` covers the backlog; both example backlogs pass; `bash scripts/ci.sh` green.

## Notes
Pairs with CM-56 (D) — that rung enforces conformance for Steps 1–2; this ticket extends the same cage to Step 4. Deferred process findings A/B/E/F (from the TabSplit test) are separate.
