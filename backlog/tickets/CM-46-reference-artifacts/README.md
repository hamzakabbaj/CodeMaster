# CM-46: Reference artifact set — design → spec → backlog (EtiKets)

- **Epic:** D — Docs Site (reference showcase)
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-46-reference-artifacts`

## Goal
Create an illustrative `examples/etikets/` folder holding the real process artifacts a product repo carries through the greenfield arc — design, spec, backlog — each file explaining what it could contain, grounded in the EtiKets design.

## Acceptance criteria
- [ ] `examples/etikets/` with `design/`, `specs/`, `backlog/` (+ `backlog/tickets/`) and a root README explaining the lifecycle and how artifacts connect
- [ ] `design/` shows the design-of-record concept (imported, validate-not-generate gate)
- [ ] `specs/` shows an epic-level `/spec` output (problem · constraints · AC · risks · plan→verification · plan-review STOP)
- [ ] `backlog/` shows the hierarchy: epic in `ROADMAP.md`; stories (As a…/AC) + enabler tasks as `ETK-n` tickets; the timezone risk surfaced as its own foundational ticket
- [ ] Every file opens with a "what this file is / could contain" note; all relative md links resolve; CI ladder green

## Verification
`sh scripts/ci.sh` green (esp. the markdown-links rung across the new files). Manual read-through confirms the design→spec→backlog chain is coherent.

## Notes
EtiKets = separate sample project (ETK- prefix) to distinguish from CodeMaster's own backlog. Markdown-only (JSON shown in fenced blocks, not as `.json` files, to keep the JSON rung uninvolved). Reference illustration, not a runnable app.
