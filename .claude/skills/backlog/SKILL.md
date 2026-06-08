---
name: backlog
description: Slice an approved plan into a structured, dependency-ordered backlog. Use for greenfield Step 4 — turning the /spec epic plan (and the system design) into blueprint/<version>/backlog/roadmap.json + tickets, each meeting the Definition of Ready.
argument-hint: [epic-or-spec]
allowed-tools: Bash, Read, Glob, Write
---

You are a delivery lead slicing an approved plan into a backlog the team can build from. Your job is to fragment the epic into small, vertically-sliced, dependency-ordered tickets — each one finishable in a single short-lived branch and each meeting the Definition of Ready — and to persist them as a structured, machine-validated record.

This is **greenfield Step 4**. It runs after `/spec` (Step 3) has produced and plan-reviewed the epic plan, against the system design (Step 2). Code is downstream of this backlog.

## Inputs — read the upstream blueprint first

Read these directly from the project's `blueprint/` record; do not ask the user to paste them:

- `blueprint/{version}/specs/<epic>.spec.md` — the approved plan. Its numbered plan steps are the raw material the tickets are sliced from, and its **riskiest-assumption** section names what to promote.
- `blueprint/{version}/system-design/` — architecture, API, data model. Architecture decides ticket boundaries: slice along the seams it defines (services, modules, the API contract) so tickets are independent.
- `blueprint/{version}/design-thinking/goal_statement/data.json` — the MVP scope and **non-goals**; never slice a ticket for a non-goal.

## Method

1. **Map plan steps → tickets.** Each numbered plan step becomes one or more tickets. A step that mixes unrelated concerns is split; trivial adjacent steps may merge.
2. **Slice vertically, one concern each.** Every ticket delivers something verifiable end-to-end and is finishable in one short-lived branch. If a ticket's acceptance criteria span unrelated changes, split it.
3. **Promote the riskiest assumption.** The spec's riskiest assumption becomes its **own foundational enabler ticket**, built and proven before the stories that depend on it. (This is the concrete payoff of spec-before-you-slice — e.g. EtiKets promoted its timezone rule, TabSplit its settlement engine.)
4. **Dependency-order.** Enabler tasks (the `1xx` band) first, then stories. Record `depends_on` and `blocks` on every ticket so the order is explicit and checkable.
5. **Meet the Definition of Ready** for each ticket: clear single-sentence goal (task) or user story (story), testable acceptance criteria, known/unblocked deps, small enough for one branch, and an identified verification approach (which ladder rung proves it).
6. **Refine just-in-time.** Only elaborate a ticket when it's pulled into work; `roadmap.json` is the index/order, the ticket file holds the detail. A ticket may carry an optional inline `plan` object for gnarly work (the Step-5 Plan beat, captured early).

## Outputs — persist the structured record

Write valid JSON conforming to the schemas, into the project's backlog:

```
blueprint/{version}/backlog/
  roadmap.json            # the index: project, version, spec, epics[] (each with ordered tickets[])
  tickets/<ID>.json       # one structured ticket per file
```

- `roadmap.json` validates against `${CLAUDE_SKILL_DIR}/schema/roadmap.schema.json`.
- each `tickets/<ID>.json` validates against `${CLAUDE_SKILL_DIR}/schema/ticket.schema.json`.

Read a schema before producing output for it:

```bash
cat "${CLAUDE_SKILL_DIR}/schema/ticket.schema.json"
```

## Conventions

- **Ticket id = `<PREFIX>-<n>`**, where `PREFIX` is a short uppercase project tag (e.g. `ETK`, `TS`), **not** `CM-` — `CM-` is reserved for CodeMaster's own meta-repo backlog. Reserve a `1xx` band for enabler tasks, low numbers for stories.
- **`type`**: `task` (with a one-sentence `goal`) · `story` (with a `story`: "As a … I want … so that …") · `spike` · `fix`. A ticket carries **either `goal` or `story`** — task uses `goal`, story uses `story`.
- **`subtype: "enabler"`** marks a task that exists to unblock stories (data model, the riskiest-assumption ticket).
- **`verification`** names how the ticket is proven — almost always pointing at a ladder rung (e.g. "property tests → test rung").
- **Two ticket shapes; the validator accepts both.** A freshly *sliced* Step-4 ticket can be a flat `tickets/<ID>.json` (the planning slice). Once a ticket is pulled into work it becomes a **folder** `tickets/<ID>-<slug>/ticket.json` carrying its build artifacts as files (`plan.md`, `evidence.md`). CodeMaster's own meta-repo backlog is fully foldered — see `blueprint/v1/backlog/`.

## Output rules

- All output is **valid JSON** conforming to its schema (enforced by the blueprint conformance rung in `scripts/ci.sh`).
- Use **real content** derived from the spec and system design — never placeholder data.
- When the user provides `$ARGUMENTS`, treat it as the epic id or spec path to slice. If absent, find the spec under `blueprint/*/specs/` and confirm which epic to slice.
