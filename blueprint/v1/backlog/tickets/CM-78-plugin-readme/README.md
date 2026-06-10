# CM-78: Add plugin/README.md — the consumer-facing front page

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-5-package-as-plugin-track-b
- **Type:** task
- **Status:** 🟦 in progress

## Goal
Give the codemaster plugin a README at its root (plugin/README.md) so that anyone who installs it — or browses the in-repo marketplace — lands on a clear orientation page, matching the convention every substantial official plugin follows (feature-dev, frontend-design).

## Acceptance criteria
- [ ] plugin/README.md exists at the plugin root (sibling of CHANGELOG.md and .claude-plugin/), and is the consumer-facing front page — written for someone who just installed codemaster@codemaster, not for a repo contributor.
- [ ] It covers: what CodeMaster is in one paragraph; how to install + refresh (marketplace add -> install; uninstall+reinstall to update, per CM-77); and a catalog of what the plugin provides — the commands (spec, start-ticket, ship, design-options), the skills (build, backlog, new-ticket, feature-intake, design-thinking, technical-design), the agents (architect, tester, devops, security, reviewer, librarian, code-explorer), and the hooks (block-no-verify, trace-subagent).
- [ ] It honestly states the cross-project caveat: several backlog/generation skills assume CodeMaster's own repo scripts, so installed into a foreign project the install primarily delivers the agents, hooks, and thin commands (links to docs/03 §6 for the full story). No overclaiming a turnkey foreign-repo experience.
- [ ] Markdown links resolve (passes scripts/check_links.py); no broken relative links into docs/.
- [ ] scripts/ci.sh green (9 rungs). The phase-5 epic is reopened to in_progress for the CM-78/CM-79 plugin-polish pair and re-closed to done in the final PR (CM-79) — this PR leaves it in_progress.

## Verification
Render-read the README; run scripts/check_links.py and bash scripts/ci.sh (both green). Confirm the file sits at plugin/README.md so it ships inside the plugin bundle (cross-checked against the official plugins' layout: feature-dev and frontend-design both ship LICENSE+README at plugin root).

## Plan
1) Reopen phase-5 epic -> in_progress. 2) Write plugin/README.md (overview / install+refresh / catalog of commands+skills+agents+hooks / cross-project caveat -> docs/03 §6). 3) check_links + ci green. 4) Re-close epic -> done in the same PR. 5) ship.

## Notes
Sourced from a diff against the official marketplace (feature-dev/frontend-design/stripe/chrome-devtools-mcp): the README is the one universal gap — our command frontmatter, manifest richness, and ${CLAUDE_PLUGIN_ROOT} hooks already match or exceed theirs. Deliberately scoped to JUST the README; the sibling findings (next-number.sh path fix, LICENSE-in-plugin, cross-project script strategy) were deferred by the user and can become their own tickets later.
