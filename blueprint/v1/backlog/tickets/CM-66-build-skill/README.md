# CM-66: Add the build skill + build-critique workflow (the Step-5 robust-code loop engine)

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-0-delivery-infrastructure
- **Type:** task
- **Status:** ✅ done

## Goal
Encode the greenfield Step-5 robust-code loop as a primitive: a build skill (the serial spine) whose critique beat fans out to a build-critique workflow (the parallel rib), so every ticket gets the same plan -> generate -> verify -> critique -> checkpoint treatment instead of free-form model behaviour.

## Acceptance criteria
- [x] .claude/skills/build/SKILL.md exists: the serial loop the main agent runs on ONE Ready ticket on its branch — preconditions, Plan beat (always; gnarly -> /spec -> plan.md), the generate->verify(ci.sh)->checkpoint(checkpoint.sh)->critique loop, the feedback arrow (park discoveries via feature-intake), exits, guardrails
- [x] The skill stops at green and explicitly does NOT open the PR (ship is a separate step)
- [x] The skill computes the risky/gnarly flags from deterministic-ish signals (gnarly = ticket has plan.md; risky = diff touches a published surface list, fail-safe to true when uncertain) and passes them to the workflow
- [x] The skill acts on high/critical critique findings in-loop and defers low/nit to ship (noise budget)
- [x] .claude/workflows/build-critique.mjs exists: reviews the branch diff (git merge-base based) through tester/security/architect lenses conditional on the flags, adversarially verifies findings (reusing review-board's skeptic core), and returns { confirmed, proposed_tests }
- [x] Lens prompts are INLINE (no fleet dependency) so the workflow is portable to Track B/C — same rationale as review-board
- [x] scripts/ci.sh green (8 rungs)

## Verification
bash scripts/ci.sh green (markdown-links rung covers the skill's cross-references; the .mjs workflow is excluded from the node --check rung by design, like review-board). Design reviewed and iterated with the user before build.

## Plan
Two coupled artifacts in one branch (skill calls workflow). Build the workflow first (the rib), then the skill (the spine that invokes it), so the skill references a real workflow. Reuse review-board.mjs structure for the workflow; reuse the existing /start-ticket, /spec, checkpoint.sh, ci.sh, feature-intake primitives in the skill (point at them, don't restate).

## Notes
Designed in-conversation. Key decision: the single-ticket build LOOP is a skill (serial, stateful, mutating, judgment-driven), NOT a workflow — a workflow adds control-flow determinism but no guarantees, and the cage (ci.sh + checkpoint.sh + hooks) is already deterministic. Only the CRITIQUE beat has review-board's fan-out shape, so it becomes the workflow rib. Building N tickets in parallel is a different altitude (Phase 4 orchestration) that CONTAINS this loop. plan.md = gnarly signal; surface list = risky signal. Stale greenfield.js Step-4/5 prose (markdown backlog / two serializations) is a SEPARATE ticket.
