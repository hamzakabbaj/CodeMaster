# CM-49: Folder-per-ticket — ticket + plan + evidence

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-0-delivery-infrastructure
- **Type:** task
- **Status:** ✅ done

## Goal
Evolve the ticket model from a single markdown file to a folder per ticket holding the ticket body, an optional implementation plan, and optional pointer-based evidence of done.

## Acceptance criteria
- [x] Convention: `backlog/tickets/CM-n-slug/` with `README.md` (ticket body, required) + optional `plan.md` + optional `evidence.md`
- [x] All existing flat tickets migrated `CM-n-slug.md` → `CM-n-slug/README.md` via `git mv` (history preserved)
- [x] Authoring tools updated: `/start-ticket`, `new-ticket` skill, `/spec` reference the folder path; `next-number.sh` / `roadmap_stats.py` / `check_links.py` confirmed unaffected
- [x] `plan.md` + `evidence.md` templates added; evidence policy = pointers (CI run, PR, test names) + small text only, **no committed binaries**
- [x] `backlog/README.md` documents the folder layout + plan/evidence; this ticket dogfoods it (its own `plan.md` + `evidence.md`)
- [x] CI ladder green (esp. markdown-links across moved files)

## Verification
`sh scripts/ci.sh` green; `next-number.sh` still returns the right next id; ticket folders render on GitHub. See `evidence.md`.

## Plan
See [plan.md](plan.md).

## Notes
Brownfield change to our own tooling — blast radius mapped first (only the 3 authoring prose refs touch the path; tickets have no relative/inbound links, so the move is safe). `examples/etikets/` tickets + the site greenfield doc to follow in a separate ticket (don't entangle two migrations).

## Evidence
See [evidence.md](evidence.md).
