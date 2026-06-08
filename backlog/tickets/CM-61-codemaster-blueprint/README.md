# CM-61: Add CodeMaster's own blueprint/ (navigational index)

- **Epic:** Epic D — Docs Site (reference showcase) / blueprint skills
- **Type:** docs
- **Status:** ✅ done
- **Branch:** `feat/CM-61-codemaster-blueprint`

## Goal
Give CodeMaster's meta-repo its own `blueprint/` folder mapped to the greenfield 6-step model — mostly pointers, because the repo predates the blueprint skills and its design-of-record already lives in `docs/`, `ROADMAP.md`, and `backlog/tickets/`.

## Acceptance criteria
- [x] `blueprint/` exists with a top `README.md`, `v1/version.json`, and module READMEs for `design-thinking/`, `system-design/`, `specs/`, `backlog/`.
- [x] Each module README points to where CodeMaster's real artifact lives (no fabricated design-thinking content).
- [x] The backlog module is a **pointer** to the markdown backlog (two-serializations decision), not a JSON duplicate.
- [x] `scripts/ci.sh` green — all relative markdown links resolve.

## Verification
- `ls blueprint/v1/*/README.md` → four module READMEs.
- `bash scripts/ci.sh` → green (markdown-links rung resolves the new pointers).

## Notes
Requested: "add blueprint folder for this project even if we don't have design thinking etc." CodeMaster bootstrapped itself before the skills existed, so this is honest pointers, not retrofitted design docs. The conformance gate (`validate-blueprint.js`) scans `examples/` only, so this root `blueprint/` carries no schema-backed JSON to validate; if it ever gains real JSON, extend the validator's scan. Did **not** mirror the backlog to JSON — that would contradict the logged two-serializations decision and fork the source of truth.
