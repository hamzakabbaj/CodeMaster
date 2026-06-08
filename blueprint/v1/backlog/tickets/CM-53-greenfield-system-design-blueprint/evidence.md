# CM-53 — Evidence (proof of done)

- **PR:** #30
- **Green CI run:** GitHub Actions "Quality gates" on PR #30 + post-merge `main`
- **Tests / gates:** the 6-rung `scripts/ci.sh` (incl. `node --check` on `greenfield.js`)

## Acceptance criteria → demonstrated
- [x] Arc shows **six** steps (Design Thinking · System Design · /spec · Backlog · Build · Ship) — chrome-devtools snapshot: 6 arc nodes; "Six steps, end to end"
- [x] New **Step 2 — System Design** stepgroup with I/O table, sub-flow (architecture · API · DB schema · design system), design-doc review gate, PRD+TDD parallel, altitude note — verified expanded via chrome-devtools
- [x] `blueprint/` layout documented (code block) — `blueprint/v1/{design-thinking,system-design,specs,backlog}/`, versioned
- [x] Artifact chain + I/O tables repoint upstream to `blueprint/v1/…`; Steps 3–6 renumbered
- [x] Reconciliation callout (JSON blueprint vs CodeMaster's markdown variant) renders
- [x] Both skills cited as engines (`design-thinking` Step 1, `technical-design` Step 2)
- [x] `file://` render, **zero console errors**; full 6-rung ladder green

## Output (small text only)
```
$ node --check docs/site/data/greenfield.js → JS OK
$ sh scripts/ci.sh | tail -1 → ✓ CI passed
chrome-devtools: list_console_messages → <no console messages found>
chrome-devtools: arc = [1·Design Thinking, 2·System Design, 3·/spec, 4·Backlog, 5·Build, 6·Ship]
chrome-devtools: expanded Step 2 → renders architecture/API/data-model/design-system sub-flow + gates
```

## Scope note
Docs-only. Skill rewiring (Ticket B) and `examples/etikets/` JSON conversion (Ticket C) are deliberately out of scope.
