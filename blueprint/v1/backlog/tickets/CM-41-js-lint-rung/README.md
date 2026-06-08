# CM-41: JS syntax rung (node --check)

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** epic-d-docs-site-reference-showcase
- **Type:** task
- **Status:** ✅ done

## Goal
Guard the site's JS with a `node --check` rung in the ladder + CI, mirroring the shellcheck pattern.

## Acceptance criteria
- [x] `ci.sh` rung 2/6 runs `node --check` on `docs/site/**/*.js`; graceful degrade if node absent
- [x] **Scoped to `docs/site`** — excludes `.claude/workflows/*.mjs` (run in the Workflow wrapper; top-level await/return is illegal as a standalone module)
- [x] CI mirrors it (`node --check` step)
- [x] `ci.sh` stays shellcheck-clean; fail-fast verified (broken site JS stops at rung 2)

## Verification
Full 6-rung ladder green; deliberate JS syntax error → ladder halts at rung 2 (exit 1).

## Notes
Found by running: `node --check` rejects the workflow `.mjs` (illegal top-level return) — confirming the scope decision.
