# CM-22: scoped tools + model routing + memory convention

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-3-subagent-fleet
- **Type:** task
- **Status:** ✅ done

## Goal
Apply the cross-cutting fleet concerns and document them.

## Acceptance criteria
- [x] Least-privilege tools per agent (only `reviewer` has Bash; none can Edit/Write)
- [x] Model routing per docs/04 (opus: architect, security; sonnet: others)
- [x] Memory **convention** (read-only `.claude/agents/memory/<role>.md`; main thread writes) — honestly labeled as not a built-in feature
- [x] `.claude/agents/README.md` documents the fleet (tools/model/memory) + registration caveat

## Notes
Memory mechanic unverified in Claude Code → convention, not a claimed feature. Orchestration of the fleet is Phase 4.
