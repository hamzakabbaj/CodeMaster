---
name: frame
description: Frame ONE Ready ticket before the build loop — gate it (DoR → refine/spike/split), ground in the real code, plan if it's gnarly, and design the acceptance tests that define "done" — then STOP at the done-contract for review. Runs after /start-ticket, before build. Deliberate and human-gated; it writes no product code.
argument-hint: [ticket-id]
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, Agent
---

You are setting ONE Ready ticket up to be built **correctly**, on its branch. Frame is the
*deliberate* half of build: it establishes the ground truth and makes "done" an executable target,
then **stops for review.** The autonomous loop (`build`) runs after, against the contract you
produce here. **Frame writes no product code.**

This runs after `/start-ticket` has cut the branch. Its output is a **done-contract** — a plan (if
the work is gnarly) plus the acceptance tests — co-located in the ticket's folder, reviewed before
any code exists.

## Preconditions
- On `feat/<id>-<slug>` (NOT `main`). If on `main`, stop — run `/start-ticket <id>` first.
- `read` the ticket via the active tracker ([`plugin/tracker/README.md`](../../tracker/README.md))
  and `read_doc(<epic-id>, "spec")` for the epic brief this ticket sits in.

## 1. DoR gate → refine / spike / split
Confirm the ticket is **Ready** against the [Definition of Ready](../../definitions.md): acceptance
criteria are testable, and the scope is **one concern**.
If it isn't, don't push forward blind — take the escape that fits:
- **vague** → *refine* the AC until they're checkable.
- **unknown** → *spike* (a timeboxed investigation) — don't start building on an unknown.
- **too big** → *split* via `intake`; frame one slice.

These exits leave the loop entirely — you only proceed past here on a genuinely Ready ticket.

## 2. Ground — load the real code
If the code you're about to change **isn't already in your working context** (brownfield, or grown
greenfield where early code has fallen out of the window), send the **`code-explorer`** agent to
recover the map — execution paths, dependencies, **blast radius** — *before* you plan. Reach for it
only when the uncertainty is real (the code isn't in context); most small changes need no map. For a
**brownfield** change, also **pin the existing behaviour with characterization tests** before you
touch it, so a regression is loud, not silent.

## 3. Plan (if gnarly → a `plan` doc)
Fidelity scales with **risk × uncertainty**. Most tickets inherit the epic's `/spec` brief — a short
in-head sketch is enough. When the work is gnarly, sketch the change across layers (backend /
frontend / data), the files each touches, the order, and **which ladder rung verifies each** — then
persist it via **`attach_doc(<id>, "plan", …)`**. Two conditional forks, taken only when their
uncertainty is real:
- **3b. Design fork — `/design-options <id>`** *(when an open UI/interaction decision exists)*:
  generates a 2–3 variant gallery, **stops for the user to pick**, and records the choice in its own
  **`attach_doc(<id>, "design-options", …)`** slot — chosen variant, why, why-not, and the consequence
  build must honour. Skip it when the system design's design system already dictates the look.
- **3c. Approach fork — `architect` agent** *(when the approach itself is hard)*: review the design
  before code — wrong-layer choices, coupling, abstractions that will rot. Capture the verdict via
  **`attach_doc(<id>, "architecture", …)`**.

## 4. Design the acceptance tests (the done-contract)
Send the **`test-designer`** agent to design the **acceptance tests from the ticket's acceptance
criteria** — derived from the AC, **independent of any implementation**, so they assert what the
ticket *requires*, not what code happens to do. Persist its proposal via
**`attach_doc(<id>, "acceptance-tests", …)`**: the human-readable contract for "done".

> These stay **text** here — `test-designer` is read-only. The build loop `read_doc`s them and
> transcribes them into **executable** tests **test-first** (red) before writing code; the frozen,
> reviewed contract is what keeps that transcription honest (not reverse-engineered from the code).

## 5. STOP at the done-contract
Present the plan (if any) and the acceptance tests, and **stop for review.** This is the cheapest
place to catch a wrong target — you're the discriminator. Only after approval does `build` run.

## Outputs — via the tracker, never committed
Attach to the ticket via `attach_doc`: `design-options` (if the design fork ran), `plan` (if gnarly),
`architecture` (if the architect ran), `acceptance-tests` (always — the contract). The provider
decides where they live (folder → a gitignored local file; plane → the card). Also `transition` any
DoR refinements onto the ticket. The `/design-options` gallery itself lives in gitignored
`prototypes/` — only the *decision* is recorded, in the `design-options` slot.

> **A slot you left empty is a statement.** No `architecture` doc means no boundary moved; no
> `design-options` doc means there was no open UI choice. Don't attach an empty one to look complete.

## Guardrails
- **Frame writes no product code** and opens no PR. It ends at the done-contract; `build` does the
  rest. If you can't reach a Ready, reviewable contract, the honest output is *spike* or *split*.
- **Reach for a fork only when its uncertainty is real.** code-explorer (code not in context),
  design-options (an open UI decision), architect (a hard approach) — each is a hatch, not a step.
