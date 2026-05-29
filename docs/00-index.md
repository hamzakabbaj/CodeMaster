# CodeMaster — Engineering Operating System

Building a Big-Tech-grade development process on top of Claude Code. The throughline: **guarantees come from the deterministic system we build around the model, not from the model behaving.**

## Docs

1. [Claude Code Capabilities](01-claude-capabilities.md) — every primitive and when to use each.
2. [Building Robust Code](02-robust-code-process.md) — the spec→verify→critique loop.
3. [Delivery Process](03-delivery-process.md) — design-done → Agile → git → CI/CD → prod.
4. [Team Profiles](04-team-profiles.md) — Big-Tech roles and their subagent mapping.
5. [Orchestration](05-orchestration.md) — the leverage ladder: subagent → workflow → headless → plugin.

## Lifecycle at a glance

```
Design Thinking (done) → Backlog → Robust-Code Loop → CI/CD → Release → Observe → Iterate
                              │            │
                         capabilities  team profiles
                         decide layers  decide who/which agent
```

> Status: concise first pass. Each point is expandable on demand.
