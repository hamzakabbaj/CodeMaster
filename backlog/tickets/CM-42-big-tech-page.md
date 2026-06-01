# CM-42: "How Big Tech Engineering Works" page

- **Epic:** D — Docs Site (reference showcase)
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-42-big-tech-page`

## Goal
Add a docs-site page documenting how Big-Tech engineering organizations actually work — team topologies, roles, ceremonies, ownership, and the career ladder — as context and inspiration for future CodeMaster improvements.

## Acceptance criteria
- [ ] New page `docs/site/bigtech.html` (thin shell) + `docs/site/data/bigtech.js` (content blocks)
- [ ] Added to global nav in `data/site.js`
- [ ] Covers: team topology (squads/platform/enabling), the engineering roles & what each owns, the delivery ceremonies, ownership/on-call, and the IC career ladder — distinct from `fleet.html` (which maps roles → Claude subagents)
- [ ] Closes with how this org model inspires CodeMaster's fleet/process (the bridge)
- [ ] Renders over `file://` with zero console errors; CI ladder green (incl. JS rung)

## Verification
chrome-devtools MCP loads `file://.../docs/site/bigtech.html` → no console errors, nav shows active item, blocks render. `node --check` clean on the new JS. Full 6-rung ladder green.

## Notes
Reuses existing block types (hero, cards, table, steps, flow, ladder, callout) — no renderer changes expected. Source/inspiration: `docs/04-team-profiles.md` plus general Big-Tech org practice. Site data is its own curated source (per Epic D decision).
