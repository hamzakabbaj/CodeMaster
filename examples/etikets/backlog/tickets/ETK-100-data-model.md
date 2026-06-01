# ETK-100: Data model — Task / DailyPick / Streak

> **What this file is.** An **enabler task** ticket — *horizontal* foundation that no
> single story owns but several depend on. Enabler tasks are numbered 100+ here so they
> read at a glance as scaffolding. No *As a…* form: the "user" is the rest of the build.

- **Epic:** Daily-pick MVP loop
- **Type:** task (enabler)
- **Status:** ⬜ todo
- **Blocks:** [ETK-1](ETK-1-add-task.md), [ETK-3](ETK-3-mark-done-streak.md), [ETK-101](ETK-101-pick-engine.md)
- **Spec:** [EPIC-daily-pick-loop](../../specs/EPIC-daily-pick-loop.spec.md) (plan step 1)

## Goal
Define the core domain model and its state transitions so the stories have a stable
foundation to build on.

## Acceptance criteria
- [ ] `Task { id, title, createdAt }` — the pool item
- [ ] `DailyPick { date, taskId, status: drawn|done }` — one per calendar day
- [ ] `Streak { count, lastCompletedDate }` with explicit **increment** and **reset** rules
- [ ] State transitions are unit-tested (draw → done; missed day → reset)
- [ ] The streak-reset rule is documented in code where `Streak` is defined

## Verification
Unit tests covering every transition; no UI in scope. (Ladder: **test rung**.)

## Notes
This is plan step 1 of the spec. It owns the **streak-reset semantics** so ETK-3 can
just consume them. The *day-boundary* rule (a separate, riskier decision) is owned by
[ETK-101](ETK-101-pick-engine.md).
