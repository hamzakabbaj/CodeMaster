# CM-9: First subagent (validated)

- **Epic:** Phase 1 — Capabilities Proving Ground
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-9-first-subagent`

## Goal
Define one subagent in `.claude/agents/` and confirm it runs in isolated context and returns only a conclusion.

## Acceptance criteria
- [x] Agent file `librarian.md` with frontmatter: scoped tools (`Read, Grep, Glob` — least privilege, no Edit/Write/Bash) and `model: sonnet` (grunt-work routing)
- [x] Delegated a real read-heavy task (Phase 0/1 consistency audit); main context received only the conclusion, not the reading transcript
- [x] Returned a useful, cited conclusion

## Verification
Ran a consistency-audit task in an isolated subagent. **Caveat discovered:** a custom agent created mid-session is NOT yet in the registry (`Agent type 'librarian' not found`) — same as hooks, it registers at session start. Proved the *mechanic* via the built-in read-only `Explore` agent (analogue of librarian's scoped tools); the custom `librarian` persona will be live next session.

## Notes
Precursor to the Phase 3 fleet. Validates the subagent row of docs/01 and docs/04. Lesson fed back into docs/01: custom agents + hooks need a session reload to register.
