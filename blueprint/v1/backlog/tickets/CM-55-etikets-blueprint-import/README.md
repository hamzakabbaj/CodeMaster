# CM-55: Convert examples/etikets to a worked JSON blueprint (real import)

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** epic-d-docs-site-reference-showcase
- **Type:** task
- **Status:** ✅ done

## Goal
Replace the markdown `examples/etikets/` with a real worked **`blueprint/`** instance, imported from the actual EtiKets design-thinking + technical-design run, demonstrating the structured project record end to end.

## Acceptance criteria
- [x] `examples/etikets/blueprint/v1/design-thinking/{step}/data.json` populated from the real run (20 steps); throwaway wireframe HTML (`mobile/`) **not** versioned, per doctrine
- [x] `examples/etikets/blueprint/v1/system-design/{architecture,api_design,design_system}/…` imported (rename `technical_design`→`system-design`); empty `database_schema` omitted with a README note
- [x] `examples/etikets/blueprint/v1/backlog/{roadmap.json, tickets/ETK-*.json}` — the prior markdown ETK tickets ported to JSON (slice demonstration preserved)
- [x] Old markdown model removed (`design/`, `specs/`, `backlog/` markdown) — single canonical example
- [x] Top `README.md` rewritten: maps the folder to the greenfield 6-step model; explains the DB-schema absence and the wireframe-skip as faithful-to-reality
- [x] All imported JSON is valid; `scripts/ci.sh` green (JSON rung + markdown links)

## Verification
`find examples/etikets/blueprint/v1` shows the imported tree; `node -e`/`python -m json.tool` confirms each `data.json` parses; full ladder green.

## Notes
Decisions (this session): **import the real data** (not fabricate) and **replace** the markdown example. Source: `/Users/hamzakabbaj/Savana/personal/etikets/data/v1` (user-owned). `codebase_map/` is skipped — it's a reverse-engineering methodology, not part of the greenfield blueprint model. The backlog JSON is the one authored part (the real run had no backlog); it ports CM-46's ETK tickets so the slice output is still shown. Closes the A→B→C arc started in CM-53/CM-54.

## Evidence
See [evidence.md](evidence.md).
