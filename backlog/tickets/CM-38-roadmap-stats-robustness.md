# CM-38: roadmap_stats error handling (from CM-25 review board)

- **Epic:** Phase 4 — Orchestration (finding from the live review-board run)
- **Type:** fix
- **Status:** ✅ done
- **Branch:** `feat/CM-38-roadmap-stats-robustness`

## Problem
The review-board workflow (CM-25) found, and adversarially confirmed, that
`roadmap_stats.py` guards only the missing-file case with `path.exists()`:
- `exists()` returns True for a **directory** → `read_text()` raises a raw
  `IsADirectoryError` instead of the clean error+exit-1 path (MEDIUM).
- Other I/O errors (`PermissionError`) from `read_text()` are unhandled (LOW).

The unit tests missed this — no directory/permission/CLI-path coverage.

## Fix
- Guard with `path.is_file()` (not `exists()`).
- Wrap `read_text()` in `try/except OSError` → clean stderr + return 1.
- Add the tests that would have caught it: directory arg, missing arg, happy path.

## Acceptance criteria
- [x] `main()` returns 1 (no traceback) for a directory and a missing path
- [x] `main()` returns 0 for a readable file
- [x] New tests cover all three; ladder green (8 tests, was 5)

## Verification
`python3 -m unittest`; the directory test fails on the old code, passes on the fix.
