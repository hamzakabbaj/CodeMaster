---
name: backlog
description: Slice one approved epic into a dependency-ordered set of Ready tickets. Runs after the epic's /spec, before start-ticket — turning that epic's /spec brief into tickets under an epic the roadmap already created, each meeting the Definition of Ready. Does not create epics.
argument-hint: [epic-or-spec]
allowed-tools: Bash, Read, Glob, Write
---

You are a delivery lead slicing **one approved epic** into a backlog the team can build from. Your job is to fragment that epic into small, vertically-sliced, dependency-ordered tickets — each one finishable in a single short-lived branch and each meeting the Definition of Ready — and to persist them as a structured, machine-validated record.

The epic **already exists** — `roadmap` created it and named its riskiest assumption; `/spec` then produced and plan-reviewed that epic's brief, against the system design. You slice **one** epic into tickets — **you do not create epics.** Code is downstream of this backlog.

## Inputs — read the upstream blueprint first

Read these directly from the project's `blueprint/` record; do not ask the user to paste them:

- **`read_doc(<epic-id>, "spec")`** — the approved epic brief (from `/spec`), via the active tracker. Its **Approach** and **Validating outcome** are the raw material the tickets are sliced from, and its **sharpened riskiest assumption** names what to promote to an enabler.
- `blueprint/{version}/system-design/` — architecture, API, data model. Architecture decides ticket boundaries: slice along the seams it defines (services, modules, the API contract) so tickets are independent.
- `blueprint/{version}/design-thinking/goal_statement/data.json` — the MVP scope and **non-goals**; never slice a ticket for a non-goal.

## Method

1. **Map plan steps → tickets.** Each numbered plan step becomes one or more tickets. A step that mixes unrelated concerns is split; trivial adjacent steps may merge.
2. **Slice vertically, one concern each.** Every ticket delivers something verifiable end-to-end and is finishable in one short-lived branch. If a ticket's acceptance criteria span unrelated changes, split it.
3. **Promote the riskiest assumption.** The epic's `riskiest_assumption` (named at `roadmap`, sharpened in `/spec`) becomes its **own foundational enabler ticket**, built and proven before the stories that depend on it. (This is the concrete payoff of naming risk before you slice — e.g. EtiKets promoted its timezone rule, TabSplit its settlement engine.)
4. **Dependency-order.** Enablers first (marked `subtype: enabler`), then the stories that depend on them. Record `depends_on`/`blocks` on every ticket — the build *order* lives in those edges, **never in the id**.
5. **Meet the Definition of Ready** for each ticket — the canonical DoR lives in [`backlog/README.md`](../../../backlog/README.md) (single source of truth); the checklist below is a view of it, not a separate definition: clear single-sentence goal (task) or user story (story), testable acceptance criteria, known/unblocked deps, small enough for one branch, and an identified verification approach (which ladder rung proves it).
6. **Refine just-in-time.** Only elaborate a ticket when it's pulled into work; `roadmap.json` is the index/order, the ticket file holds the detail. A ticket may carry an optional inline `plan` object for gnarly work (the Step-5 Plan beat, captured early).

## Outputs — persist via the active tracker

The slicing judgment here (vertical slices, dependency order, promoted enabler) is
**provider-agnostic**. Persist each sliced ticket with the tracker `mint` verb — id assignment,
storage, and registration belong to the active provider (resolve it from `.codemaster/config.json` —
**absent → stop and send the user to `/codemaster-init`**, there is no silent default; contract in
[`plugin/tracker/README.md`](../../tracker/README.md)). The epic **already exists**
(minted by `roadmap`) — **do not create epics.** `mint` each sliced ticket with `parent` = the
epic id, in dependency order, recording `depends_on`/`blocks`.

**For the default `folder` provider**, `mint` writes the structured JSON backlog:

```
<root>/                                       # root from config, e.g. blueprint/v1/backlog
  roadmap.json                                # the index: project, version, epics[] (each with ordered tickets[])
  epics/<epic-id>/                            # the epic roadmap minted; spec.md from /spec
    tickets/<ID>-<slug>/ticket.json           # each sliced ticket, co-located under its epic
```

- `roadmap.json` validates against `${CLAUDE_SKILL_DIR}/schema/roadmap.schema.json`.
- each ticket validates against `${CLAUDE_SKILL_DIR}/schema/ticket.schema.json`.

Read a schema before producing output for it:

```bash
cat "${CLAUDE_SKILL_DIR}/schema/ticket.schema.json"
```

## Conventions

- **Ticket id = `<PREFIX>-<n>`**, assigned by the tracker as a plain **monotonic** counter (`1, 2, 3, …`) — the id is just an identifier and carries **no** meaning. `PREFIX` is a short uppercase project tag (e.g. `ETK`, `TS`), **not** `CM-` (reserved for CodeMaster's own meta-repo backlog). **Don't reserve number bands** (e.g. a `1xx` band for enablers): it collides once a project passes 99 tickets, and it fights the folder provider's `max+1` minter (after a `101` exists, the next id is `102`, not `3`). Encode the role and order in fields, not the number.
- **`type`**: `task` (with a one-sentence `goal`) · `story` (with a `story`: "As a … I want … so that …") · `spike` · `fix`. A ticket carries **either `goal` or `story`** — task uses `goal`, story uses `story`.
- **`subtype: "enabler"`** is the **only** marker of an enabler — a task that exists to unblock stories (data model, the riskiest-assumption ticket). It's built first by its `depends_on` edges, not by a special id range.
- **`verification`** names how the ticket is proven — almost always pointing at a ladder rung (e.g. "property tests → test rung").
- **Each ticket is a folder, co-located under its epic.** `mint` writes `epics/<epic-id>/tickets/<ID>-<slug>/ticket.json`; the same folder later carries the ticket's build artifacts as files (`plan.md`, `evidence.md`). Everything about one epic — its `spec.md` and all its tickets — lives in `epics/<epic-id>/`.

## Output rules

- All output is **valid JSON** conforming to its schema (enforced by the blueprint conformance rung in `scripts/ci.sh`).
- Use **real content** derived from the spec and system design — never placeholder data.
- When the user provides `$ARGUMENTS`, treat it as the epic id to slice. If absent, `list` the epics via the active tracker and confirm which one to slice.
