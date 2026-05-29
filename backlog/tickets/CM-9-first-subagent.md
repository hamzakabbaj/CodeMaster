# CM-9: First subagent (validated)

- **Epic:** Phase 1 — Capabilities Proving Ground
- **Type:** task
- **Status:** ⬜ todo
- **Branch:** `feat/CM-9-first-subagent`

## Goal
Define one subagent in `.claude/agents/` and confirm it runs in isolated context and returns only a conclusion.

## Acceptance criteria
- [ ] Agent file with frontmatter (name, description, scoped tools, model)
- [ ] Delegated a real task; main context stays clean
- [ ] Returns a useful conclusion, not a transcript

## Verification
Invoke it on a read-heavy task; confirm the main thread only receives the summary.

## Notes
Precursor to the Phase 3 fleet. Validates the subagent row of docs/01 and docs/04.
