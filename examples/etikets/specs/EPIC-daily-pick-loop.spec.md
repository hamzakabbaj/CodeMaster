# Spec — EtiKets MVP: the daily-pick loop

> **What this file is.** An **epic-level `/spec` output**: the technical plan for the
> EtiKets MVP loop, produced by reading the [design-of-record](../design/etikets-design.md)
> and stopping for **plan-review** before code. Its plan steps become the backlog
> tickets. This is the bridge from *what/why* to *how*.

- **Epic:** Daily-pick MVP loop
- **Input:** [`../design/etikets-design.md`](../design/etikets-design.md)
- **Plan-review:** ✅ approved 2026-05-22 (architect) — proceed to slice the backlog

---

## Problem / intent
Let a user add micro-tasks and complete exactly **one randomly-picked task per day**,
building a streak — EtiKets' single validating loop.

## Constraints *(from the design's non-goals)*
- Mobile-only — no web
- Title-only tasks — no categories / priority / deadlines
- One pick per day; **immutable once picked** (swap allowed only with an active streak)
- Randomness *is* the system — no manual choice, no scheduling

## Acceptance criteria *(from the design's success metrics + MVP scope)*
- Add a task by title → it enters the pool
- Exactly **one** task is picked per **calendar day**; reopening the app shows the **same** pick
- Marking the pick done → streak **+1**; a missed day → streak **resets**
- Open-to-pick **< 30 s** on cold start
- Completion-rate and streak are **queryable** (telemetry for the >70% / 5+ goals)

## Risks / unknowns
- **⚠ Riskiest:** the **day-boundary / timezone rule** for "one pick per day" (device tz?
  travel? midnight vs. a rolling 24h?). It's foundational — everything downstream assumes it.
- Streak reset semantics — hard midnight, or a grace window?
- Selection fairness — avoid drawing the same task two days running?

## Plan  *(step → files → verification rung)*

| # | Step | Files | Verified by |
|---|---|---|---|
| 1 | Data model: `Task`, `DailyPick`, `Streak` | `domain/models/` | unit (state transitions) → **test rung** |
| 2 | Pick engine: deterministic-per-day random draw **+ the day-boundary rule** | `domain/pick/` | unit: same-pick-on-reopen + boundary → **test rung** |
| 3 | Streak rules: increment / reset / grace | `domain/streak/` | unit: reset + grace → **test rung** |
| 4 | Wire add-task & mark-done into the UI | `app/screens/` | component tests → **test rung** |
| 5 | Cold-open → pick performance | — | smoke: < 30 s → **e2e/smoke rung** |

## Riskiest assumption & de-risk
**Assumption:** a single, simple "one pick per calendar day" rule is sufficient.
**De-risk:** *decide the timezone/day-boundary rule explicitly in step 1–2 and pin it
with tests before any UI is built* — so the rule is settled once, not smeared across screens.

## → STOP for plan-review
Each numbered step becomes a ticket. Note the slicing:

| Plan step | Becomes | Type |
|---|---|---|
| 1 | [`ETK-100`](../backlog/tickets/ETK-100-data-model/README.md) | enabler **task** |
| 2 | [`ETK-101`](../backlog/tickets/ETK-101-pick-engine/README.md) (carries the day-boundary decision) | enabler **task** |
| 3 + 4 (mark-done + streak UI) | [`ETK-3`](../backlog/tickets/ETK-3-mark-done-streak/README.md) | **story** |
| 4 (add-task UI) | [`ETK-1`](../backlog/tickets/ETK-1-add-task/README.md) | **story** |
| 4 (daily-pick UI) | [`ETK-2`](../backlog/tickets/ETK-2-daily-pick/README.md) | **story** |

The riskiest assumption (the timezone rule) was **promoted to its own foundational
ticket** ([ETK-101](../backlog/tickets/ETK-101-pick-engine/README.md)) — the concrete reason
you spec *before* you slice.
