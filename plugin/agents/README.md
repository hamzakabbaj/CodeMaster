# CodeMaster Subagent Fleet

Role-based subagents that encode CodeMaster's doctrine (not generic helpers). Each runs in an isolated context and returns a conclusion. See [docs/04-team-profiles.md](../../docs/04-team-profiles.md) and [docs/05-orchestration.md](../../docs/05-orchestration.md).

## The fleet

| Agent | Role | Tools (least privilege) | Model | Why this model |
|---|---|---|---|---|
| `librarian` | navigate/consistency-check our docs | Read, Grep, Glob | sonnet | read+summarize = grunt work |
| `code-explorer` | map existing code before changing it | Read, Grep, Glob | sonnet | trace + enumerate, not judge |
| `architect` | design review vs doctrine | Read, Grep, Glob | opus | deep tradeoff reasoning |
| `tester` | adversarial test design | Read, Grep, Glob | sonnet | enumerate + draft tests |
| `devops` | gates/CI/reproducibility | Read, Grep, Glob | sonnet | targeted analysis |
| `security` | threat model / AppSec | Read, Grep, Glob | opus | adversarial depth |
| `reviewer` | PR review vs conventions/DoD | Read, Grep, Glob, Bash | sonnet | needs read-only `git diff` |

## Cross-cutting principles (CM-22)
- **Least privilege:** every agent gets only the tools its job needs. Only `reviewer` has `Bash` (read-only git inspection). None can `Edit`/`Write` — they advise; the main thread changes. This prevents parallel-write conflicts and limits blast radius.
- **Model routing (docs/04):** capable model (`opus`) for open-ended reasoning (architect, security); `sonnet` for enumerate/summarize roles. Reserve the expensive model for where judgment pays off.
- **Memory convention (honest):** Claude Code has no verified built-in per-subagent persistent memory, so we use a convention — each agent *reads* `plugin/agents/memory/<role>.md` if present (durable, role-specific learnings); the **main thread writes** those notes (agents are read-only). See `memory/README.md`.

## Registration caveat
Custom agents register at **session start** (confirmed in CM-9). After adding/editing an agent, reload before invoking via its `subagent_type`.

## Orchestration
A workflow can fan these out as a review board (dev → tester → security → reviewer) — see docs/05. That is Phase 4.
