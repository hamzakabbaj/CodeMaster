---
name: new-ticket
description: Scaffold ONE already-shaped work item (a ticket) via the active tracker and register it in the backlog. Use when it's already clear the work is a single, well-formed ticket. If the request is out of the blue and its size/shape is undecided (a feature, idea, or bug that might be several stories or a whole epic), use intake first to triage the altitude.
---

# new-ticket

Create one well-formed work item so every ticket meets the Definition of Ready. **Where** the
item lives — repo folders, Plane, … — is decided by the active **tracker provider**, not by this
skill. This skill owns the *shaping* (DoR); the provider owns the *persistence*.

> **Scope:** this skill mints **one ticket whose shape is already decided.** It does **not** triage
> altitude — if you don't yet know whether the request is one ticket, several stories, or an epic,
> start at [`intake`](../intake/SKILL.md) (the front door), which routes back here for
> the small cases.

## Resolve the tracker (do this first)
1. Read `.codemaster/config.json` at the repo root → its `tracker` field (default `folder` if the
   file is absent).
2. Load that provider's verb mechanics: **`.codemaster/provider.md`** if present (materialized by
   `tracker init`), else the bundled `plugin/tracker/providers/<tracker>.md`. The provider defines how
   `mint` actually persists and how the `id` is assigned. The contract is in
   [`plugin/tracker/README.md`](../../tracker/README.md).

## Steps
1. **Gather inputs** (ask only for what's missing): title, epic/parent, type (`task|story|spike|fix`),
   `goal` (one sentence, for a task) **or** `story` ("As a … I want … so that …", for a story), and
   testable `acceptance_criteria`.
2. **`mint` the item** via the active provider. Pass the vocabulary fields; the provider assigns the
   `id`, persists the item at initial status `todo`, and (for `folder`) registers it on the board.
   **Treat the provider's returned `id` as the source of truth** — don't assume a prefix or pre-compute it.
3. **Confirm** the returned `id` and where it now lives. Do not start work — creating ≠ starting (that's
   `/start-ticket`).

## Guardrails
- One concern per ticket. If acceptance criteria span unrelated changes, suggest splitting.
- Keep detail just-in-time: a placeholder-only ticket is fine until it's pulled into work.
- **Status and persistence belong to the provider**, never to this skill — call `mint`/`transition`,
  don't hand-edit a board or a backend. The `folder` provider's board (`ROADMAP.md`) is generated; never edit it by hand.
