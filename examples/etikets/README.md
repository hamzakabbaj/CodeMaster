# Reference project — EtiKets (worked example)

> **What this folder is.** An *illustration* of the process artifacts a real
> product repo carries through the greenfield arc — **design → spec → backlog**.
> It is **not** CodeMaster's own backlog; it's a separate sample project
> (gamified random task-picker) using the `ETK-` ticket prefix so the two never
> get confused. Every file here doubles as documentation: each opens with a note
> explaining *what it is / could contain*, then shows a realistic filled-in example.

## The project in one line
**EtiKets** — a mobile app where your daily micro-task is *picked at random* and
can't be swapped, killing decision paralysis and building a streak habit.

## How the artifacts connect

```
design/   →   specs/   →   backlog/
 what &        how,         shippable
 why           gated        slices
(Step 1)     (Step 2)     (Step 3)
```

- **`design/`** — the *design-of-record*: what we're building and why, validated
  upstream. Answers the **problem space**. → [design/README.md](design/README.md)
- **`specs/`** — the `/spec` output: the technical **plan**, gated by plan-review
  before any code. Answers the **solution build**. → [specs/README.md](specs/README.md)
- **`backlog/`** — the design+plan sliced into **epics, stories, and tasks**
  (`ETK-n` tickets), tracked in a status board. → [backlog/README.md](backlog/README.md)

The arrows are *translations*, not copies: design feeds `/spec`, which produces
the plan steps that `new-ticket` turns into the backlog. See the full narrative on
the docs site's greenfield deep-dive.

## Folder map

```
examples/etikets/
  README.md                 ← you are here
  design/
    README.md               role of design/ + the design-of-record concept
    etikets-design.md       the design-of-record (summary + pointers + approval gate)
  specs/
    README.md               role of specs/ + the shape of a /spec output
    EPIC-daily-pick-loop.spec.md   an epic-level spec (the MVP loop)
  backlog/
    README.md               the epic/story/task hierarchy + DoR/DoD
    ROADMAP.md              the status board (the epic + its tickets)
    tickets/
      ETK-1-add-task.md          STORY
      ETK-2-daily-pick.md        STORY
      ETK-3-mark-done-streak.md  STORY
      ETK-100-data-model.md      enabler TASK
      ETK-101-pick-engine.md     enabler TASK (carries the day-boundary decision)
```

## Reading order
1. [design/etikets-design.md](design/etikets-design.md) — *what & why* (approved).
2. [specs/EPIC-daily-pick-loop.spec.md](specs/EPIC-daily-pick-loop.spec.md) — *how*, with the riskiest assumption surfaced.
3. [backlog/ROADMAP.md](backlog/ROADMAP.md) → the `ETK-n` tickets — the work, sliced and ordered.

Watch one thread the whole way down: the **"one pick per day" timezone rule** appears
as a *risk* in the spec, then becomes its **own foundational ticket** ([ETK-101](backlog/tickets/ETK-101-pick-engine.md)) —
the concrete payoff of speccing before slicing.
