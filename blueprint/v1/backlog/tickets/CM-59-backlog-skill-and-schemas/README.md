# CM-59: Author a `backlog` skill (greenfield Step 4) + roadmap/ticket schemas

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** epic-d-docs-site-reference-showcase
- **Type:** task
- **Status:** ✅ done

## Goal
Give greenfield **Step 4 (slice the backlog)** an engine and a contract: a `backlog` skill that scaffolds `blueprint/<version>/backlog/roadmap.json` + `tickets/<ID>.json` against JSON schemas, so the backlog is generated consistently and covered by the CM-56 conformance gate.

## Verification
`node scripts/validate-blueprint.js` covers the backlog; both example backlogs pass; `bash scripts/ci.sh` green.

## Notes
Pairs with CM-56 (D) — that rung enforces conformance for Steps 1–2; this ticket extends the same cage to Step 4. Deferred process findings A/B/E/F (from the TabSplit test) are separate.
