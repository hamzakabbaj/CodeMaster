# CM-39: Docs site engine + Overview page

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** epic-d-docs-site-reference-showcase
- **Type:** task
- **Status:** ✅ done

## Goal
Stand up the data-driven static site engine and the Overview page, openable via `file://`.

## Acceptance criteria
- [x] `docs/site/assets/style.css` — modern-dark-product design system + components
- [x] `docs/site/assets/render.js` — classic script mapping typed blocks → DOM (hero, cards, table, steps, flow, ladder, phases, callout, code, divider)
- [x] `docs/site/data/site.js` — `window.CM.site` (name, tagline, nav, footer)
- [x] `docs/site/data/index.js` — Overview page blocks
- [x] `docs/site/index.html` — thin shell loading css + data + render via classic `<script>`/`<link>` (no fetch/ESM)
- [x] Opens via `file://` with no console errors; renders hero, ladder, lifecycle, nav (chrome-devtools MCP verified)

## Verification
`node --check` on the JS; chrome-devtools MCP loads `file://.../docs/site/index.html`, asserts no console errors + key elements, screenshots. Manual double-click opens offline.

## Notes
Built with the `frontend-design` skill. Proves the whole pattern end-to-end before CM-40 adds pages.
