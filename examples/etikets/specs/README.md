# specs/ — the build plans (`/spec` output)

> **What this folder is.** It holds the **how**: the technical plans produced by
> running `/spec` against the approved design. A spec is **Step 2** of the arc — it
> turns *what/why* into an ordered, verifiable build plan, and it **stops for
> plan-review before any code exists.**

## The shape of a spec
Every spec is one short, reviewable document with a fixed structure:

| Section | Captures |
|---|---|
| **Problem / intent** | what & why, 1–2 sentences (from the design) |
| **Constraints** | invariants + what must *not* change (the design's non-goals) |
| **Acceptance criteria** | testable conditions (the design's success metrics) |
| **Risks / unknowns** | what could make this wrong or hard |
| **Plan** | ordered steps · files to add/change · **how each step is verified** |

…then it names the single **riskiest assumption** + how to de-risk it, and **STOPs**
for approval.

## Altitudes
- **Epic-level spec** (a file here, e.g. [EPIC-daily-pick-loop.spec.md](EPIC-daily-pick-loop.spec.md)) —
  one coherent plan for a whole feature, written *before* it's sliced into tickets.
- **Ticket-level spec** — for a gnarly individual ticket, a focused `/spec ETK-n`
  whose output usually lives *in the ticket file* rather than as a separate doc.

## The gate: plan-review
`/spec` halts on purpose. The plan is the **last artifact you can change for free** —
so the `architect` review (and your own scrutiny) lands here, not on code that
shouldn't have been written. Only after approval does the plan's step sequence become
the backlog.

## How it connects
Reads ⟶ [`../design/`](../design/README.md). Produces ⟶ the plan steps that become
[`../backlog/`](../backlog/README.md) tickets (stories + enabler tasks).
