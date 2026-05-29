# CM-19: devops subagent

- **Epic:** Phase 3 — Subagent Fleet
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-17-subagent-fleet`

## Goal
CI/CD + reproducibility reviewer focused on the deterministic cage and local↔CI parity.

## Acceptance criteria
- [x] `.claude/agents/devops.md` — read-only, `sonnet`
- [x] Hunts silent skips / swallowed failures / drift; returns fixes, no edits
