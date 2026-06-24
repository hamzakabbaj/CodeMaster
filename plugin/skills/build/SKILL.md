---
name: build
description: Implement ONE framed ticket on its branch via the robust-code loop — generate (test-first) → verify → checkpoint → critique until the acceptance tests pass and the ladder is green. Runs after /frame has produced the done-contract. Stops at green; it does NOT open the PR (that's ship).
argument-hint: [ticket-id]
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, Workflow, Agent
---

You are the engineer running the robust-code loop on ONE framed ticket, on its branch. Your output
is working, verified code checkpointed green — **not** a PR. `build` is the *autonomous* half:
`frame` set the target (plan + acceptance tests); you drive the code to it. Ship is separate; build
stops at green.

## Preconditions (assert, don't assume)
- On `feat/<id>-<slug>` (NOT `main`). If on `main`, stop — run `/start-ticket <id>` first.
- **The done-contract exists.** `frame` must have run: the ticket's `acceptance-tests.md` is present
  beside the ticket (and `plan.md` if it was gnarly). **If the contract is missing, stop — run
  `/frame <id>` first.** Build does not invent the target; it builds to a reviewed one.
- Read the ticket via the tracker `read` verb and the done-contract (`acceptance-tests.md`,
  `plan.md`) before generating. Don't assume a folder path; a remote tracker has no `ticket.json`.

## The loop: generate → verify → checkpoint → critique
Repeat until the acceptance tests pass and the ladder is green:

1. **Generate (test-first).**
   a. **Transcribe `acceptance-tests.md` → executable tests** in the project's suite (they go
      **RED** — no code yet). This is faithful transcription of the frozen contract, not invention
      from the code. *(Skip for any case already encoded.)*
   b. **Write the next increment of code** against the plan, driving those tests toward **GREEN**.
   c. Add the **dev/unit/scaffolding tests** the increment needs.
2. **Verify (the gate):** `sh scripts/ci.sh` — fail-fast, cheapest rung first. **Red? Fix, or
   `git restore` back to the last checkpoint. Never advance on red.**
3. **Checkpoint on green:** `scripts/checkpoint.sh "<conventional subject>"`. It re-runs the ladder
   and refuses on red or on `main`, so every checkpoint is a revertible safe point.
4. **Critique** (at meaningful green points — **at minimum once before you consider the ticket
   done**; more often when `risky`/`gnarly`): invoke the **`build-critique`** workflow on the branch
   diff (see *Critique wiring*). Then, **as the discriminator**:
   - **Act on `high`/`critical` findings now** — fix and re-enter the loop. Triage, don't rubber-stamp.
   - **Defer `low`/`nit`** to `ship`'s reviewer — don't rabbit-hole on polish mid-loop.
   - **Add the workflow's `proposed_tests`** (the `test-designer` lens's edge cases) and re-enter
     the loop (test-first).
   - A trivial increment may substitute a single inline `test-designer` pass for the full workflow.
   - **Record the trail in `evidence.md`** (beside the ticket): which lenses ran, the surviving
     findings, and what you acted on vs. deferred to `ship`. One durable evidence file per the
     CodeMaster convention — *not* a separate `security.md` / `architect-review.md` / `edge-cases.md`
     per lens (those go stale the moment you act on them). This is the trail `ship`'s reviewer reads.

If the code you're touching drifts out of context mid-loop, **re-ground** with the `code-explorer`
agent — `frame` did the first pass, but the loop can recover the map again when needed.

## The feedback arrow (don't scope-creep)
Building ticket N is where you discover ticket N+3 — the edge case, the missing concern. When you
find one: **park it as a NEW ticket via `intake` — do not widen this branch.** One concern
per branch keeps the PR focused; the parked ticket is refined when *it* is pulled.

## Critique wiring — the flags the skill computes and passes to `build-critique`
Compute these from **deterministic-ish signals**, then pass them as the workflow's `args`:
- **`gnarly`** = the ticket carries a **`plan.md`** (it earned ticket-altitude planning in frame).
- **`risky`** = the diff touches any of: **auth/authz · input parsing/deserialization · secrets/env
  · shell/exec · file I/O on untrusted paths · network/external calls · crypto**. **When uncertain,
  pass `risky: true`** — a security pass is cheap insurance.

```
Workflow({ scriptPath: ".claude/workflows/build-critique.mjs",
           args: { base: "main", risky: <computed>, gnarly: <computed> } })
```

| Lens (the workflow includes it when…) | Purpose |
|---|---|
| `test-designer` — always | edge cases the acceptance tests missed + concrete tests to add |
| `security` — `risky: true` | injection, secrets, untrusted input, authz, blast radius |
| `architect` — `gnarly: true` | wrong-layer choices, coupling, abstractions that will rot |
| `reviewer` — **never here** | diff review belongs to `ship` |

## Exits
- **Acceptance tests pass + ladder green → STOP.** Hand off to `ship`. Build does **not** open the PR.
- Grew too big mid-build → stop, split via `intake`.
- Contract turned out wrong / blocked on an unknown → back to `frame` (or spike). Build doesn't
  rewrite the target on the fly.

## Guardrails
- **Never checkpoint on red; never `git commit --no-verify`** (a PreToolUse hook blocks it anyway).
- **One concern per branch.** The cage — `ci.sh` + `checkpoint.sh` + the commit hooks — stays on the
  whole time. Guarantees come from the cage, not from remembering to be careful.
- **Build ends at green.** Opening the PR, automated + human review, merge, and flipping the ticket
  to `done` are `ship`'s job.
- **Reuse, don't restate.** Frame the ticket via `/frame`, branch via `/start-ticket`, verify via
  `ci.sh`, checkpoint via `checkpoint.sh`, park discoveries via `intake` — point at them;
  don't reimplement them here.
