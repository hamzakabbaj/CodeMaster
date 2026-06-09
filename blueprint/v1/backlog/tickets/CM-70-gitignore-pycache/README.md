# CM-70: Stop tracking Python bytecode: untrack __pycache__ and gitignore *.pyc

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-0-delivery-infrastructure
- **Type:** fix
- **Status:** ✅ done

## Goal
Remove the __pycache__/*.pyc artifacts that leaked into main via #46 and add the .gitignore rule that prevents the test rung's bytecode from ever being committed again.

## Acceptance criteria
- [x] scripts/__pycache__/ and tests/__pycache__/ are untracked (git rm --cached); no *.pyc remains tracked (git ls-files shows none)
- [x] .gitignore ignores __pycache__/ and *.py[cod] so a `git add -A` after the test rung can never re-stage bytecode
- [x] scripts/ci.sh green (8 rungs)

## Verification
git ls-files | grep -E '__pycache__|\.pyc$' returns nothing; bash scripts/ci.sh green. Root cause: ci.sh's unittest rung generates __pycache__, and a broad `git add -A` swept it in because the path wasn't ignored — the deterministic fix is the .gitignore rule.

## Notes
Caught by reading the `gh pr merge #46` output, which listed two .pyc files in the squash — they had leaked to main. The cage didn't catch it because the JSON/lint rungs scan git-tracked files, not stray bytecode, and __pycache__ was never gitignored. Fixing the ignore rule is the prefer-code-over-instruction fix; no CI rung needed. Honest note: I introduced the leak via `git add -A` during CM-69 — this fix also protects every future ticket that runs the test rung before staging.
