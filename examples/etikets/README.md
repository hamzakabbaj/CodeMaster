# examples/etikets — a worked `blueprint/`

This is a **real, end-to-end project record** produced by the CodeMaster greenfield
process — not a mock. It was **imported from an actual design-thinking + technical-design
run** for **EtiKets** (a mobile app that draws exactly *one* random micro-task per day to
beat procrastination through a streak loop). Use it as the reference for what the
structured **`blueprint/`** record looks like in a real repo.

> The doctrine this illustrates is the [greenfield deep-dive](../../docs/site/greenfield.html)
> (6 steps: Design Thinking → System Design → /spec → Backlog → Build → Ship). Everything
> *upstream of code* lives in `blueprint/`, versioned and structured.

## Layout

```
blueprint/
  v1/
    version.json                       # what's in this version + status per module
    design-thinking/                   # Step 1 — what & why (20 steps, real, schema-validated JSON)
      project_brief/data.json
      persona/data.json
      problem_hypothesis/data.json
      … 17 more …
    system-design/                     # Step 2 — how it's built (technical-design skill)
      architecture/data.json
      api_design/data.json
      design_system/                   # real tokens + component gallery
        data.json  styles.css  components.html  foundations.html
    specs/                             # Step 3 — the epic plan (/spec, narrative)
      EPIC-daily-pick-loop.spec.md
    backlog/                           # Step 4 — sliced, ordered work (JSON)
      roadmap.json
      tickets/ETK-100.json  ETK-101.json  ETK-1.json  ETK-2.json  ETK-3.json
```

## How to read it

1. Start with [`version.json`](blueprint/v1/version.json) — the state of each module.
2. Skim the design-thinking record — e.g. [`persona/data.json`](blueprint/v1/design-thinking/persona/data.json)
   and [`problem_hypothesis/data.json`](blueprint/v1/design-thinking/problem_hypothesis/data.json) — the *what & why*.
3. See how it's built in [`system-design/architecture/data.json`](blueprint/v1/system-design/architecture/data.json)
   and the real [`design_system/styles.css`](blueprint/v1/system-design/design_system/styles.css).
4. Read the bridge: [`specs/EPIC-daily-pick-loop.spec.md`](blueprint/v1/specs/EPIC-daily-pick-loop.spec.md) — the plan that gets sliced.
5. End at the [`backlog`](blueprint/v1/backlog/roadmap.json): the spec's plan steps become
   [`ETK-100`](blueprint/v1/backlog/tickets/ETK-100.json) … [`ETK-3`](blueprint/v1/backlog/tickets/ETK-3.json).
   The riskiest assumption (the day-boundary rule) was promoted to its own foundational ticket,
   [`ETK-101`](blueprint/v1/backlog/tickets/ETK-101.json) — *why you spec before you slice.*

## Faithful-to-reality notes

- **No `database_schema`.** The real v1 run didn't produce a DBML schema — blueprint steps
  are completed when the work warrants, not ritually. Its absence is the honest record.
- **Wireframes not versioned.** The design-thinking run produced throwaway HTML wireframes
  (step 17); per CodeMaster doctrine the prototype is disposable, so only the *structured*
  record is kept here — the wireframe HTML is not committed.
- **Two serializations.** This project's backlog is **JSON** (`blueprint/v1/backlog/`).
  CodeMaster's own meta-repo keeps the **markdown** `new-ticket` variant — same model, two
  serializations. The fields line up: goal/story · acceptance criteria · verification · plan · notes.
