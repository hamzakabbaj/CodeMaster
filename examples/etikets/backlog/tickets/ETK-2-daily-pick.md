# ETK-2: One random task per day

> **What this file is.** A **user story** ticket for the core mechanic. Note how its
> AC inherit directly from the design's product decisions (forced random, immutability)
> and depend on the enabler that owns the hard rule ([ETK-101](ETK-101-pick-engine.md)).

- **Epic:** Daily-pick MVP loop
- **Type:** story
- **Status:** ⬜ todo
- **Depends on:** [ETK-101](ETK-101-pick-engine.md) (pick engine + day-boundary rule)
- **Spec:** [EPIC-daily-pick-loop](../../specs/EPIC-daily-pick-loop.spec.md)

## Story
**As a** user, **I want** the app to draw exactly one random task for me each day,
**so that** I don't have to choose and can't procrastinate by picking the easy one.

## Acceptance criteria
- [ ] On the first open of a calendar day, one task is drawn at random from the pool
- [ ] Reopening the app the same day shows the **same** drawn task (idempotent per day)
- [ ] The drawn task **cannot be swapped** — unless the user has an active streak (then: one swap)
- [ ] If the pool is empty, the user is prompted to add a task (graceful empty state)

## Verification
Unit tests on the pick engine (same-pick-on-reopen, day rollover, streak-swap path);
component test for the draw screen + empty state. (Ladder: **test rung**.)

## Notes
The *why* behind "no swap" is the anti-procrastination bet (see design). The day-boundary
rule this story relies on is **decided and tested in [ETK-101](ETK-101-pick-engine.md)** —
this story consumes it rather than re-deciding it.
