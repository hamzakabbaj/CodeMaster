# CM-13: /spec command (spec + plan-review gate)

- **Epic:** Phase 2 — Robust-Code Loop
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-13-loop-tooling`

## Goal
A slash command that produces a spec (problem, constraints, acceptance criteria, risks, plan) for a ticket/feature and **stops for plan-review before any code** (doc 02).

## Acceptance criteria
- [x] `.claude/commands/spec.md` takes `$ARGUMENTS` (CM-<n> or description)
- [x] Emits the spec sections and a plan with per-step verification
- [x] Explicitly halts for approval before implementing
- [x] Registered (appears in skills list)

## Notes
Operationalizes "review the plan before code exists." Pairs with `/start-ticket` (spec → approve → start).
