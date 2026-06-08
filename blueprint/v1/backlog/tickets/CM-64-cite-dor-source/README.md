# CM-64: Cite the canonical DoR in the backlog skill instead of paraphrasing it

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-0-delivery-infrastructure
- **Type:** chore
- **Status:** ✅ done

## Goal
Make the backlog skill's step-5 Definition of Ready defer to its single source (backlog/README.md) so the two cannot drift.

## Acceptance criteria
- [x] Step 5 of .claude/skills/backlog/SKILL.md names the Definition of Ready and points at backlog/README.md as its canonical source
- [x] The skill still enumerates the DoR criteria inline (a working checklist), but is now explicitly a view of the README's definition, not an independent restatement
- [x] No DoR criterion is changed — this is a sourcing fix, not a redefinition
- [x] scripts/ci.sh green (8 rungs)

## Verification
bash scripts/ci.sh (markdown-links rung covers the new backlog/README.md reference; commit-message rung covers the conventional subject).

## Notes
Found while explaining the backlog skill: step 5 hand-copies the five DoR criteria from backlog/README.md. The schema enforces the structural half (goal-or-story + acceptance_criteria); the judgment criteria (deps unblocked, branch-sized, verification identified) live in prose only, so a hand-copied DoR can silently drift from the canonical one. Cheapest durable fix: cite the source so the skill is a view, not a fork.
