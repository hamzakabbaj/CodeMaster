# CM-49 — Implementation plan

> The loop's Plan beat, persisted — and a live demo of `plan.md` itself.

## Approach
Move tickets from a flat `CM-n-slug.md` to a folder `CM-n-slug/` with `README.md`
(body) + optional `plan.md`/`evidence.md`. A brownfield change to our own tooling, so
map the blast radius first, then migrate mechanically with `git mv` (history preserved).

## Changes by layer
- **Tooling (path-aware):** `/start-ticket`, `new-ticket` skill, `/spec` → folder + `README.md`.
- **Tooling (confirmed unaffected):** `next-number.sh` (greps file *contents*), `roadmap_stats.py` (reads `ROADMAP.md` only), `check_links.py` (globs all `*.md`).
- **Docs/templates:** `backlog/README.md` gains a *Ticket layout* section; new `templates/plan.md` + `templates/evidence.md`.
- **Migration:** `git mv` all 34 flat tickets → `CM-n-slug/README.md`.
- **Tests:** none new — `roadmap_stats` tests untouched; the markdown-links rung verifies the moved files.

## Sequence
1. Map blast radius (done) — verified no relative/inbound links → safe move.
2. `git mv` migration → verified by `git status` (34 renames) + the links rung.
3. Update the 3 authoring tools → grep confirms no stray flat-path refs.
4. Add templates + README layout → links rung.
5. Dogfood on CM-49 (this `plan.md` + `evidence.md`) → full ladder green.

## Riskiest assumption
That moving tickets one level deeper breaks links or tooling. **De-risked by mapping
first:** tickets carry no relative links and nothing links to them by path, and the three
non-authoring tools key off content/ROADMAP, not the ticket path.
