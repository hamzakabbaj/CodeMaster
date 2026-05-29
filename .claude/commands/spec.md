---
description: Produce a spec + plan for a ticket or feature, then stop for plan-review before any code (doc 02).
argument-hint: <CM-number | short feature description>
---

Produce a spec and plan for: **$ARGUMENTS**. Then STOP for review — do not write code until the plan is approved (doc 02: review the plan before code exists).

1. If `$ARGUMENTS` is a `CM-<n>`, read `backlog/tickets/CM-$ARGUMENTS-*.md` for goal + acceptance criteria. Otherwise treat it as a feature description.
2. Write the spec, concise:
   - **Problem / intent** — what and why, in 1–2 sentences.
   - **Constraints** — invariants from CLAUDE.md/docs that apply; what must NOT change.
   - **Acceptance criteria** — testable conditions (reuse the ticket's if present).
   - **Risks / unknowns** — what could make this wrong or hard.
   - **Plan** — the smallest sequence of steps; name files to add/change; how each step will be verified (which ladder rung / test).
3. Surface the riskiest assumption explicitly and how you'll de-risk it.
4. **Stop and ask for approval.** Offer to adjust the plan. Only after approval proceed to implement (then `/start-ticket` if not already on a branch).

Keep it tight — a spec is for thinking and review, not ceremony. Be the discriminator: attack your own plan for the design/security/perf hole before the user has to.
