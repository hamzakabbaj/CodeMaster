# CM-71: Wire code-explorer into build's Plan beat as the terrain-uncertainty hatch

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-0-delivery-infrastructure
- **Type:** task
- **Status:** ✅ done

## Goal
Close the instruction gap where code-explorer existed as an agent but build's Plan beat never told the loop to call it — add it as the third Beat-1 hatch (terrain uncertainty), symmetric with gnarly->/spec and needs-design->/design-options.

## Acceptance criteria
- [x] build SKILL.md Beat 1 has three conditional hatches keyed by uncertainty TYPE: terrain (unfamiliar code) -> code-explorer; logic (gnarly) -> /spec; design (needs_design) -> /design-options
- [x] The terrain hatch fires for brownfield AND grown greenfield (code not in context), recovers the map (execution paths/dependencies/blast radius) BEFORE planning, and its map feeds the plan
- [x] For a brownfield change, the hatch also calls for pinning existing behaviour with characterization tests before touching it (backward-compat emphasis lives in the loop, not as a separate stage)
- [x] The hatches are noted as composable (a brownfield UI change can run code-explorer AND /design-options) and as exceptions, not defaults (most tickets need none)
- [x] scripts/ci.sh green (8 rungs)

## Verification
bash scripts/ci.sh green (markdown-links rung covers the code-explorer reference). Model alignment: this makes brownfield converge with greenfield from the ticket onward — same /start-ticket -> build -> ship — with code-explorer firing in the Plan beat instead of as a pre-ticket stage.

## Plan
Single edit to build SKILL.md Beat 1: reframe the lead-in as 'three hatches by uncertainty type', add the terrain/code-explorer bullet first (understand before logic/design), keep gnarly and design bullets, add a 'these compose' line. Reuse code-explorer (CM-69); no new files.

## Notes
Found in MVP test-and-improve: the user corrected the brownfield model — code-explorer should run AFTER feature-intake, in build's Plan beat (just before planning), not as the first step; and brownfield converges with greenfield once the ticket exists. code-explorer (CM-69) was an agent with no caller in the loop — only fired if the model happened to think of it. This wires it in. No schema flag (unlike needs_design): 'is this code in my context?' is a state judgment, not a deterministic ticket property.
