# Backlog

How we run work, the Big-Tech way, dogfooded on CodeMaster itself.

## Single source of truth
- **[ROADMAP.md](../ROADMAP.md)** is the index + status board (every ticket `CM-<n>` and its ⬜🟦✅ state).
- **`backlog/tickets/CM-<n>-<slug>/`** — a **folder per ticket** holding the detail (see *Ticket layout*), written **just-in-time** when the ticket is pulled into work, not all upfront. (Speculative over-specification is waste; refine at the last responsible moment.)
- A phase's tickets are elaborated when that phase starts. Until then they live as roadmap line-items.

## Hierarchy
`Epic` (= a phase) → `Story`/`Task` (= a `CM-<n>` ticket) → optional `Spike` (research, timeboxed).

## Ticket layout
Each ticket is a **folder** so the spec, the plan, and the proof live together:

```
backlog/tickets/CM-<n>-<slug>/
  README.md     # the ticket body — goal, AC, verification (required; GitHub auto-renders it)
  plan.md       # optional — the loop's Plan beat: change-by-layer + sequence (gnarly tickets)
  evidence.md   # optional — proof of done: pointers to the CI run / PR / tests + small text
```

- **README.md** is the only required file; `plan.md` and `evidence.md` are added when they earn their place (ceremony scales with the ticket).
- **Evidence points at the cage, never duplicates it.** The authoritative proof is the green CI run + the tests in the suite + the merged PR — `evidence.md` *links* those and pastes small text outputs only. **No committed binaries** (a screenshot bloats history and goes stale — link the PR instead).

## Ticket lifecycle
`⬜ todo → 🟦 in progress → ✅ done` (`⏸️ blocked` when waiting). One ticket → one branch → PR → green CI → merge → mark ✅ in ROADMAP.

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
