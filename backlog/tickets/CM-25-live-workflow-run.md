# CM-25: bounded live workflow run

- **Epic:** Phase 4 — Orchestration
- **Type:** task
- **Status:** ✅ done
- **Branch:** `feat/CM-23-orchestration`

## Goal
Run the review-board workflow live on a real target, observe the fan-out and structured output.

## Acceptance criteria
- [x] Workflow ran end-to-end on `scripts/roadmap_stats.py` (11 agents, ~130s)
- [x] Structured findings returned; adversarial verification observed (skeptics refuted 1 of 4)
- [x] Result recorded here (considered=4, confirmed=3)

## Verification
Invoked via the Workflow tool (Run ID `wf_c127ce66-596`). 11 agents, ~370k subagent tokens.

## Result
4 findings considered → 3 confirmed (0 refutes each); 1 dropped by skeptics.
- **MEDIUM (correctness):** `path.exists()` (line 33) passes for directories → `read_text()` raises raw `IsADirectoryError`. Fix: `path.is_file()`.
- **LOW x2:** `read_text()` not wrapped in `try/except OSError` → permission/IO errors bypass the clean error+exit-1 contract.

**The orchestration found a real correctness bug the unit tests missed** (no directory/permission case). Fix tracked as **CM-38**.

