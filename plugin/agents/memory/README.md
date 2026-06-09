# Agent memory (convention)

Per-role durable notes the fleet *consults*. **Not** a built-in Claude Code feature — a CodeMaster convention (honest labeling; mechanic unverified).

- Each agent reads `.claude/agents/memory/<role>.md` if it exists (e.g. `architect.md`, `security.md`).
- Agents are **read-only**, so the **main thread writes** these notes — capturing durable, role-specific learnings (recurring pitfalls, prior design decisions, project-specific gotchas) after a session surfaces them.
- Keep entries short and dated. Prune what's no longer true. Do not duplicate what the docs/ROADMAP already record.
