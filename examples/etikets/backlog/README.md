# backlog/ — epics, stories, tasks

> **What this folder is.** The design + plan, **sliced into shippable work** and
> tracked. This is **Step 3** of the arc. It shows the agile hierarchy *right-sized
> for a product*: epics in the status board, stories and tasks as `ETK-n` tickets.

## The hierarchy (and where each part lives)

| Concept | Lives in | Note |
|---|---|---|
| **Epic** | a section in [`ROADMAP.md`](ROADMAP.md) | a value chunk spanning several tickets |
| **Story** | an `ETK-n` ticket, `Type: story` | user-facing slice: *As a… I want… so that…* + AC |
| **Task** | an `ETK-n` ticket, `Type: task` | technical/**enabler** unit no single story owns |
| **Spike** | an `ETK-n` ticket, `Type: spike` | timeboxed research (none in this example) |

**Each ticket is a folder** — `tickets/ETK-n-slug/` with `README.md` (the body) plus
optional `plan.md` (the loop's Plan beat) and `evidence.md` (proof of done: pointers to
the CI run / PR / tests, no committed binaries). Same convention as CodeMaster's own backlog.

## Stories vs. enabler tasks (vertical vs. horizontal)
- **Stories** are *vertical* slices — each delivers something a user can observe.
  ([ETK-1](tickets/ETK-1-add-task/README.md), [ETK-2](tickets/ETK-2-daily-pick/README.md), [ETK-3](tickets/ETK-3-mark-done-streak/README.md))
- **Enabler tasks** are *horizontal* foundations — the data model and pick engine that
  the stories stand on, owned by no single story.
  ([ETK-100](tickets/ETK-100-data-model/README.md), [ETK-101](tickets/ETK-101-pick-engine/README.md))

Good backlogs mix both: pure story-slicing leaves the plumbing homeless; pure
task-slicing loses the *why*. ETK-100/101 are numbered separately (100+) to read at a
glance as enablers.

## Definition of Ready (before a ticket is started)
Clear single-sentence goal · testable AC · dependencies known & unblocked · small
enough for one short-lived branch · verification approach identified.

## Definition of Done (before a ticket is closed)
AC met **and demonstrated** · all verification rungs green · docs/status updated ·
no secrets or boundary violations · reviewed and merged via PR.

## Order of play
Dependency order from the spec: **ETK-100 → ETK-101 → ETK-1/2/3**. The enablers come
first because the user-facing stories can't stand without the data model and the pick
engine (with its day-boundary rule) underneath them. See [`ROADMAP.md`](ROADMAP.md).
