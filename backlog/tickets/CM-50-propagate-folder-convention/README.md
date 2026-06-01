# CM-50: Propagate folder-per-ticket to examples + site doc

- **Epic:** Phase 0 — Delivery Infrastructure (process evolution)
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-50-propagate-folder-convention`

## Goal
Bring the EtiKets reference example and the site's greenfield doc in line with the folder-per-ticket convention adopted in CM-49, so the showcase matches reality.

## Acceptance criteria
- [ ] `examples/etikets/backlog/tickets/ETK-n-slug.md` migrated → `ETK-n-slug/README.md` (history preserved)
- [ ] All inbound + outbound relative links fixed (ROADMAP, backlog/README, spec, root README, and inter-ticket links) — links rung green
- [ ] Example folder-maps updated to show the folder layout; `backlog/README.md` documents it (mirrors the real one)
- [ ] One example ticket dogfoods `plan.md` (ETK-101, the gnarly enabler)
- [ ] `greenfield.js` Step 3 path → `CM-n-<slug>/README.md`; notes the ticket is a folder (optional `plan.md`/`evidence.md`)
- [ ] CI ladder green; greenfield page renders `file://` with zero console errors

## Verification
`sh scripts/ci.sh` green (esp. markdown-links across moved example files); chrome-devtools MCP on `greenfield.html`. This ticket is itself authored in the new folder format.

## Notes
Follow-up to CM-49. The example tickets carry heavy inter-file links, so the depth shifts by one (`../../` → `../../../`) and siblings become `../ETK-x/README.md`; the links rung is the safety net.
