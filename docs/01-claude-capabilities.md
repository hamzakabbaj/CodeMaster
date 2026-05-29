# Claude Code Capabilities — What Each Primitive Is For

> Goal: put each concern in the layer whose properties fit it. Wrong-layer usage is the #1 mistake.

## The mental model

Claude Code is a **layered, programmable platform**. The model is probabilistic; the layers around it are where you put determinism, reuse, and isolation.

| Primitive | What it is | Loaded / runs when | Determinism | Context cost |
|---|---|---|---|---|
| **CLAUDE.md** | Always-on project memory | Every turn | Model still decides | High (always in context) |
| **Skill** | On-demand procedure (`SKILL.md` + optional scripts/resources) | When its `description` matches, or `/name` | Model-driven | Body loads only when invoked |
| **Subagent** | Isolated agent with its own context window | When delegated to | Model-driven | Returns only a conclusion to main thread |
| **Slash command** | Reusable prompt template (`.claude/commands/*.md`) | When you type `/name` | Model-driven | Injected on use |
| **Hook** | Deterministic shell script on a lifecycle event | On the event, always | **Deterministic** (cannot hallucinate) | None (runs outside model) |
| **MCP server** | External tool/data integration | When its tools are called | Tool is deterministic; use is model-driven | Tool schemas in context |
| **Output style** | Replaces/extends the base system prompt | Whole session | Model-driven | Persistent |
| **Workflow** | Deterministic JS script that orchestrates many subagents (`agent`/`parallel`/`pipeline`) | When you launch it (opt-in) | **Control flow is deterministic**; reasoning inside agents is not | Runs in background; you get the result |
| **Plugin** | Versioned bundle of all the above + a marketplace | On install | Inherits children | Inherits children |
| **Headless / Agent SDK** | Claude Code as a non-interactive process/library | When you invoke it | You own the harness | You control it |

## When to use which — decision rules

- **Invariant truth about the repo** (build cmd, arch rule, "we use X not Y") → **CLAUDE.md**. Keep it short; it's paid for every turn.
- **A repeatable multi-step procedure** (release, migration, scaffold a module) → **Skill**. Procedural knowledge that shouldn't bloat every conversation.
- **Heavy, noisy, or parallel work** (scan logs, read many files, explore alternatives, review a diff) → **Subagent**. Protects the main context; returns only the answer. Assign cheaper models to grunt-work agents.
- **A non-negotiable that must hold regardless of the model** (format, typecheck, secret scan, test gate, "never touch `/infra`") → **Hook**. If it must always be true, it is code, not a polite instruction.
- **A prompt you retype** → **Slash command**.
- **External system access** (DB, browser, Jira, Sentry) → **MCP server**.
- **Orchestrate *many* agents with deterministic control flow** (fan-out review, judge panel, loop-until-dry, migration sweep) → **Workflow**. Heavy artillery — opt-in, can burn many tokens. See [05-orchestration.md](05-orchestration.md).
- **Ship your judgment to a team** → **Plugin** (bundle the skills/agents/hooks/commands, version it, distribute via marketplace).
- **Run reasoning on an event, not by hand** (CI, webhook, cron, pipeline step) → **Headless / SDK**.

## Hook events (the determinism surface)

`PreToolUse` · `PostToolUse` · `UserPromptSubmit` · `Notification` · `Stop` · `SubagentStop` · `PreCompact` · `SessionStart` · `SessionEnd`

- `PreToolUse` can **allow / deny / modify** a tool call before it runs → this is your enforcement gate.
- `PostToolUse` reacts after (auto-format, run tests, log for audit).
- `UserPromptSubmit` / `SessionStart` can **inject context** automatically.

> Mechanics move fast. When we build any of these, we prototype + run it to confirm behavior rather than trust this table.

## The one senior insight

> **Push your guarantees out of the prompt and into code (hooks, tests, CI).** Everything trustworthy about an AI workflow comes from the deterministic cage you build around a probabilistic model — not from the model behaving.
