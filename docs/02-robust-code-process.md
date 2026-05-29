# Building Robust Code with Claude Code

> Beginners ship the first draft. The leverage is the **loop** around generation — and your judgment is the discriminator inside it.

## Core principle

The model is interchangeable and improving on its own. **The harness is yours** and is where your experience compounds. Be the *discriminator* (spot the N+1, the leaky abstraction, the concurrency bug), not just the *generator*.

## The loop

```
SPEC → PLAN → GENERATE → VERIFY → CRITIQUE → (checkpoint | rollback) → repeat
```

1. **Spec** — write the intent, constraints, and acceptance criteria before any code. Vague spec = plausible-but-wrong output.
2. **Plan** — use plan mode; **review and attack the plan before code exists**. Cheapest place to catch design error.
3. **Generate** — let the model write against the approved plan.
4. **Verify** — deterministic gates run automatically (tests, types, lint, build). Failures feed back as the next prompt.
5. **Critique** — you read for what tests can't catch: design rot, hidden coupling, security, performance under load.
6. **Checkpoint / rollback** — git commit on green; revert broken iterations instead of patching forward.

## What lives in code (not in trust)

| Concern | Mechanism |
|---|---|
| Formatting / style | PostToolUse hook + formatter |
| Type / compile correctness | typecheck in verify gate |
| Behavioral correctness | tests (unit → integration → e2e) |
| Secrets / dangerous commands | PreToolUse hook (deny) |
| Architectural boundaries | lint rules + "never touch X" hook |
| Coverage / regressions | CI gate on PR |

## Verification ladder (cheapest first)

`lint/format` → `typecheck` → `unit` → `integration` → `e2e` → `human review` → `prod observability`

Stop the model from advancing until the current rung is green.

## Context discipline

- Offload reading/searching/log-scanning to **subagents** — keep the main thread reasoning clean.
- Keep CLAUDE.md to invariants; move procedures to **skills**.
- Checkpoint context with commits so a bad turn is cheap to discard.

## Definition of Done (robustness)

- [ ] Meets the written spec & acceptance criteria
- [ ] All verification rungs green
- [ ] Tests added/updated; meaningful coverage
- [ ] No new secrets, no boundary violations
- [ ] Reviewed by a human for design/security/perf
- [ ] Observable in prod (logs/metrics/traces)
- [ ] Docs / CLAUDE.md updated if behavior changed

## Untrusted input warning

The moment the agent acts on content it didn't get from you (PR text, issue bodies, web pages, tool output), treat it as a **prompt-injection attack surface**. Gate autonomous actions accordingly.
