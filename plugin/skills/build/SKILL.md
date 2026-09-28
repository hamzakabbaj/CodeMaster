---
name: build
description: Implement ONE framed ticket on its branch via the robust-code loop — generate (test-first) → verify → checkpoint → critique until the acceptance tests pass and the verify command is green. Runs after /frame has produced the done-contract. Stops at green; it does NOT open the PR (that's ship).
argument-hint: [ticket-id]
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, Agent
---

You are the engineer running the robust-code loop on ONE framed ticket, on its branch. Your output
is working, verified code checkpointed green — **not** a PR. `build` is the *autonomous* half:
`frame` set the target (plan + acceptance tests); you drive the code to it. Ship is separate; build
stops at green.

## Preconditions (assert, don't assume)
- On `feat/<id>-<slug>` (NOT `main`). If on `main`, stop — run `/start-ticket <id>` first.
- **A `verify` command is configured** — `jq -r '.verify // empty' .codemaster/config.json` is the
  project's own test/lint/typecheck command. **Empty → stop and send the user to `/tracker-init`**;
  build never guesses how a project proves itself green.
- **The done-contract exists.** `frame` must have run: `read_doc(<id>, "acceptance-tests")` returns
  the contract. **If the contract is missing, stop — run `/frame <id>` first.** Build does not invent
  the target; it builds to a reviewed one.
- Read the ticket via the tracker `read` verb and the done-contract via `read_doc` before
  generating. The docs live in the tracker (a card or a gitignored local file), never the repo.
- **Read the other slots frame may have filled** — each is optional, and an empty one is a
  statement, not a gap: `read_doc(<id>, "plan")` (if gnarly), `read_doc(<id>, "architecture")`
  (a boundary verdict to respect), and **`read_doc(<id>, "design-options")`** — when it exists, the
  human already chose a direction at a gate, so **build that variant and honour the consequence it
  records.** Re-litigating a settled design choice mid-loop wastes the gate.

## The loop: generate → verify → checkpoint → critique
Repeat until the acceptance tests pass and `verify` is green:

1. **Generate (test-first).**
   a. **Transcribe the `acceptance-tests` doc → executable tests** in the project's suite — fetch it
      with `read_doc(<id>, "acceptance-tests")`. They go **RED** — no code yet. This is faithful
      transcription of the frozen contract, not invention from the code. *(Skip any case already encoded.)*
   b. **Write the next increment of code** against the plan, driving those tests toward **GREEN**.
   c. Add the **dev/unit/scaffolding tests** the increment needs.
2. **Verify (the gate):** run the configured `verify` command. **Red? Fix, or `git restore` back to
   the last checkpoint. Never advance on red.**
3. **Checkpoint on green:** commit the increment — only when `verify` just passed and you're **not on
   `main`**. Review `git status` and stage the increment's files by name (never secrets, `.env`, or
   unrelated changes), then `git commit -m "<conventional subject>"`. Every checkpoint is a
   revertible safe point.
4. **Critique** (at meaningful green points — **at minimum once before you consider the ticket
   done**; more often when `risky`/`gnarly`): send the **critique lenses** — the fleet agents in
   *Critique lenses* below — at the branch diff (`git diff $(git merge-base main HEAD)`), **in
   parallel** (one message, one `Agent` call per lens). Then, **as the discriminator**:
   - **Confirm before you act.** A lens can be wrong — check every `high`/`critical` finding against
     the actual code before changing anything. Drop what doesn't hold up, and say why in `evidence`.
   - **Act on confirmed `high`/`critical` findings now** — fix and re-enter the loop. Triage, don't
     rubber-stamp.
   - **Defer `low`/`nit`** to `ship`'s reviewer — don't rabbit-hole on polish mid-loop.
   - **Add the `test-designer`'s proposed edge-case tests** and re-enter the loop (test-first).
   - **Record the trail via `attach_doc(<id>, "evidence", …)`**: which lenses ran, the surviving
     findings, and what you acted on vs. deferred to `ship`. One evidence doc — *not* a separate
     `security` / `architect-review` / `edge-cases` doc per lens (those go stale the moment you act
     on them). This is the trail `ship`'s reviewer reads (on the card, or the gitignored local file).
   - **If a critique round actually moves a boundary** — reorders a sequence, relocates a
     responsibility, changes a contract between layers — record *that* via
     **`attach_doc(<id>, "architecture", …)`**, even though `frame` didn't write one. The
     architecture slot belongs to whoever settles the boundary, and mid-loop is a legitimate moment
     to settle it. Keep it to the decision and its consequence; the findings stay in `evidence`.

If the code you're touching drifts out of context mid-loop, **re-ground** with the `code-explorer`
agent — `frame` did the first pass, but the loop can recover the map again when needed.

## The feedback arrow (don't scope-creep)
Building ticket N is where you discover ticket N+3 — the edge case, the missing concern. When you
find one: **park it as a NEW ticket via `intake` — do not widen this branch.** One concern
per branch keeps the PR focused; the parked ticket is refined when *it* is pulled.

## Critique lenses — which agents to send
Pick the lenses from **deterministic-ish signals**, so the critique is proportionate to risk:
- **`gnarly`** = the ticket has a **`plan` doc** (`read_doc(<id>, "plan")` returns one — it earned ticket-altitude planning in frame).
- **`risky`** = the diff touches any of: **auth/authz · input parsing/deserialization · secrets/env
  · shell/exec · file I/O on untrusted paths · network/external calls · crypto**. **When uncertain,
  treat it as risky** — a security pass is cheap insurance.

| Agent | Send it when… | Ask it for |
|---|---|---|
| `test-designer` | always | edge cases the acceptance tests missed + concrete tests to add |
| `security` | `risky` | injection, secrets, untrusted input, authz, blast radius |
| `architect` | `gnarly` | wrong-layer choices, coupling, abstractions that will rot |
| `reviewer` | **never here** | diff review belongs to `ship` |

Give each agent the diff command, the ticket's acceptance criteria, and its lens; ask for findings
with a **location + severity** (`critical · high · medium · low · nit`) and an empty list when the
diff is clean on that lens — no invented problems.

## Exits
- **Acceptance tests pass + `verify` green → STOP.** Hand off to `ship`. Build does **not** open the PR.
- Grew too big mid-build → stop, split via `intake`.
- Contract turned out wrong / blocked on an unknown → back to `frame` (or spike). Build doesn't
  rewrite the target on the fly.

## Guardrails
- **Never checkpoint on red; never `git commit --no-verify`** (a PreToolUse hook blocks it anyway).
- **One concern per branch.** The cage — `verify` + green-only checkpoints + the repo's commit hooks —
  stays on the whole time. Guarantees come from the cage, not from remembering to be careful.
- **Build ends at green.** Opening the PR, automated + human review, merge, and flipping the ticket
  to `done` are `ship`'s job.
- **Reuse, don't restate.** Frame the ticket via `/frame`, branch via `/start-ticket`, verify via
  the configured `verify` command, park discoveries via `intake` — point at them;
  don't reimplement them here.
