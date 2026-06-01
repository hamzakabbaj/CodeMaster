# ETK-101 — Implementation plan

> Demo of `plan.md` for an example ticket: the loop's Plan beat, persisted for a
> gnarly enabler whose riskiest decision (the day-boundary rule) deserves writing down.

## Approach
Build a pure, deterministic-per-day pick function over the pool, plus the streak-swap
escape hatch. Decide the day-boundary rule explicitly and pin it with tests *before* any
UI (ETK-2) consumes it.

## Changes by layer
- **Domain:** `domain/pick/` — `pickForDay(pool, date, seed)` (pure, deterministic); fairness rule (no immediate repeat).
- **Data:** reads the pool + today's `DailyPick` (from ETK-100); no new schema.
- **Frontend:** none — this enabler has no UI; ETK-2 wires it.
- **Tests:** unit only — same-pick-on-reopen, boundary rollover, timezone-change, fairness, streak-swap.

## Sequence
1. Decide the day-boundary rule (device-local midnight vs rolling 24h) — record it here + in code → unit tests.
2. `pickForDay` deterministic selection → unit (same-pick-on-reopen).
3. Fairness (no immediate repeat) → unit.
4. Streak-swap path → unit.

## Riskiest assumption
A single "one pick per calendar day" rule is sufficient. **De-risk:** settle the
timezone/day-boundary semantics in step 1 and lock them with tests before ETK-2 builds
on them — so the rule is decided once, not re-invented across screens.
