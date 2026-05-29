# Backlog

How we run work, the Big-Tech way, dogfooded on CodeMaster itself.

## Single source of truth
- **[ROADMAP.md](../ROADMAP.md)** is the index + status board (every ticket `CM-<n>` and its ⬜🟦✅ state).
- **`backlog/tickets/`** holds the *detailed spec* for a ticket — written **just-in-time** when the ticket is pulled into work, not all upfront. (Speculative over-specification is waste; refine at the last responsible moment.)
- A phase's tickets are elaborated when that phase starts. Until then they live as roadmap line-items.

## Hierarchy
`Epic` (= a phase) → `Story`/`Task` (= a `CM-<n>` ticket) → optional `Spike` (research, timeboxed).

## Ticket lifecycle
`⬜ todo → 🟦 in progress → ✅ done` (`⏸️ blocked` when waiting). One ticket → one branch → PR → green CI → merge → mark ✅ in ROADMAP.

## Definition of Ready (DoR) — before a ticket can be started
- [ ] Clear, single-sentence goal
- [ ] Acceptance criteria written and testable
- [ ] Dependencies known and unblocked
- [ ] Small enough to finish in one short-lived branch
- [ ] Verification approach identified (how we'll prove it works)

## Definition of Done (DoD) — before a ticket is closed
- [ ] Acceptance criteria met **and demonstrated** (output/run shown)
- [ ] All verification rungs green (lint → typecheck → test → CI)
- [ ] Docs / CLAUDE.md / ROADMAP updated
- [ ] No secrets, no boundary violations
- [ ] Reviewed (automated + human) and merged via PR

## Templates
- [templates/epic.md](templates/epic.md)
- [templates/ticket.md](templates/ticket.md)
