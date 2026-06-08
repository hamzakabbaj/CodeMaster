# Backlog

How we run work, the Big-Tech way, dogfooded on CodeMaster itself.

## Single source of truth
- **`blueprint/v1/backlog/`** is the canonical JSON backlog: `roadmap.json` (epics, order, prose) is the index + status board, and **`tickets/CM-<n>-<slug>/ticket.json`** is each ticket's structured body (see *Ticket layout*), written **just-in-time** when the ticket is pulled into work. (Speculative over-specification is waste; refine at the last responsible moment.)
- **[ROADMAP.md](../ROADMAP.md) is a generated view** of that JSON (`scripts/gen_roadmap.py`, kept in sync by the pre-commit hook + a CI rung) — never hand-edit it.
- A phase's tickets are elaborated when that phase starts. Until then they live as minimal stub tickets / roadmap line-items.

## Hierarchy
`Epic` (= a phase) → `Story`/`Task` (= a `CM-<n>` ticket) → optional `Spike` (research, timeboxed).

## Ticket layout
Each ticket is a **folder** so the structured body, the plan, and the proof live together:

```
blueprint/v1/backlog/tickets/CM-<n>-<slug>/
  ticket.json   # the ticket body — id, title, epic, type, status, goal/story, AC (required; schema-validated)
  plan.md       # optional — the loop's Plan beat: change-by-layer + sequence (gnarly tickets)
  evidence.md   # optional — proof of done: pointers to the CI run / PR / tests + small text
```

- **ticket.json** is the only required file (validated by the blueprint conformance rung against `.claude/skills/backlog/schema/ticket.schema.json`); `plan.md` and `evidence.md` are added when they earn their place (ceremony scales with the ticket).
- **Evidence points at the cage, never duplicates it.** The authoritative proof is the green CI run + the tests in the suite + the merged PR — `evidence.md` *links* those and pastes small text outputs only. **No committed binaries** (a screenshot bloats history and goes stale — link the PR instead).

## Ticket lifecycle
`todo → in_progress → done` (`blocked` when waiting), set as the `status` field in `ticket.json`. One ticket → one branch → PR → green CI → merge → set `status: "done"` (ROADMAP.md regenerates).

## Definition of Ready (DoR) — before a ticket can be started
- [ ] Clear, single-sentence goal
- [ ] Acceptance criteria written and testable
- [ ] Dependencies known and unblocked
- [ ] Small enough to finish in one short-lived branch
- [ ] Verification approach identified (how we'll prove it works)

## Definition of Done (DoD) — before a ticket is closed
- [ ] Acceptance criteria met **and demonstrated** — recorded in the ticket's `evidence.md` (pointers to the green CI run / PR / tests; small text only)
- [ ] All verification rungs green (lint → typecheck → test → CI)
- [ ] Docs / CLAUDE.md / ROADMAP updated
- [ ] No secrets, no boundary violations
- [ ] Reviewed (automated + human) and merged via PR

## Templates
- [templates/epic.md](templates/epic.md)
- [templates/ticket.md](templates/ticket.md) — becomes the ticket folder's `README.md`
- [templates/plan.md](templates/plan.md) — optional `plan.md`
- [templates/evidence.md](templates/evidence.md) — optional `evidence.md`
