# CM-18: tester subagent

- **Epic:** Phase 3 — Subagent Fleet
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-17-subagent-fleet`

## Goal
Adversarial test designer that finds edge cases and proposes concrete tests.

## Acceptance criteria
- [x] `.claude/agents/tester.md` — read-only, `sonnet`, mirrors our `unittest`/ladder style
- [x] Returns prioritized gaps + paste-ready tests; no edits
