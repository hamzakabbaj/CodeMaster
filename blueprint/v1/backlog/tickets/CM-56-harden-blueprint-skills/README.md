# CM-56: Harden blueprint skills — fix guide paths, align step numbering, add schema-conformance CI rung

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** epic-d-docs-site-reference-showcase
- **Type:** task
- **Status:** ✅ done

## Goal
Make the design-thinking / technical-design skills internally consistent and turn their "output validates against the schema" promise into an enforced gate — three fixes surfaced by dogfooding a second worked example (TabSplit) through Steps 1–4.

## Acceptance criteria
- [x] **(C)** No skill guide references the pre-blueprint path `01_technical_design/…`; all point at `blueprint/{version}/system-design/…` (matches the `SKILL.md` repoint from CM-54).
- [x] **(G)** Every design-thinking `schema.json` `title` numbers its step to match the folder index (`01_project_brief` → "Step 1", … `20_gather_insights` → "Step 20"); internal cross-references (e.g. "Step 12") are corrected to the same scheme.
- [x] **(D)** A dependency-free `scripts/validate-blueprint.js` validates every populated blueprint `data.json` against its skill `schema.json`; empty `{}` stubs and guide-only steps (no schema) are skipped.
- [x] **(D)** The validator is wired into `scripts/ci.sh` and `.github/workflows/ci.yml` as a rung.
- [x] **(D)** `examples/etikets/blueprint/v1/version.json` is corrected to stop overstating completeness (4 steps are empty stubs).
- [x] `scripts/ci.sh` is green.

## Verification
- `node scripts/validate-blueprint.js` → validates both examples; passes (empty stubs + no-schema steps reported as skipped).
- `grep -rn "01_technical_design" .claude` → no matches.
- `bash scripts/ci.sh` → green, including the new conformance rung.

## Notes
Findings C, D, G from the TabSplit process test (Step 1–4 dogfood). Consolidated into one ticket: a single concern (blueprint-skill correctness + enforcement), kept as separate commits for review legibility. Findings A (local-first `api_design` variant), B (guide-only steps lack a contract), E (Design-Thinking "lite" altitude), F (rename database_schema → data model) were deferred.
The conformance gate is intentionally lenient on empty `{}` stubs (per decision) — it validates shape, not completeness.
