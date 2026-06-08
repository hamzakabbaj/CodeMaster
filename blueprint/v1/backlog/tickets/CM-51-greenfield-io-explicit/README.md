# CM-51: Greenfield page — make each step's input/output/location explicit

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** epic-d-docs-site-reference-showcase
- **Type:** task
- **Status:** ✅ done

## Goal
Make the greenfield deep-dive explicit, per step, about what goes in, what comes out, and where the output is saved — so the page reads as an artifact chain, not just activities.

## Acceptance criteria
- [x] Each of the 5 steps gains a compact Input / Output / "Where it lives" table (with concrete paths: `design/<project>.md`, `specs/<epic>.spec.md`, `ROADMAP.md`, `backlog/tickets/CM-n-<slug>/{README,plan,evidence}.md`, the `feat/CM-n-<slug>` branch, `main`)
- [x] An "artifact chain" overview near the top shows the outputs flowing step→step (each output = next input)
- [x] Each step is a **collapsible** `<details>` group (native, `file://`-safe, no JS) for navigation — new `stepgroup` renderer block + matching `style.css`
- [x] Paths are consistent with the folder-per-ticket convention (CM-49/50) and the EtiKets example
- [x] Renders over `file://` with zero console errors; expand/collapse works; CI ladder green

## Verification
chrome-devtools MCP on `greenfield.html` → no console errors, the I/O tables + artifact-chain render. `node --check` clean. Full ladder green.

## Notes
Adds a `stepgroup` renderer block (collapsible `<details>/<summary>`) used only on greenfield (additive — other pages unaffected). Output location for the epic plan standardized as `specs/<epic>.spec.md`, matching the EtiKets showcase.

## Evidence
See [evidence.md](evidence.md).
