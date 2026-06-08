# CM-40: Docs site content pages

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** epic-d-docs-site-reference-showcase
- **Type:** task
- **Status:** ✅ done

## Goal
Author the five content pages as data files + thin shells, completing the site so nav has no dead links.

## Acceptance criteria
- [x] `data/capabilities.js` + `capabilities.html` (primitives table, decision cards, hook events, principle)
- [x] `data/loop.js` + `loop.html` (steps, ladder flow, our 5-rung ladder, what-lives-in-code, DoD)
- [x] `data/delivery.js` + `delivery.html` (pipeline flow, stage cards, gates, where-Claude-plugs-in)
- [x] `data/fleet.js` + `fleet.html` (6 agent cards, review-board flow, adversarial-verify steps)
- [x] `data/roadmap.js` + `roadmap.html` (phases status board, defects-found-by-running, throughline)
- [x] All six pages render over `file://` with **no console errors** (verified via chrome-devtools MCP)

## Verification
`node --check` on all data files; browser-loaded each page (zero console messages); screenshots of Overview, Capabilities, Roadmap confirm the dark-product design + every component type.

## Notes
Content is curated from docs/*.md (reorganized, not mirrored). Site JS data is its own source.
