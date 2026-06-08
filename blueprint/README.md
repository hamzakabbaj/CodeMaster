# CodeMaster — blueprint/

CodeMaster's own **structured record of intent**, mapped to the greenfield 6-step model
(the same `blueprint/` model the [examples](../examples/etikets/README.md) use). It is
mostly **pointers**: CodeMaster bootstrapped itself *before* the `design-thinking`,
`technical-design`, and `backlog` skills existed, so its design-of-record already lives in
`docs/`, `ROADMAP.md`, and `backlog/tickets/`. This folder makes that mapping explicit
instead of re-deriving it — and gives any future greenfield-style rework a home.

Per-module status: [v1/version.json](v1/version.json).

| Step | Module | Where CodeMaster's version actually lives |
|------|--------|-------------------------------------------|
| 1 · Design Thinking | [v1/design-thinking/](v1/design-thinking/README.md) | `CLAUDE.md`, `docs/00-index.md` — never captured as structured steps |
| 2 · System Design | [v1/system-design/](v1/system-design/README.md) | `docs/` — the doctrine *is* the system design |
| 3 · /spec | [v1/specs/](v1/specs/README.md) | per-ticket `plan.md` |
| 4 · Backlog | [v1/backlog/](v1/backlog/README.md) | `ROADMAP.md` + `backlog/tickets/` (markdown) |

> **Two serializations.** A project built *via* CodeMaster keeps its backlog as JSON in
> `blueprint/`; CodeMaster's *own* meta-repo keeps the **markdown** backlog. So here the
> backlog module is a pointer, not a duplicate — see the [decisions log](../ROADMAP.md).
