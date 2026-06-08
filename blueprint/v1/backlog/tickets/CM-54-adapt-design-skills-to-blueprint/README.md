# CM-54: Adapt the design-thinking & technical-design skills to CodeMaster

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** epic-d-docs-site-reference-showcase
- **Type:** task
- **Status:** ✅ done

## Goal
Make the two imported skills CodeMaster-native: prune the EtiKets React rendering layer, give them `Write`, and repoint their output storage from `data/{version}/…` to the `blueprint/{version}/…` structured record.

## Acceptance criteria
- [x] All product-rendering files removed from both skills — `View.tsx`, `View.module.scss`, `mock/`, and the EtiKets `module.json` manifests — keeping only `SKILL.md`, `schema.json`, and `guide.md`
- [x] `design-thinking` writes to `blueprint/{version}/design-thinking/{step_name}/data.json`; `technical-design` writes to `blueprint/{version}/system-design/{step_name}/…` (matching the greenfield doctrine: the engine is `technical-design`, the folder is `system-design`)
- [x] Both SKILL.md frontmatters add `Write` to `allowed-tools`, and the workflow instructs the skill to persist its validated output to that path
- [x] The "review prior steps" guidance reads prior data from the new `blueprint/` path, not `data/`
- [x] `scripts/ci.sh` green (the JSON rung validates the surviving `schema.json`/data fixtures)

## Verification
`grep` confirms no `.tsx`/`.scss`/`mock`/`module.json` remain under the skills and no `data/{version}` storage references survive in either SKILL.md. Full ladder green.

## Notes
Decisions (this session): **prune** the React layer entirely (not relocate); **add `Write`** so the skills persist their own output (autonomous over advisory). Naming: the `technical-design` skill is the *engine* for the greenfield **System Design** step, so it writes into `blueprint/v1/system-design/` (skill name ≠ folder name, by design). Follow-up Ticket C converts `examples/etikets/` into a worked JSON blueprint using these adapted skills.

## Evidence
See [evidence.md](evidence.md).
