# CM-74: Spike: can CodeMaster's primitives ship as an in-repo @skills-dir plugin?

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-5-package-as-plugin-track-b
- **Type:** spike
- **Status:** ✅ done

## Goal
Before the Phase-5 migration, verify by running whether CodeMaster's primitives can be packaged as an @skills-dir plugin, and how plugin components behave — so we don't bulk-migrate on doc-reading alone.

## Acceptance criteria
- [x] Answered by running on Claude Code 2.1.169: does an @skills-dir plugin load? do components namespace? are workflows plugin-packageable? what scope/runtime constraints apply?
- [x] Decision recorded with the viable path and the migration's concrete constraints
- [x] All throwaway probes deleted + disabled (project-scope hand-built AND personal-scope plugin-init) — prototypes never shipped (spike discipline)

## Verification
First a hand-built PROJECT-scope probe (.claude/skills/cmplugin-probe/) did NOT load (across 2.1.71 and 2.1.169). Re-checking the creation docs revealed the official scaffolder: `claude plugin init cmprobe --with skills agents hooks` -> ~/.claude/skills/cmprobe/. That plugin LOADED: `claude plugin list` shows `cmprobe@skills-dir  Status: ✔ loaded`, and its root skill appeared in the live skills registry. So the mechanism works; the first failure was construction + scope, not a fundamental block.

## Plan
Spike concluded (GO). Phase-5 migration epic: `claude plugin init codemaster` at project scope; migrate skills/agents/commands/hooks; root SKILL.md as entry; python3/node hooks (not bun); REWRITE namespaced cross-references; keep workflows project-level; document trust-gate + launch-from-root (or go marketplace); require CC >= 2.1.154; test install in a clean clone. Cleanup done: both throwaway probes disabled + deleted.

## Notes
DECISION: GO — @skills-dir plugin packaging IS viable on Claude Code >= 2.1.154 (verified on 2.1.169). Corrects the earlier premature NO-GO. WHY the first probe failed: (a) PROJECT scope (<repo>/.claude/skills/) is trust-gated and only loads when launched from the repo root; (b) our hand-built folder lacked the root SKILL.md that `claude plugin init` creates (manifest has "skills":["./"], so the plugin's entry skill IS the root SKILL.md). CONSTRAINTS for the Phase-5 migration: (1) scaffold with `claude plugin init`; (2) CodeMaster wants PROJECT scope (checked into the repo so collaborators get it on clone) -> document the trust-gate + launch-from-repo-root requirement, OR distribute via a marketplace; (3) WORKFLOWS are NOT a plugin component (`init --with` offers skills/agents/hooks/mcp/lsp/output-style/channel, no workflows) -> review-board/build-critique stay project-level (or are invoked by a bundled skill); (4) NAMESPACING — a plugin's root skill keeps the plain plugin name, but bundled agents/commands namespace as <plugin>:<component> (evidence: feature-dev:code-explorer) -> our bare /spec, /build, /ship, code-explorer cross-references will need updating; (5) HOOKS — init defaults to a `bun` handler (not installed here); use python3/node instead (doc-supported), matching our deps; (6) requires CC >= 2.1.154 (defaultEnabled). Until the migration runs, KEEP the working project-level .claude/{skills,agents,commands,hooks,workflows}.
