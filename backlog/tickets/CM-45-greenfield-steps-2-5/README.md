# CM-45: Greenfield deep-dive — Steps 2–5

- **Epic:** D — Docs Site (reference showcase)
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-45-greenfield-steps-2-5`

## Goal
Complete the greenfield deep-dive page by detailing Steps 2–5 (`/spec` & plan-review, Backlog slicing, Build loop, Ship) with the same depth as Step 1, grounded in CodeMaster's real primitives.

## Acceptance criteria
- [ ] Step 2 (`/spec` & plan-review): epic-level spec from the design; resolves the two-altitudes-of-`/spec` ordering question; plan-review gate
- [ ] Step 3 (Backlog): `new-ticket`/`next-number.sh`, vertical slicing, Definition of Ready gate, just-in-time refinement
- [ ] Step 4 (Build): `/start-ticket`, generate→verify→critique loop, the ladder, `checkpoint.sh`, the always-on cage (hooks); green-ladder gate
- [ ] Step 5 (Ship): PR template, automated review (`reviewer`/`review-board` + adversarial verify), human review, green CI, squash-merge, post-merge main verify; closes the loop
- [ ] Closing block tying the arc to how CodeMaster dogfooded itself; old "up next" placeholder removed
- [ ] Renders over `file://` with zero console errors; CI ladder green

## Verification
chrome-devtools MCP loads `greenfield.html` → no console errors, all step blocks render, internal links resolve. `node --check` clean. Full 6-rung ladder green.

## Notes
Reuses existing block types — no renderer changes. Decision: `/spec` operates at two altitudes (epic-level in Step 2, optional ticket-level in Step 4) to keep the arc order sound.
