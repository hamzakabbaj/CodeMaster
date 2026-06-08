# CM-43: "Playbooks" page — the process applied to real scenarios

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** epic-d-docs-site-reference-showcase
- **Type:** task
- **Status:** ✅ done

## Goal
Add a docs-site page with worked-example playbooks showing how the CodeMaster process flexes by scenario — same cage, different path, ceremony scaling with risk × uncertainty.

## Acceptance criteria
- [x] New page `docs/site/playbooks.html` + `docs/site/data/playbooks.js`; added to nav in `data/site.js`
- [x] Opens with the thesis (ceremony scales with risk × uncertainty) + a "pick your path" selector table
- [x] Documents 7 playbooks as step walkthroughs, each with the key gate that matters: greenfield, brownfield feature, refactor, bug fix/hotfix, spike/research, migration/upgrade, incident/postmortem
- [x] Generic-but-realistic illustrative examples (not repo-specific)
- [x] Renders over `file://` with zero console errors; CI ladder green (incl. JS rung)

## Verification
chrome-devtools MCP loads `file://.../docs/site/playbooks.html` → no console errors, nav active, blocks render. `node --check` clean. Full 6-rung ladder green.

## Notes
Reuses existing block types (hero, table, steps, callout, cards, flow) — no renderer changes expected. Complements The Loop (the engine) and Delivery (the pipeline) by showing the process in context.
