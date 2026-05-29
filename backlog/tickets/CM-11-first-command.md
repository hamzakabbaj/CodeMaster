# CM-11: First slash command (validated)

- **Epic:** Phase 1 — Capabilities Proving Ground
- **Type:** task
- **Status:** ⬜ todo
- **Branch:** `feat/CM-11-first-command`

## Goal
Add one custom slash command in `.claude/commands/` and confirm it injects its prompt on `/name`.

## Acceptance criteria
- [ ] Command file with a reusable prompt template
- [ ] Invocable via `/name`
- [ ] Distinct from a skill (no auto-trigger; explicit only)

## Verification
Type `/name`; confirm the templated prompt runs.

## Notes
Candidate: `/checkpoint` (commit current work as a green checkpoint). Validates the slash-command row of docs/01.
