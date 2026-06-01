# ETK-101: Pick engine + day-boundary rule

> **What this file is.** An **enabler task** ticket — and the payoff of the whole
> design→spec→backlog chain. The "one pick per day" **timezone/day-boundary** question
> showed up as the *riskiest assumption* in the spec, so instead of smearing it across
> the UI stories it was **promoted to its own foundational ticket**. This is *why you
> spec before you slice.*

- **Epic:** Daily-pick MVP loop
- **Type:** task (enabler)
- **Status:** ⬜ todo
- **Depends on:** [ETK-100](../ETK-100-data-model/README.md) · **Blocks:** [ETK-2](../ETK-2-daily-pick/README.md)
- **Spec:** [EPIC-daily-pick-loop](../../../specs/EPIC-daily-pick-loop.spec.md) (plan step 2, riskiest assumption)

## Goal
Implement the deterministic-per-day random pick, and **decide & pin the day-boundary
rule** that everything downstream assumes.

## The decision to make (and record here)
- **Day boundary:** device-local midnight? a rolling 24h from first open? Server day?
  → *Record the chosen rule and the rationale in this ticket and in code.*
- **Travel / timezone change:** what happens if the user crosses a timezone mid-day?
- **Fairness:** may the same task be drawn two days running, or is there a cooldown?

## Acceptance criteria
- [ ] Exactly one pick is produced per day under the **chosen** boundary rule
- [ ] Reopening within the same day returns the **same** pick (deterministic)
- [ ] A new day produces a new pick; the boundary behavior is covered by tests
- [ ] Timezone-change behavior is defined and tested (no double-pick, no skipped day)
- [ ] Fairness rule implemented and tested (e.g. no immediate repeat, if chosen)
- [ ] The streak-swap path (active streak → one allowed swap) is supported

## Verification
Unit tests are the contract here: same-pick-on-reopen, day rollover at the boundary,
timezone-change edge cases, fairness. (Ladder: **test rung**.) Pin these **before** any
UI work in ETK-2.

## Notes
Settling this once, in isolation, is the entire point: had we sliced straight from the
design by screen, this rule would have been re-invented (probably inconsistently) inside
three different UI tickets — and the bug would have surfaced in production, not here.
