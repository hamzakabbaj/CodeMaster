# Step 4 — Backlog *(the canonical JSON backlog)*

This **is** CodeMaster's source-of-truth backlog (migrated from markdown in CM-62):

- `roadmap.json` — epics, ticket order, and the board prose (preamble, per-epic exit, decisions log).
- `tickets/CM-<n>-<slug>/ticket.json` — each ticket's structured body, plus optional `plan.md` / `evidence.md` siblings.

`ROADMAP.md` at the repo root is a **generated view** of these files (`scripts/gen_roadmap.py`), kept in sync by the pre-commit hook and a CI rung. **Edit the JSON, never `ROADMAP.md`.**

Validated by the blueprint conformance rung against `plugin/skills/backlog/schema/{roadmap,ticket}.schema.json`.

Projects built *via* CodeMaster use this same model — see the worked example in
[examples/etikets](../../../examples/etikets/README.md).
