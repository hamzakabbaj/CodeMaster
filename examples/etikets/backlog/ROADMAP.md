# EtiKets — Roadmap / status board

> **What this file is.** The single **index + status board**: every epic and its
> `ETK-n` tickets with status. The ticket *files* hold the detail; this holds the
> *what* and *where-it-stands*. Mirror of how CodeMaster's own `ROADMAP.md` works.

**Status legend:** ⬜ todo · 🟦 in progress · ✅ done · ⏸️ blocked

## Epic 1 — Daily-pick MVP loop
*Spec: [`../specs/EPIC-daily-pick-loop.spec.md`](../specs/EPIC-daily-pick-loop.spec.md). Build order is dependency-first.*

| Ticket | Type | Title | Status |
|---|---|---|---|
| [`ETK-100`](tickets/ETK-100-data-model.md) | task (enabler) | Data model — Task / DailyPick / Streak | ⬜ |
| [`ETK-101`](tickets/ETK-101-pick-engine.md) | task (enabler) | Pick engine + day-boundary rule | ⬜ |
| [`ETK-1`](tickets/ETK-1-add-task.md) | story | Add a micro-task by title | ⬜ |
| [`ETK-2`](tickets/ETK-2-daily-pick.md) | story | One random task per day | ⬜ |
| [`ETK-3`](tickets/ETK-3-mark-done-streak.md) | story | Mark done & grow the streak | ⬜ |

**Exit:** all tickets ✅ → the MVP loop is shippable; begin measuring the success
metrics from the [design](../design/etikets-design.md).

## Later (out of MVP scope — parked)
Weekly task-set planning · achievements/levels · social · web client · monetization.
*(Non-goals for V1 — kept here only so they aren't lost.)*
