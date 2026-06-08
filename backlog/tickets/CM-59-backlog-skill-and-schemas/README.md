# CM-59: Author a `backlog` skill (greenfield Step 4) + roadmap/ticket schemas

- **Epic:** Epic D — Docs Site (reference showcase) / blueprint skills
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-59-backlog-skill-and-schemas`

## Goal
Give greenfield **Step 4 (slice the backlog)** an engine and a contract: a `backlog` skill that scaffolds `blueprint/<version>/backlog/roadmap.json` + `tickets/<ID>.json` against JSON schemas, so the backlog is generated consistently and covered by the CM-56 conformance gate.

## Context / why
Surfaced while answering "is there a backlog skill?": there isn't. Steps 1–2 have skills (`design-thinking`, `technical-design`), each step schema-backed; **Step 4 has neither a skill nor a schema.** The blueprint backlog is currently produced freehand (EtiKets, TabSplit), and is the *only* blueprint module the CM-56 schema-conformance rung does not validate.

## Acceptance criteria (draft — refine at pull-in)
- [x] A `backlog` skill (`.claude/skills/backlog/SKILL.md`) documenting the Step-4 method: read `specs/` + `system-design/`, slice vertically (one concern / DoR per ticket), dependency-order, promote the riskiest assumption to its own enabler ticket.
- [x] A `roadmap.schema.json` and a `ticket.schema.json` defining the structured backlog (epics + order; ticket goal/AC/verification/deps/plan).
- [x] `scripts/validate-blueprint.js` extended to validate `blueprint/*/backlog/roadmap.json` and `tickets/*.json` against those schemas.
- [x] EtiKets + TabSplit backlogs validated against the new schemas (fix or document any drift).

## Design decisions (resolved)
- **Flat JSON, kept.** Step-4 tickets stay flat `tickets/<ID>.json` — they are the *sliced plan*; the folder-per-ticket layout (README/plan/evidence) is the *build-time* representation a ticket takes once pulled into work. Documented in `SKILL.md`.
- **Project-localized id prefix.** Ids are `<PREFIX>-<n>` with a short uppercase project tag (`ETK`, `TS`), **not** `CM-` (reserved for CodeMaster's own meta-repo). `greenfield.js`'s `CM-n.json` is illustrative only.
- **`goal`-or-`story` enforced via `anyOf`.** The validator gained minimal `anyOf` support so the ticket schema can require a task's `goal` or a story's `story` without forcing one shape. `decision_to_record` left free-form (EtiKets stores it as an object).

## Verification
`node scripts/validate-blueprint.js` covers the backlog; both example backlogs pass; `bash scripts/ci.sh` green.

## Notes
Pairs with CM-56 (D) — that rung enforces conformance for Steps 1–2; this ticket extends the same cage to Step 4. Deferred process findings A/B/E/F (from the TabSplit test) are separate.
