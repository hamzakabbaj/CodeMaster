# Orchestration — The Leverage Ladder

> From "talking to one agent" to "designing a system that runs agents." This is the #4–#5 tier: where Claude stops being a conversation and becomes infrastructure.

## The ladder (increasing leverage)

```
1 Single subagent     → offload one isolated task, get a conclusion back
2 Workflow            → deterministic script orchestrating MANY subagents
3 Headless / SDK      → run reasoning on an event (CI, webhook, cron)
4 Plugin              → package & distribute all of it to a team
```

Each rung wraps the one below in more determinism and more reach.

## Workflows — the orchestration primitive

A Workflow is a **JS script you write**; the control flow is deterministic, only the reasoning inside each agent is probabilistic.

| Building block | Behavior | Use when |
|---|---|---|
| `agent(prompt, {schema, model, label})` | One subagent; `schema` → validated structured data | Any unit of delegated reasoning |
| `pipeline(items, s1, s2, …)` | Each item flows through stages **independently** (no barrier) | **Default** for multi-stage work |
| `parallel([thunks])` | Concurrent, **barrier** — waits for all | Only when stage N needs *all* of stage N-1 |
| `phase()` / `log()` | Progress reporting | Visibility |

- Runs in the **background**; ~10–16 agents concurrent; notifies on completion.
- Opt-in only (token-heavy). It's the heavy artillery, not the daily driver.

## Quality patterns (the senior moves)

| Pattern | Shape | Catches |
|---|---|---|
| **Adversarial verify** | N skeptics try to *refute* each finding; kill if majority refute | Plausible-but-wrong output |
| **Perspective-diverse verify** | Each verifier gets a distinct lens (correctness / security / perf / repro) | Failure modes redundancy misses |
| **Judge panel** | N independent attempts → scored → synthesize winner | Wide solution spaces |
| **Loop-until-dry** | Keep finding until K empty rounds | The long tail of issues |
| **Multi-modal sweep** | Agents each search a different way, blind to each other | One angle won't find everything |
| **Completeness critic** | Final agent: "what's missing?" → next round | Silent gaps |

## Mapping to our team profiles

The [04-team-profiles.md](04-team-profiles.md) review board, made executable:

```
pipeline(changedFiles,
  f => agent(`dev: implement/inspect ${f}`),
  r => agent(`tester: find edge cases`, {schema: FINDINGS}),
  r => parallel([securityLens, perfLens, correctnessLens]),  // diverse verify
  v => agent(`reviewer: synthesize verdict`, {schema: VERDICT}))
```

Dev → tester → security/perf/correctness → reviewer, fanned out, deterministic where it counts.

## When NOT to orchestrate

- A single well-scoped task → just use one **subagent** or do it inline.
- A repeatable procedure with no fan-out → **skill**.
- A guarantee that must always hold → **hook**.

Reach for a workflow when the work is **wide** (many items / dimensions) or needs **independent verification** before you trust it.
