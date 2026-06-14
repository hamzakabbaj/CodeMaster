---
name: build
description: Implement ONE Ready ticket on its branch via the robust-code loop — plan → (generate → verify → checkpoint → critique) until acceptance criteria are met and the ladder is green. Runs after /start-ticket has branched. Stops at green; it does NOT open the PR (that's ship).
argument-hint: [CM-n]
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, Workflow, Agent
---

You are the engineer running the robust-code loop on ONE Ready ticket, on its branch. Your output is working, verified code checkpointed green — **not** a PR. Ship is a separate step; build stops at green.

This is the **robust-code loop**. It runs after `/start-ticket` has cut the branch and flipped status to in-progress.

## Preconditions (assert, don't assume)
- On `feat/CM-<n>-<slug>` (NOT `main`). If on `main`, stop — run `/start-ticket CM-<n>` first.
- The ticket is **Ready** (DoR met): confirm the acceptance criteria are testable and the scope is **one concern**. If you can't reach Ready because of unknowns, **spike — don't start blind.**
- You have the epic brief (`epics/<epic-id>/spec.md`, a repo file) the ticket was sliced from, and the ticket body — read it via the tracker `read` verb (the active provider; see [`plugin/tracker/README.md`](../../tracker/README.md)). Don't assume a folder path; a remote tracker has no `ticket.json`.

## Beat 1 — Plan the implementation (ALWAYS)
Even if it's a sentence. Fidelity scales with **risk × uncertainty**, and three conditional hatches kick in by the *type* of uncertainty — each recovers or produces something the plan then uses. Most tickets need none of them; reach for a hatch only when its uncertainty is real.
- **Most tickets** inherit the epic's `/spec` brief — a short in-head sketch is enough.
- **Terrain uncertainty** (the code you're about to change isn't in your context: brownfield, or grown greenfield where early code has fallen out of the window) → send the **`code-explorer`** agent to recover the map — execution paths, dependencies, **blast radius** — *before* you plan. Its map feeds the plan (and `/spec`, if you also run it). For a **brownfield** change, also **pin the existing behaviour with characterization tests before you touch it**, so a regression is loud, not silent.
- **Logic uncertainty** (gnarly) → run `/spec CM-<n>` at ticket altitude and save it as `plan.md` beside the ticket.
- **Design uncertainty** (the ticket sets `needs_design: true`, **or** you judge it implies an open visual/interaction decision) → run `/design-options CM-<n>`: it generates a 2–3 variant `.html` gallery in gitignored `prototypes/` (via the `frontend-design` skill, or direct HTML/CSS if that plugin isn't installed), **stops for the user to pick**, and records the choice in `plan.md`. The chosen variant is then built **for real** with the project's components. Skip it when the system design's design system already dictates the look.

These compose: a brownfield UI change can recover the map (`code-explorer`) *and* pick a variant (`/design-options`) before the plan is written.

Sketch the change across layers (backend / frontend / data), the files each touches, the order, and which **ladder rung** verifies each — test-first where it fits. Use **plan mode** to attack the approach before code exists.

## Beat 2 — The loop: generate → verify → checkpoint → critique
Repeat until the acceptance criteria are met and the ladder is green:

1. **Generate** the next increment against the plan.
2. **Verify (the gate):** `sh scripts/ci.sh` — fail-fast, cheapest rung first. Red? Fix, or `git restore` back to the last checkpoint. **Never advance on red.**
3. **Checkpoint on green:** `scripts/checkpoint.sh "<conventional subject>"`. It re-runs the ladder and refuses on red or on `main`, so every checkpoint is a revertible safe point.
4. **Critique** (at meaningful green points — **at minimum once before you consider the ticket done**; more often when `risky`/`gnarly`): invoke the **`build-critique`** workflow on the branch diff (see *Critique wiring*). Then, **as the discriminator**:
   - **Act on `high`/`critical` findings now** — fix and re-enter the loop. Triage, don't rubber-stamp.
   - **Defer `low`/`nit`** to `ship`'s reviewer — don't rabbit-hole on polish mid-loop.
   - **Add the workflow's `proposed_tests`** and re-enter the loop (test-first).
   - A trivial increment may substitute a single inline `tester` pass for the full workflow.

## Beat 3 — The feedback arrow (don't scope-creep)
Building ticket N is where you discover ticket N+3 — the edge case, the missing concern. When you find one: **park it as a NEW ticket via `feature-intake` — do not widen this branch.** One concern per branch keeps the PR focused; the parked ticket is refined when *it* is pulled.

## Critique wiring — the flags the skill computes and passes to `build-critique`
Compute these from **deterministic-ish signals**, then pass them as the workflow's `args`:
- **`gnarly`** = the ticket carries a **`plan.md`** (it earned ticket-altitude planning).
- **`risky`** = the diff touches any of: **auth/authz · input parsing/deserialization · secrets/env · shell/exec · file I/O on untrusted paths · network/external calls · crypto**. **When uncertain, pass `risky: true`** — a security pass is cheap insurance.

```
Workflow({ scriptPath: ".claude/workflows/build-critique.mjs",
           args: { base: "main", risky: <computed>, gnarly: <computed> } })
```

| Lens (the workflow includes it when…) | Purpose |
|---|---|
| `tester` — always | edge cases the AC missed + concrete tests to add |
| `security` — `risky: true` | injection, secrets, untrusted input, authz, blast radius |
| `architect` — `gnarly: true` | wrong-layer choices, coupling, abstractions that will rot |
| `reviewer` — **never here** | diff review belongs to `ship` |

## Exits
- **AC met + ladder green → STOP.** Hand off to `ship`. Build does **not** open the PR.
- Grew too big mid-build → stop, split via `feature-intake`.
- Can't reach Ready / blocked on an unknown → spike it.

## Guardrails
- **Never checkpoint on red; never `git commit --no-verify`** (a PreToolUse hook blocks it anyway).
- **One concern per branch.** The cage — `ci.sh` + `checkpoint.sh` + the commit hooks — stays on the whole time. Guarantees come from the cage, not from remembering to be careful.
- **Build ends at green.** Opening the PR, automated + human review, merge, and flipping the ticket to `done` are `ship`'s job.
- **Reuse, don't restate.** Branch via `/start-ticket`, plan a gnarly ticket via `/spec`, verify via `ci.sh`, checkpoint via `checkpoint.sh`, park discoveries via `feature-intake` — point at them; don't reimplement them here.
