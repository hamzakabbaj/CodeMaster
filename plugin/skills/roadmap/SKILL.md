---
name: roadmap
description: Lay out the structure above tickets. With no epic id, decompose a designed product into a dependency-ordered set of epics, each with its product-level riskiest assumption. With an epic id, break that one epic into 2–5-story features, just-in-time, when it's pulled into work. Structure only — specs and tickets come downstream (/spec, backlog).
argument-hint: "[product-or-version]  |  <epic-id>"
allowed-tools: Bash, Read, Glob, Write, Agent
---

You lay out the **structure above tickets** — the epics of a product, or the features of one epic.
You name, order, and state the riskiest assumption of each item; you do **not** spec them or slice
tickets. Depth is added just-in-time downstream: `/spec` per feature (only when it has an unknown),
then `backlog` slices a feature into tickets.

The levels and their rules live in the tracker contract
([`../../tracker/README.md`](../../tracker/README.md#the-hierarchy--epic--feature--ticket)).

## Pick the mode from `$ARGUMENTS`

| `$ARGUMENTS` | Mode | Output |
|---|---|---|
| empty, or a product/version | **Product → epics** | a small set of epics for the whole product |
| an epic id (`read` returns `type: epic`) | **Epic → features** | the features of that one epic |

Either way, resolve the tracker from `.codemaster/config.json` first (**absent → stop and send the
user to `/codemaster-init`**; there is no silent default).

## Mode A — product → epics

**Inputs** — read the design record directly; don't ask the user to paste it:
- **design-thinking output** — brief, MVP scope, personas, key flows, and **non-goals** (never make
  an epic for a non-goal).
- **system-design output** — architecture, domain model, API/schema. Its module/service seams are the
  raw material for epic boundaries.

**Method:**
1. **Decompose into epics.** Each is a product area or big outcome — a vertical slice of user value,
   not a layer. Slice along the architecture's seams so epics are as independent as possible.
2. **Name one riskiest assumption per epic** — the **product-level** bet most likely to be wrong
   (will users do X? does the integration hold at our scale?). It decides which of the epic's features
   goes first when the epic is broken down.
3. **Dependency-order** with `depends_on`/`blocks`; riskiest/enabling epics first.
4. **Stay at epic altitude.** Goal + riskiest assumption + dependencies only. **Don't list features
   yet** — that's Mode B, when the epic is pulled; a feature list written months early goes stale.

## Mode B — epic → features (just-in-time)

**Inputs:** `read` the epic (goal, riskiest assumption, dependencies), `list(parent: <epic-id>)` for
anything already under it (features, or loose tickets that belong in a feature), plus the design
record and the relevant code.

**Method:**
1. **Decompose into features.** Each is one shippable capability of **2–5 stories**. Bigger than
   that → it's two features; one story → it's a ticket, not a feature. Absorb loose tickets already
   under the epic into the feature they belong to (re-parent them).
2. **Riskiest assumption per feature — only when there is one.** A feature with an open design or
   technical question (a new integration, a perf bet, an unsettled UI flow, a contested rule) carries
   that question as its `riskiest_assumption` → it gets a `/spec`. A feature with **no** real unknown
   carries none → it goes straight to `backlog`. Don't invent a risk to look thorough.
3. **Order the features** so the one that tests the epic's riskiest assumption comes first; record
   `depends_on`/`blocks`.

## Architect review

Before persisting (either mode), send the **`architect`** agent the decomposition: are these the
right boundaries? does complexity sit in the right item? are the dependencies real and acyclic?
Fold its verdict back in.

## STOP for review

Boundaries are high-leverage and expensive to unwind. Present the items, their order, and each
riskiest assumption, and **STOP for the human to confirm** before anything is persisted.

## Persist via the active tracker

On approval, `mint` each item in dependency order — `type: epic` (Mode A, no parent) or
`type: feature` with `parent: <epic-id>` (Mode B) — with its `goal`, `riskiest_assumption` (when it
has one), and `depends_on`/`blocks`. `mint`'s return value is the canonical id; never assume a
format. Contract: [`../../tracker/README.md`](../../tracker/README.md).

## Conventions

- **Goal is an outcome** ("users can X"), never a task ("build the X endpoint").
- **At most one `riskiest_assumption` per item** — concrete and falsifiable, so `/spec` can attack
  it and `backlog` can promote it.
- Use **real content** derived from the design record, never placeholder items.

## Next action

Mode A → `roadmap <epic-id>` for the first epic. Mode B → for each feature, in order: `/spec
<feature-id>` if it has a riskiest assumption, else `backlog <feature-id>`.
