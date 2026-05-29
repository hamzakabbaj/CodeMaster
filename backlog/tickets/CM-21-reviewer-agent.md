# CM-21: reviewer subagent

- **Epic:** Phase 3 — Subagent Fleet
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-17-subagent-fleet`

## Goal
PR reviewer that checks the diff against our conventions + Definition of Done.

## Acceptance criteria
- [x] `.claude/agents/reviewer.md` — Read/Grep/Glob + Bash (read-only git), `sonnet`
- [x] Returns approve/block + checklist (must-fix vs nit); no edits/commits/pushes
