# CM-27: Bundle hooks as a plugin component + verify the full component inventory

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-5-package-as-plugin-track-b
- **Type:** task
- **Status:** 🟦 in progress

## Goal
Complete the plugin unit's components: add `.claude/hooks/hooks.json` so the hooks ship as a plugin component (they previously only registered via `.claude/settings.json`, which is project-native and does NOT ship), keep it from drifting from settings.json, and verify the full component inventory (skills/agents/commands/hooks) resolves.

## Acceptance criteria
- [ ] `.claude/hooks/hooks.json` exists in the plugin-hook schema (`{"hooks": {EventName: [{matcher, hooks:[...]}]}}`), mirroring `.claude/settings.json`'s two hooks: PreToolUse(Bash, if Bash(git *)) -> block-no-verify.sh and SubagentStop(code-explorer|reviewer|architect|security|tester) -> trace-subagent.sh, using `${CLAUDE_PLUGIN_ROOT}` paths
- [ ] Drift guard: `tests/test_hooks_sync.py` asserts settings.json and hooks.json are semantically identical (event, matcher, handler-script basename, if, timeout, statusMessage) — ignoring only the CLAUDE_PROJECT_DIR vs CLAUDE_PLUGIN_ROOT path prefix. It runs in the EXISTING unit-test rung (rung 3) in both ci.sh and ci.yml — no new rung, no renumbering. Proven to FAIL on injected drift.
- [ ] `claude plugin validate .claude` passes (exit 0); the component inventory (verified via a throwaway install) shows Hooks (2) PreToolUse + SubagentStop alongside the skills/agents/commands
- [ ] Workflows (`.claude/workflows/*.mjs`) are documented as NOT a plugin component (the `init --with` set has no workflows) — they stay project-level; the validator ignores them, so they don't break packaging
- [ ] No double-firing risk in-repo: the repo loads `.claude/` natively (settings.json runs the hooks); hooks.json is the packaged mirror, inert unless the plugin is installed (which we don't do). scripts/ci.sh green.
- [ ] scripts/ci.sh green

## Verification
Wrote .claude/hooks/hooks.json (CLAUDE_PLUGIN_ROOT paths). `claude plugin validate .claude` -> passed with warnings (if/timeout/statusMessage accepted). Throwaway install of a .claude copy via a local marketplace -> `claude plugin details` showed `Hooks (2) PreToolUse, SubagentStop (harness-only — no model context cost)` plus Skills (10) + Agents (8); cleaned up (no residue). tests/test_hooks_sync.py: green in sync, FAILED when a timeout was perturbed, restored -> green. bash scripts/ci.sh green.

## Plan
1) Write .claude/hooks/hooks.json mirroring settings.json (CLAUDE_PLUGIN_ROOT). 2) Validate. 3) Drift guard as tests/test_hooks_sync.py (runs in existing unittest rung — no ci renumbering); prove it catches drift. 4) Confirm inventory via throwaway install (Hooks 2), clean up. 5) Document workflows-out-of-band. 6) ci green.

## Notes
Descoped from the original broad 'Bundle agents + hooks + skills + commands + workflows' stub: agents/skills/commands were ALREADY discoverable once CM-26 added plugin.json (they live in the standard .claude/{skills,agents,commands} dirs). The only component that needed explicit wiring was HOOKS (plugin hooks register via hooks.json, not settings.json). Workflows can't be a component. So this ticket = hooks.json + drift guard + inventory verification. Folder/slug renamed bundle-agents-hooks-skills-commands-workflows -> bundle-hooks. Known cosmetic: `.claude/agents/README.md` registers as a phantom 'README' agent in the inventory (the cost of CM-26's lenient-validate decision to keep the load-bearing roster doc); harmless since we never install in-repo.
