# CM-54 — Evidence (proof of done)

- **PR:** #31
- **Green CI run:** GitHub Actions "Quality gates" on PR #31 + post-merge `main`
- **Tests / gates:** the 6-rung `scripts/ci.sh` (JSON validity rung over the surviving `schema.json`; markdown-links rung)

## Acceptance criteria → demonstrated
- [x] Product-rendering files removed — `find` for `*.tsx`/`*.scss`/`mock`/`module.json`/`actions.json` returns nothing; 26 survivors are only SKILL.md/schema.json/guide.md
- [x] `design-thinking` → `blueprint/{version}/design-thinking/{step}/data.json`; `technical-design` → `blueprint/{version}/system-design/{step}/…` — grep confirms both paths present
- [x] Both frontmatters add `Write`; workflow step 4 instructs persisting the validated output
- [x] "Review prior steps" reads from `blueprint/`, not `data/` — grep for `data/{version}`/underscore paths returns none
- [x] `scripts/ci.sh` green

## Output (small text only)
```
$ find skills -name '*.tsx' -o -name '*.scss' -o -path '*/mock/*' … → (none)
$ grep 'data/{version}|design_thinking|technical_design' SKILL.md → (none — clean)
$ grep 'allowed-tools' SKILL.md → both: Bash, Read, Glob, Write
$ sh scripts/ci.sh | tail -1 → ✓ CI passed
```

## Scope note
Engines wired only. The worked JSON blueprint in `examples/etikets/` is CM-55.
