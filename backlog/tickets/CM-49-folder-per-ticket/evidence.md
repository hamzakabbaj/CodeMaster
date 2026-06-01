# CM-49 — Evidence (proof of done)

> Live demo of `evidence.md`: pointers to the cage + small text only, no binaries.

- **PR:** #26
- **Green CI run:** GitHub Actions "Quality gates" on the PR + post-merge `main` (see PR #26 checks)
- **Tests / gates that lock it:** the 6-rung `scripts/ci.sh` (mirrored in CI); `tests/test_roadmap_stats.py` still green (proves `roadmap_stats.py` unaffected by the layout change)

## Acceptance criteria → demonstrated
- [x] Folder convention (`README.md` + optional `plan.md`/`evidence.md`) — this ticket's own folder *is* the demo
- [x] 34 flat tickets migrated via `git mv` — `git status` shows 34 renames (history preserved)
- [x] Authoring tools updated; `next-number.sh` / `roadmap_stats.py` / `check_links.py` unaffected — outputs below
- [x] `plan.md` + `evidence.md` templates added; evidence = pointers + text, no binaries
- [x] `backlog/README.md` documents the layout; CI ladder green

## Output (small text only)
```
$ .claude/skills/new-ticket/next-number.sh
50                                  # correct: CM-49 now exists

$ git status --short | grep -c '^R'
34                                  # tracked renames, history preserved

$ python3 scripts/roadmap_stats.py
39/49 tickets done (80%)            # reads ROADMAP.md only — unaffected by the move

$ sh scripts/ci.sh | tail -3
▸ 6/6 Commit message ...  ✓ HEAD commit message OK
✓ CI passed                         # markdown-links rung green → moved files resolve
```
