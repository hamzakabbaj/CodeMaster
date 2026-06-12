---
name: roadmap
description: Decompose a designed product into a dependency-ordered set of epics — each
  with its riskiest assumption — and scaffold the backlog. Greenfield Step 3, between
  system design and /spec. Epics only; spec.md and tickets come just-in-time downstream.
argument-hint: [product-or-version]
allowed-tools: Bash, Read, Glob, Write
---

You turn a *designed* product into a structured backlog **skeleton**: a small set of
vertically-sliced, dependency-ordered **epics**, each carrying the one assumption most
likely to be wrong. You name and order the epics — you do **not** spec them or slice
tickets. Depth is added just-in-time downstream (`/spec` per epic, then `backlog`).

This is **greenfield Step 3**, between the system design (Step 2) and `/spec` (Step 4).
Specs, tickets, and code all hang off the epics you create here.

## Inputs — read the design record first

Read directly from the project's design artifacts; do not ask the user to paste them:

- **design-thinking output** — brief, MVP scope, personas, key flows, and **non-goals**
  (never make an epic for a non-goal).
- **system-design output** — architecture, domain model, API/schema. Its module/service
  seams are the raw material for epic boundaries.

## Method

1. **Decompose into epics.** Each epic is a vertical slice of user value — an *outcome*,
   not a layer. Slice along the architecture's seams so epics are as independent as possible.
2. **Name the riskiest assumption per epic.** The single thing most likely to be wrong that
   would kill or reshape the epic — a technical unknown, an integration, a perf/latency bet,
   a contested domain rule. This is the **spine**: named here → de-risked in `/spec` →
   promoted to an enabler ticket at `backlog` → built first.
3. **Dependency-order.** Record `depends_on`/`blocks`; riskiest/enabling epics first, so the
   uncertainty is attacked early rather than discovered late.
4. **Stay at epic altitude.** Goal + riskiest assumption + dependencies only — **no acceptance
   criteria, no tickets, no spec.** Those are just-in-time, per epic, later. A placeholder epic
   is correct here; depth is added when the epic is pulled into work.

## Architect review

Before persisting, delegate the decomposition to the **`architect`** agent: are these the
right boundaries? does complexity sit in the right epic? are the dependencies real and
acyclic? Fold its verdict back in. (Same agent the Build loop critiques with — different moment.)

## STOP for review

Epic boundaries are high-leverage and expensive to unwind. Present the decomposition —
the epics, their order, and each riskiest assumption — and **STOP for the human to confirm**
before anything is persisted. You are the discriminator here, same as `/spec`'s plan review.

## Outputs — persist via the active tracker

The decomposition judgment is **provider-agnostic**. On approval, `mint` each epic
(`type: epic`) via the active provider — resolve it from `.codemaster/config.json`; contract in
[`plugin/tracker/README.md`](../../tracker/README.md) — in dependency order, recording
`depends_on`/`blocks`. `mint`'s return value is the canonical epic id; never assume the format.

For the default **`folder`** provider, `mint` writes the skeleton into the backlog root:

```
<root>/                  # root from config, e.g. blueprint/v1/backlog
  roadmap.json           # the index: project, version, epics[] — each with id, name, goal,
                         #   riskiest_assumption, depends_on/blocks, and an empty tickets[]
  epics/<id>/            # scaffolded folder per epic, empty until /spec writes spec.md
```

`roadmap.json` validates against the roadmap schema bundled with the `backlog` skill
(`backlog/schema/roadmap.schema.json`) and is checked by the blueprint-conformance rung in
`scripts/ci.sh`. Regenerate the board after minting (the folder provider runs `gen_roadmap.py`).

## Conventions

- **Epic id = kebab-case of the name** (e.g. `daily-pick-loop`) — *not* `<PREFIX>-<n>`; that
  scheme is for tickets. `type: epic`; `status` starts `todo`.
- **Goal is an outcome** ("users can X"), never a task ("build the X endpoint").
- **Exactly one `riskiest_assumption` per epic** — concrete and falsifiable, so `/spec` can
  attack it and `backlog` can promote it.

## Output rules

- All output is **valid JSON** conforming to the roadmap schema; use **real content** derived
  from the design record, never placeholder epics.
- `$ARGUMENTS` is the product/version to decompose; if absent, infer it from the design
  artifacts present and confirm the version before writing.
