# CM-10: First skill (validated)

- **Epic:** Phase 1 — Capabilities Proving Ground
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-10-new-ticket-skill`

## Goal
Author one skill (`SKILL.md` + optional script) and confirm it loads on demand by description match or `/name`.

## Acceptance criteria
- [x] Skill `new-ticket` with valid frontmatter (name, description) + bundled helper script
- [x] Encodes a repeatable procedure (scaffold a ticket + register in ROADMAP) — not an invariant
- [x] Deterministic core (`next-number.sh`) verified live (returns next free CM-<n>)
- [~] Auto-trigger by description-match pending session reload (same registry caveat as hooks/agents)

## Verification
`next-number.sh` returns 35 (max existing CM-34). Full description-match trigger verifiable after a reload.

## Notes
Skill bundles a script (progressive disclosure). Validates the skill row of docs/01. Pairs with CM-11 `/start-ticket` (skill auto-triggers on intent; command runs only on explicit `/name`).
