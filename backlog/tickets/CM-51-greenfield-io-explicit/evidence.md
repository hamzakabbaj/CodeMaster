# CM-51 — Evidence (proof of done)

- **PR:** #28
- **Green CI run:** GitHub Actions "Quality gates" on PR #28 + post-merge `main`
- **Tests / gates:** the 6-rung `scripts/ci.sh` (incl. `node --check` on `render.js` + `greenfield.js`)

## Acceptance criteria → demonstrated
- [x] Per-step Input/Output/"Where it lives" tables — verified via chrome-devtools snapshot (each step's table renders with concrete paths)
- [x] Artifact-chain flow near the top — renders: `design/<project>.md → specs/<epic>.spec.md → ROADMAP + tickets/ → branch + plan.md → main + evidence.md`
- [x] Collapsible steps (`stepgroup` → native `<details>`) — **toggle confirmed**: clicked Step 2 → expanded; clicked Step 1 → collapsed; Steps 3–5 stay collapsed
- [x] `file://` render with **zero console errors**; full 6-rung ladder green

## Output (small text only)
```
$ node --check docs/site/assets/render.js docs/site/data/greenfield.js → JS OK
$ sh scripts/ci.sh | tail -1 → ✓ CI passed
chrome-devtools: list_console_messages → <no console messages found>
chrome-devtools: click(Step 2 summary) → expanded; click(Step 1 summary) → collapsed
```
