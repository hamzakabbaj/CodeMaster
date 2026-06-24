---
name: intake
description: Front door for an out-of-the-blue request — a new feature, idea, change, or bug — whose size and shape are NOT yet decided. Triage the request to the right altitude (one fix/chore · one story · a few stories · epic-sized) and route it — scaffold the ticket(s), or scaffold an epic shell and send it to the spec arc. Use when someone says "I want feature X", "can we add Y", "we should build Z", or files a bug, and it isn't already clear it's a single well-shaped ticket.
argument-hint: [the request, in the user's words]
allowed-tools: Bash, Read, Glob, Write
---

You are the intake lead. A request just arrived "out of the blue" — a feature, an idea, a change, a bug — and **its altitude is not yet decided.** Your job is **triage and routing**, not building: name the right altitude, then either scaffold the ticket(s) or scaffold an epic shell and hand it to the spec arc. You mint *structure* and a recommendation — never feature code, never a spec.

This is the **front door**. Two doors sit behind you, and picking between them is the whole point:
- **[`new-ticket`](../new-ticket/SKILL.md)** — the mechanical "scaffold ONE already-shaped ticket" skill. You delegate to its procedure once you've decided the work is one (or a few) tickets.
- **the heavy arc** — Design-Thinking → System-Design → **`roadmap`** → **`/spec`** (per epic) → **[`backlog`](../backlog/SKILL.md)** (per epic). You route here when the request is epic-sized.

## Step 1 — Understand the request
Restate it in **one sentence** as a user-visible outcome. Then surface the two things that decide altitude:
- **Surface area** — one behavior/screen/endpoint, or many?
- **Unknowns** — is there a **riskiest assumption or architecture decision** that a spec should settle *before* anything is sliced? (This is the decisive test — see Step 2.)

Read what you need to judge this — existing epics via the active tracker (the `list` verb, or the `folder` board `roadmap.json`) and the relevant code — don't ask the user for what you can read.

## Step 2 — Triage to an altitude
Classify against this table. **The dividing line is the last column: real unknowns force escalation, regardless of size.**

| Altitude | Looks like | Route |
|---|---|---|
| **Fix / chore** | a bug, a config/copy/one-file change | **one `fix`/`chore` ticket** under an existing epic |
| **One story** | a feature that's one vertical slice — one screen/endpoint/behavior, no design unknowns | **one `story`** (or `task`) under an existing epic |
| **A few stories** | a feature spanning several independent slices, but **no** architecture unknowns and **no** riskiest assumption | **2–4 stories** (+ an enabler if they share new groundwork), under an existing or new epic |
| **Epic-sized** | new surface area, an architecture decision to make, or a **riskiest assumption** to de-risk | **escalate** — scaffold an epic shell, then `/spec` |

**The escalation test (apply it honestly):** *Is there a riskiest assumption or architecture decision that a spec should settle before slicing?* If **yes → Epic-sized**, even if it feels small. Spec-before-you-slice exists precisely so this work isn't hand-sliced into speculative stories. If **no**, pick the smallest row that fits.

State the verdict and the one-line reason before you create anything.

## Step 3 — Route

### Small (fix / one story / a few stories) → delegate to `new-ticket`
Follow the **[`new-ticket`](../new-ticket/SKILL.md)** procedure for each ticket — it `mint`s the item via the active tracker (id assignment + persistence + registration all belong to the provider; you don't compute ids or write files here). For **a few stories**, put them under the right epic in dependency order (enabler first if one is needed) and record `depends_on`/`blocks`. Each ticket must meet the Definition of Ready (canonical in [`backlog/README.md`](../../../backlog/README.md)).

### Epic-sized → scaffold an epic shell, then send to `/spec`
**Do not hand-slice the feature into stories — there's no spec yet.** Instead, create an **epic** (a `type: epic` item) plus one placeholder spike via the active tracker, then route to `/spec`. How the epic is persisted is the provider's concern: a remote tracker (Plane) `mint`s an epic work-item and links the spike to it as `parent`; the **`folder`** provider appends to `roadmap.json` as below.

**For the `folder` provider:**
1. **Append a new epic** to `epics[]` in `<root>/roadmap.json`. It must be schema-valid **and** carry the fields `scripts/gen_roadmap.py` reads non-optionally, or the generator crashes:
   ```json
   {
     "id": "epic-<slug>",
     "name": "Epic <L> — <Title>",
     "phase": "<L>",            // next FREE letter (A–Z); ad-hoc feature epics use letters, distinct from the numbered roadmap phases
     "short_name": "<Title>",   // name without the "Epic <L> — " prefix
     "track": "A",              // A proving-ground · B plugin · C real-repo — pick per context
     "status": "todo",
     "goal": "<one sentence>",
     "description": "<one sentence; rendered under the epic heading>",
     "exit": "<observable done condition>",
     "tickets": ["CM-<n>"]      // the placeholder spike below
   }
   ```
   Required by schema: `id, name, status, goal, tickets`. Required by the generator on top of that: **`phase`, `short_name`, `track`** (and `description`/`exit` render if present). Confirm the `phase` letter is unused by reading the existing epics first.
2. **Scaffold one placeholder `spike`** via the `new-ticket` procedure — co-located under the new epic at `epics/<epic-id>/tickets/CM-<n>-spec-<slug>/ticket.json`, `type: "spike"`, goal "Spec the <feature> epic (design-thinking as needed → /spec)" — so the work has a home and a next action. Add its id to the epic's `tickets[]` **and** to `board_summaries`.
3. **Regenerate** views: `python3 scripts/gen_roadmap.py && python3 scripts/gen_tickets.py` (the pre-commit hook also does this; running it now catches crashes early).
4. **Recommend the arc**, don't run it: tell the user this is epic-sized and the next step is `/spec` (preceded by design-thinking if the problem/users are themselves unclear). Leave design-thinking, system-design, and the spec to their own skills.

## Step 4 — Confirm
Report: the **altitude verdict + one-line reason**, what you created (ticket ids and/or the epic shell + spike), and the **single next action** (`/start-ticket <n>` for small work, or `/spec` for an epic). **Do not start building** — intake ends at routing.

## Guardrails
- **Triage, don't build.** You mint tickets / an epic shell and a recommendation. Never write feature code or a spec here.
- **Don't fake-slice an epic.** If there are unknowns, the honest output is "new epic → go spec it," not a pile of speculative stories. Promoting the riskiest assumption is the `backlog` skill's job *after* a spec exists, not yours.
- **One concern per ticket** (DoR, [`backlog/README.md`](../../../backlog/README.md)). If a single ticket's acceptance criteria span unrelated changes, split it.
- **Reuse, don't duplicate.** Ticket mechanics come from `new-ticket` → the tracker `mint` verb (id assignment, persistence, registration all belong to the active provider); the DoR and altitude doctrine live in `backlog/README.md`. Point at them; don't restate them.
- **Ids belong to the provider.** `CM-` is CodeMaster's own `folder` backlog; other projects use their own prefix (`TS-`, `ETK-`) or a remote tracker's scheme (`PROJ-123`). The triage is identical; the id/paths follow the active tracker — never hardcode a prefix.
