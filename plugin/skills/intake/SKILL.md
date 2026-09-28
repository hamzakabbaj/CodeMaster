---
name: intake
description: Front door for an out-of-the-blue request — a new feature, idea, change, or bug — whose size and shape are NOT yet decided. Triage the request to the right altitude (one fix/chore · one story · a few stories · epic-sized) and route it — scaffold the ticket(s), or scaffold an epic shell and send it to the spec arc. Use when someone says "I want feature X", "can we add Y", "we should build Z", or files a bug, and it isn't already clear it's a single well-shaped ticket.
argument-hint: [the request, in the user's words — or empty to pull from the tracker's inbox]
allowed-tools: Bash, Read, Glob, Write
---

You are the intake lead. A request just arrived "out of the blue" — a feature, an idea, a change, a bug — and **its altitude is not yet decided.** Your job is **triage and routing**, not building: name the right altitude, then either scaffold the ticket(s) or scaffold an epic shell and hand it to the spec arc. You mint *structure* and a recommendation — never feature code, never a spec.

This is the **front door**. Two doors sit behind you, and picking between them is the whole point:
- **small → [`new-ticket`](../new-ticket/SKILL.md)** — mint one (or a few) already-shaped tickets **under a parent epic**. You delegate to its procedure once the work is clearly one-to-a-few tickets.
- **epic-sized → `mint` one epic, then `/spec`** — when the request needs a spec before slicing. This mints a **single** epic and routes to `/spec`; it **bypasses `roadmap`** (roadmap decomposes a whole *designed* product into many epics — intake adds just one). `backlog` slices it later.

## Step 0 — Where the request comes from
A request reaches you two ways:
- **Direct** — the user describes it (`$ARGUMENTS`). The default.
- **From the inbox** — if the active provider has an incoming-report queue (`inbox_list` returns
  items; **Plane's Intake module** is one), pull the **pending** reports and triage each. For every
  item, run Steps 1–3 below, then **`inbox_resolve(<intake_id>, <decision>)`**: `accept` it (→ route
  into the backlog as usual) or `decline` / `snooze` / `duplicate` if it's not actionable. Accepting
  is what promotes a user's raw report into real, tracked work. Providers without a queue
  (`folder`) skip this — requests only ever arrive direct.

## Step 1 — Understand the request
Restate it in **one sentence** as a user-visible outcome. Then surface the two things that decide altitude:
- **Surface area** — one behavior/screen/endpoint, or many?
- **Unknowns** — is there a **riskiest assumption or architecture decision** that a spec should settle *before* anything is sliced? (This is the decisive test — see Step 2.)

Read what you need to judge this — existing epics via the active tracker (the `list` verb, or the `folder` board `roadmap.json`) and the relevant code — don't ask the user for what you can read.

## Step 2 — Triage to an altitude
Classify against this table. **The dividing line is the last column: real unknowns force escalation, regardless of size.**

| Altitude | Looks like | Route |
|---|---|---|
| **Fix / chore** | a bug, a config/copy/one-file change | **one `fix`/`chore` ticket** under the relevant existing epic — or the catch-all **`maintenance`** epic if none fits |
| **One story** | a feature that's one vertical slice — one screen/endpoint/behavior, no design unknowns | **one `story`** (or `task`) under the relevant existing epic |
| **A few stories** | a feature spanning several independent slices, but **no** architecture unknowns and **no** riskiest assumption | **2–4 stories** (+ an enabler if they share new groundwork), under the relevant existing epic |
| **Epic-sized** | new surface area, an architecture decision to make, or a **riskiest assumption** to de-risk | **escalate** — `mint` one epic, then `/spec` |

**The escalation test (apply it honestly):** *Is there a riskiest assumption or architecture decision that a spec should settle before slicing?* If **yes → Epic-sized**, even if it feels small. Spec-before-you-slice exists precisely so this work isn't hand-sliced into speculative stories. If **no**, pick the smallest row that fits.

State the verdict and the one-line reason before you create anything.

## Step 3 — Route

Every ticket lives **under a parent epic** — there is no flat ticket bucket. So routing always resolves a parent epic first, then mints through the active tracker (id assignment, persistence, and registration all belong to the provider; you never compute ids or write backlog files by hand).

### Small (fix / one story / a few stories) → `new-ticket` under a parent epic
1. **Resolve the parent epic.** Pick the existing epic the work belongs to (via the `list` verb / the `folder` board `roadmap.json`). If it's a fix/chore that fits **no** existing epic, use the standing **`maintenance`** epic — and if that epic doesn't exist yet, `mint` it once (`type: epic`, goal "Standing home for ad-hoc fixes and chores that don't belong to a feature epic"). **Don't spawn a micro-epic per fix.**
2. **Mint the ticket(s)** via the **[`new-ticket`](../new-ticket/SKILL.md)** procedure with `parent` = that epic id. For **a few stories**, order them (enabler first if one is needed) and record `depends_on`/`blocks`. Each must meet the Definition of Ready ([`definitions.md`](../../definitions.md)).

### Epic-sized → `mint` one epic, then send to `/spec`
**Do not hand-slice the feature into stories — there's no spec yet.** Instead:
1. **`mint` the epic** (`type: epic`) via the active tracker, with a one-sentence `goal` and a first-cut `riskiest_assumption` (what a spec must settle). The provider assigns the id and scaffolds its home — the `folder` provider adds the `epics[]` entry **and** `epics/<epic-id>/`; a remote tracker (Plane) mints an epic work-item. **Don't hand-write `roadmap.json`** — the `mint` verb owns that.
2. **Mint one placeholder `spike`** under the new epic via `new-ticket` (`parent` = the epic id, `type: spike`, goal "Spec the <feature> epic (design-thinking as needed → /spec)") — so the work has a home and a next action.
3. **Recommend the arc**, don't run it: tell the user this is epic-sized and the next step is `/spec` (preceded by design-thinking if the problem/users are themselves unclear). Leave design-thinking, system-design, and the spec to their own skills.

## Step 4 — Confirm
Report: the **altitude verdict + one-line reason**, what you created (ticket ids and/or the epic shell + spike), and the **single next action** (`/start-ticket <n>` for small work, or `/spec` for an epic). **Do not start building** — intake ends at routing.

## Guardrails
- **Triage, don't build.** You mint tickets / an epic shell and a recommendation. Never write feature code or a spec here.
- **Don't fake-slice an epic.** If there are unknowns, the honest output is "new epic → go spec it," not a pile of speculative stories. Promoting the riskiest assumption is the `backlog` skill's job *after* a spec exists, not yours.
- **One concern per ticket** (DoR, [`definitions.md`](../../definitions.md)). If a single ticket's acceptance criteria span unrelated changes, split it.
- **Reuse, don't duplicate.** Ticket mechanics come from `new-ticket` → the tracker `mint` verb (id assignment, persistence, registration all belong to the active provider); the DoR lives in [`definitions.md`](../../definitions.md) and the altitude table is Step 2 above. Point at them; don't restate them.
- **Ids belong to the provider.** `CM-` is CodeMaster's own `folder` backlog; other projects use their own prefix (`TS-`, `ETK-`) or a remote tracker's scheme (`PROJ-123`). The triage is identical; the id/paths follow the active tracker — never hardcode a prefix.
