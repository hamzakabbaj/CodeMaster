# CM-12: Verification ladder (lint → structure → commit), local = CI

- **Epic:** Phase 2 — Robust-Code Loop
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-12-verification-ladder`

## Goal
Make doc 02's verification ladder real: ordered, fail-fast, runnable gates that local (`ci.sh`) and CI run identically. Populate with the rungs that apply to a docs/config repo; structure so language rungs (typecheck/unit/e2e) slot in for real repos later.

## Rungs (cheapest first)
1. **Lint** — `shellcheck` on all shell scripts (catches quoting/portability bugs).
2. **Structure** — JSON validity; markdown links resolve.
3. **Contract** — HEAD commit message is Conventional.
(typecheck/unit/integration/e2e: N/A for this repo — documented as the extension point.)

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
