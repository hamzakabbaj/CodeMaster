---
description: Produce the epic brief (spec.md) for ONE epic — sharpen its riskiest assumption and lay out the approach at epic altitude — then stop for plan-review before the backlog is sliced. Runs after roadmap, before backlog. Epic-only; ticket-level planning is Frame's plan.md.
argument-hint: <epic-id>   (the kebab-case id from roadmap, e.g. daily-pick-loop)
---

Produce the **epic brief** for epic **$ARGUMENTS**: sharpen what's uncertain and lay out the
approach at *epic* altitude, then **STOP for review** — the brief is reviewed before the epic is
sliced into tickets (review the plan before any code exists).

This is **epic-only.** It writes one `spec.md` and nothing below it: ticket-level planning is
Frame's `plan.md`, and UI variant exploration is `/design-options`. `/spec` writes no tickets and
no code.

## 1. Read the epic — via the active tracker

Resolve the tracker from `.codemaster/config.json` (default `folder`; contract
[`plugin/tracker/README.md`](../tracker/README.md)) and **`read`** epic **$ARGUMENTS** — its
`goal`, `riskiest_assumption`, and `depends_on`. Don't ask the user to paste what `roadmap` already
recorded. Then read the upstream design record (design-thinking + system-design) for the
architecture this epic sits in.

## 2. Write the brief → `<root>/epics/<id>/spec.md`

`<root>` is the folder root from config (e.g. `blueprint/v1/backlog`); `roadmap` already scaffolded
`epics/<id>/`. The brief is a **repo file regardless of tracker provider** — design artifacts
version with the code and are reviewed in the PR. Keep it concise, at epic altitude:

- **Problem / intent** — what this epic delivers and why, in 1–2 sentences (the outcome, from the
  epic `goal`).
- **Constraints** — invariants from CLAUDE.md / the system design that apply; what must NOT change.
- **Approach** — the *shape* of the solution at epic altitude: the modules/seams it touches, the
  key flows, the data it owns. **Not file-level steps** — those are ticket plans (Frame).
- **Validating outcome** — what proves the epic is actually done and the bet paid off (the loop it
  closes, the behavior or metric). The tickets' acceptance criteria will ladder up to this.
- **Riskiest assumption — sharpened.** Take the one-line `riskiest_assumption` from the epic and
  make it **concrete and falsifiable**, then state **how you'll de-risk it first.** This de-risk
  plan is exactly what `backlog` promotes to a foundational **enabler ticket**, built before the
  stories that depend on it.

## 3. Be the discriminator

Attack your own brief for the design / security / perf hole before the user has to. Name what could
make the approach wrong — that is the point of a spec.

## 4. Stop for review

Present the brief and **stop.** Offer to adjust it. Only after approval does the epic proceed to
`backlog` (slicing). Keep it tight — a spec is for thinking and review, not ceremony.
