# ETK-1: Add a micro-task by title

> **What this file is.** A **user story** ticket — a *vertical* slice that delivers
> something the user can observe. Stories use the *As a… I want… so that…* form and
> carry testable acceptance criteria. Detail lives here; status lives in the
> [ROADMAP](../ROADMAP.md).

- **Epic:** Daily-pick MVP loop
- **Type:** story
- **Status:** ⬜ todo
- **Depends on:** [ETK-100](ETK-100-data-model.md)
- **Spec:** [EPIC-daily-pick-loop](../../specs/EPIC-daily-pick-loop.spec.md) · **Design:** [etikets-design](../../design/etikets-design.md)

## Story
**As a** user, **I want** to add a micro-task by typing just a title, **so that** it
joins my pool of tasks that can be drawn.

## Acceptance criteria
- [ ] A single text field adds a task with a title (no other fields — title-only per scope)
- [ ] The new task immediately becomes eligible for the daily draw
- [ ] Adding is fast and frictionless (supports the "3+ tasks/week" metric)
- [ ] Empty/whitespace titles are rejected

## Verification
Component test for the add flow; unit test that a new task enters the draw pool.
(Ladder: **test rung**.)

## Notes
Deliberately minimal — categories, priority, and editing are **non-goals** in V1.
