# CM-47: Greenfield Step 4 — add the "Pull & refine to Ready" substep

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** epic-d-docs-site-reference-showcase
- **Type:** task
- **Status:** ✅ done

## Goal
Close the documented gap between Backlog (Step 3) and Build (Step 4): name the just-in-time refinement that brings a rough ticket to Definition of Ready at the pull, and the Build→Backlog feedback where discoveries become new tickets.

## Acceptance criteria
- [x] Step 4 gains a first substep "Pull & refine to Ready" (apply DoR, localize the epic spec, split if big, spike if not Ready) — before `/start-ticket`
- [x] Step 4 section intro + sub-flow title updated to include pull & refine
- [x] A "discoveries → backlog" feedback note added (park discoveries as new tickets, don't scope-creep the branch)
- [x] Renders over `file://` with zero console errors; CI ladder green

## Verification
chrome-devtools MCP loads `greenfield.html` → no console errors, Step 4 shows the new substep + feedback note. `node --check` clean. Full 6-rung ladder green.

## Notes
Refinement (→ Ready, the what/done, before `/start-ticket`) is distinct from the focused `/spec` (→ the how, after, gnarly only) — keep both. No renderer changes.
