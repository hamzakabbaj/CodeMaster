# CM-48: Fix loop/ladder doc fidelity — restore the Plan beat, correct stale rung counts

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** epic-d-docs-site-reference-showcase
- **Type:** fix
- **Status:** ✅ done

## Goal
Make the site's robust-code-loop and verification-ladder descriptions faithful to the canonical loop and the real `ci.sh`: restore the always-present **Plan** beat and fix stale rung counts/order.

## Acceptance criteria
- [x] `greenfield.js` Step 4: planning is always-on (substep "Plan the implementation" — layers/files/order/tests, plan mode; `/spec` is its written form for gnarly tickets), not "(Optional) /spec"; section intro + sub-flow title include plan
- [x] `playbooks.js` greenfield Build step includes the `plan →` beat
- [x] `loop.js` steps title reads `Spec → plan → generate → verify → critique` (was `Spec → verify → critique`)
- [x] `loop.js` concrete ladder updated 5→6 rungs (adds the JS-syntax rung from CM-41); ladder flow reordered cheapest-first (typecheck before tests)
- [x] `roadmap.js` "5-rung" → "6-rung"
- [x] Renders over `file://` with zero console errors; CI ladder green

## Verification
chrome-devtools MCP loads `greenfield.html` + `loop.html` → no console errors, fixes present. `node --check` clean. Full 6-rung ladder green.

## Notes
Surfaced in discussion: the greenfield Step 4 dropped the loop's Plan beat and understated ticket-level implementation planning as optional. Found adjacent staleness: loop.js/roadmap.js still describe a 5-rung ladder (the JS rung made it 6 in CM-41).
