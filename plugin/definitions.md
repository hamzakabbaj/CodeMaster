# Definition of Ready · Definition of Done

The two checklists every CodeMaster ticket passes through — the single source of truth that
`intake`, `new-ticket`, `backlog`, `frame`, `ship`, and the `reviewer` agent point at.

## Definition of Ready (DoR) — before a ticket can be started
- [ ] **One concern.** A clear, single-sentence `goal` (task) or `story` ("As a … I want … so that …").
- [ ] **Acceptance criteria written and testable** — each one checkable, not a wish.
- [ ] **Dependencies known and unblocked** — `depends_on` edges recorded; none still open.
- [ ] **Small enough to finish in one short-lived branch.**
- [ ] **Verification approach identified** — how we'll prove it works (which tests, which check).

**The DoR is the line between `backlog` and `todo`.** An item that doesn't meet it yet waits in
`backlog`; moving it to `todo` is the claim that it does. A ticket that fails the DoR doesn't get
built: `frame` sends it to *refine* (vague AC), *spike* (an unknown), or *split* via `intake` (too big).

## Definition of Done (DoD) — before a ticket is closed
- [ ] **Acceptance criteria met and demonstrated** — recorded in the ticket's `evidence` doc
      (pointers to the green run / PR / tests; small text only, no committed binaries).
- [ ] **The `verify` command is green** (`.codemaster/config.json`), and the PR's CI checks pass.
- [ ] **Docs updated** where behaviour changed — README, CLAUDE.md, API docs — and the **schema docs**
      (`.codemaster/docs/database/`, via `db-docs`) whenever the database schema changed.
- [ ] **No secrets, no boundary violations.**
- [ ] **Reviewed (automated + human) and merged via PR.**
