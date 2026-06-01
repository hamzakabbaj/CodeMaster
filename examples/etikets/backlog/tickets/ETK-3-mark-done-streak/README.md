# ETK-3: Mark done & grow the streak

> **What this file is.** A **user story** ticket bundling the completion action with
> its gamification payoff. It shows how one story can span two plan steps (mark-done +
> streak UI) when they form a single user-observable outcome.

- **Epic:** Daily-pick MVP loop
- **Type:** story
- **Status:** ⬜ todo
- **Depends on:** [ETK-100](../ETK-100-data-model/README.md), [ETK-2](../ETK-2-daily-pick/README.md)
- **Spec:** [EPIC-daily-pick-loop](../../../specs/EPIC-daily-pick-loop.spec.md)

## Story
**As a** user, **I want** to mark today's drawn task as done and see my streak grow,
**so that** finishing a small chore feels rewarding and I keep coming back.

## Acceptance criteria
- [ ] Marking the day's task done increments the streak by 1
- [ ] A day with no completed task **resets** the streak (per the rule fixed in ETK-100)
- [ ] The current streak is visible on the main screen at all times
- [ ] Completion is recorded for telemetry (feeds the >70% completion & 5+ streak metrics)

## Verification
Unit tests on streak increment/reset; component test for the done action + streak
display; telemetry event asserted. (Ladder: **test rung**.)

## Notes
The streak is the **only** gamification in V1 (badges/levels are non-goals) — keep the
loop legible.
