---
description: Write the brief for ONE feature that carries a riskiest assumption — sharpen the unknown, sketch the approach, then stop for review before the feature is sliced into tickets. Features without an unknown skip this and go straight to backlog. Persists via the tracker's attach_doc (never committed to the repo).
argument-hint: <feature-id>
---

Write the **feature brief** for feature **$ARGUMENTS**: settle what's uncertain and sketch the
approach, then **STOP for review** — the brief is reviewed before the feature is sliced into tickets
(review the plan before any code exists).

A feature is 2–5 stories, so **the brief is short — half a page.** It writes one `spec` doc and
nothing else: ticket-level planning is `frame`'s `plan`, UI variant exploration is
`/design-options`. `/spec` writes no tickets and no code.

## 1. Read the feature — via the active tracker

Resolve the tracker from `.codemaster/config.json` (**absent → stop and send the user to
`/tracker-init`**; there is no silent default. Contract:
[`plugin/tracker/README.md`](../tracker/README.md)) and **`read`** **$ARGUMENTS**:
- **Not a `feature`** → stop. Epics aren't specced (break one into features with `roadmap <epic-id>`);
  a ticket's planning is `frame`'s job.
- **No `riskiest_assumption`** → stop and say so: there's no unknown to settle, so the next step is
  `backlog $ARGUMENTS`. (If you think there *is* a real unknown, propose it to the user first.)

Then read context: the parent epic if any (its goal and product-level bet), the relevant design
record (design-thinking + system-design, when the project has one), and the code the feature touches.
Don't ask the user to paste what's already recorded.

## 2. Write the brief → `attach_doc(<id>, "spec", …)`

Persist via the active provider's **`attach_doc`** (folder → a gitignored local file; plane → the
feature card's description). **Never write it to a committed repo file.** Four short sections:

- **Intent** — what the feature delivers and why, in 1–2 sentences (from its `goal`).
- **Riskiest assumption — sharpened.** Make the one-line `riskiest_assumption` **concrete and
  falsifiable**, then state **how you'll de-risk it first.** This is exactly what `backlog` promotes to
  the **enabler ticket**, built before the stories that depend on it.
- **Approach** — the *shape* of the solution: the modules/seams it touches, the key flow, the data it
  owns, the constraints it must respect (from CLAUDE.md / the system design). **Not file-level
  steps** — those are ticket plans (`frame`).
- **Validating outcome** — what proves the feature is done and the bet paid off. The tickets'
  acceptance criteria ladder up to this.

## 3. Be the discriminator

Attack your own brief for the design / security / perf hole before the user has to. Name what could
make the approach wrong — that is the point of a spec.

## 4. Stop for review

Present the brief and **stop.** Offer to adjust it. Only after approval does the feature proceed to
`backlog $ARGUMENTS` (slicing).
