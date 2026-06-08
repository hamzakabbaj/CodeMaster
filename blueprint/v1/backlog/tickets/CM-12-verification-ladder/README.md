# CM-12: Verification ladder (lint → structure → commit), local = CI

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-2-robust-code-loop
- **Type:** task
- **Status:** ✅ done

## Goal
Make doc 02's verification ladder real: ordered, fail-fast, runnable gates that local (`ci.sh`) and CI run identically. Populate with the rungs that apply to a docs/config repo; structure so language rungs (typecheck/unit/e2e) slot in for real repos later.

## Acceptance criteria
- [x] shellcheck rung added; passes clean on all 6 scripts (and on `ci.sh` itself)
- [x] `ci.sh` reads as an explicit 4-rung fail-fast ladder; verified it stops at rung 1 on a deliberate shellcheck violation
- [x] CI runs shellcheck (rung 1 step in ci.yml) so local mirrors CI
- [x] Missing shellcheck locally degrades to `sh -n` + install hint (no silent skip)
- [x] Ladder + extension point documented (ci.sh header, CONTRIBUTING)

## Verification
`shellcheck` clean on all scripts; `ci.sh` green; introduce a deliberate shell bug → ladder fails at rung 1.

## Notes
shellcheck is the first real "lint" rung. Mirrors doc 02's ladder; the structure is what Track B/C repos inherit.
