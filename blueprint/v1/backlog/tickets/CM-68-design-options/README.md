# CM-68: Add the design-options command: pick a UI/UX variant before building it

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-0-delivery-infrastructure
- **Type:** task
- **Status:** ✅ done

## Goal
Give the build loop a design-altitude beat — the parallel of /spec-when-gnarly: when a ticket implies a UI/UX choice, generate 2-3 throwaway variants as a file://-openable gallery, let the user pick, and record the decision in plan.md before building the chosen variant for real.

## Acceptance criteria
- [x] .claude/commands/design-options.md exists: generates 2-3 DISTINCT variants of a ticket's element as a single file://-openable gallery at prototypes/CM-<n>-<slug>/index.html via the frontend-design skill, presents them, STOPS for the user to pick, and records the chosen direction + rationale in plan.md
- [x] build's Plan beat (Beat 1) wires it parallel to gnarly->/spec: the design step fires when the ticket sets needs_design: true, else when build judges a UI/UX choice is open (flag-if-present-else-judge)
- [x] ticket.schema.json gains an optional needs_design boolean (the deterministic half of the trigger)
- [x] prototypes/ is added to .gitignore so throwaway galleries are never tracked and never reach CI (the durable artifact is the decision in plan.md)
- [x] The command is explicit that the gallery is a decision aid only — the chosen variant is built for real with the project's components, and the design-system is reused when it already dictates the look (no needless re-exploration)
- [x] scripts/ci.sh green (8 rungs)

## Verification
bash scripts/ci.sh green (markdown-links rung covers design-options.md + build wiring cross-refs; blueprint-schema rung accepts the new optional needs_design field). The command's runtime behaviour (gallery generation) is exercised when first used on a real UI ticket.

## Plan
Four small coupled changes in one branch: (1) .claude/commands/design-options.md (mirror /spec + /start-ticket house style); (2) wire build SKILL.md Beat 1 with a design line beside the gnarly line; (3) add optional needs_design boolean to ticket.schema.json; (4) add prototypes/ to .gitignore. Reuse frontend-design (engine) and plan.md (decision record) rather than inventing artifacts.

## Notes
Requested as the design-altitude parallel of /spec. The doctrine already existed as prose in docs/site/data/greenfield.js ('Mini-wireframes — exploring UI variants, the element altitude'); this encodes it as a primitive. Decisions: a /design-options command (named for the decision, not the artifact); trigger = flag-if-present-else-judge; output is a file://-openable .html gallery. Engine is the existing frontend-design skill. This is the element altitude of the 'design altitude follows work altitude' principle (Step-1 = whole project, Step-2 design-system = the component language, this = one element for one ticket).
