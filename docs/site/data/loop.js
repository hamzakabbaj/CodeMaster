/* The Robust-Code Loop. Source doctrine: docs/02-robust-code-process.md */
window.CM = window.CM || {};
window.CM.pages = window.CM.pages || {};
window.CM.pages.loop = {
  title: "The Loop",
  blocks: [
    {
      type: "hero",
      kicker: "Doc 02",
      title: "The Robust-Code Loop",
      subtitle:
        "Beginners ship the first draft. The leverage is the <strong>loop</strong> around generation — and your judgment is the discriminator inside it. The model is interchangeable; the harness is yours.",
    },
    {
      type: "callout",
      variant: "principle",
      title: "Core principle",
      html:
        "Be the <strong>discriminator</strong>, not just the generator. Spot the N+1, the leaky abstraction, the concurrency bug — read 200 lines of plausible code and find the one that's wrong.",
    },
    {
      type: "steps",
      kicker: "The loop",
      title: "Spec → verify → critique",
      items: [
        { title: "Spec", body: "Write intent, constraints, acceptance criteria <em>before</em> any code. Vague spec → plausible-but-wrong output." },
        { title: "Plan", body: "Use plan mode; attack the plan before code exists. Cheapest place to catch design error." },
        { title: "Generate", body: "Let the model write against the approved plan." },
        { title: "Verify", body: "Deterministic gates run automatically. Failures feed back as the next prompt." },
        { title: "Critique", body: "You read for what tests can't catch: design rot, hidden coupling, security, perf under load." },
        { title: "Checkpoint / rollback", body: "Commit on green; revert broken iterations instead of patching forward." },
      ],
    },
    {
      type: "flow",
      kicker: "The verification ladder",
      title: "Cheapest first, fail fast",
      nodes: ["lint", "tests", "typecheck", "integration", "e2e", "human review", "prod observability"],
    },
    {
      type: "code",
      caption: "this repo's concrete ladder — scripts/ci.sh, mirrored in CI",
      text: "▸ 1/5  Shell lint      (shellcheck)\n▸ 2/5  Unit tests      (python -m unittest)\n▸ 3/5  JSON validity\n▸ 4/5  Markdown links\n▸ 5/5  Commit message   (Conventional Commits)\n\nset -e — one red rung stops the ladder. A gate that false-greens is worse than none.",
    },
    {
      type: "table",
      kicker: "What lives in code, not trust",
      title: "Move guarantees from discipline to enforcement",
      headers: ["Concern", "Mechanism"],
      rows: [
        ["Formatting / style", "PostToolUse hook + formatter"],
        ["Type / compile correctness", "typecheck rung"],
        ["Behavioral correctness", "tests (unit → integration → e2e)"],
        ["Secrets / dangerous commands", "PreToolUse hook (deny)"],
        ["Architectural boundaries", "lint rules + “never touch X” hook"],
        ["Coverage / regressions", "CI gate on PR"],
      ],
    },
    {
      type: "cards",
      kicker: "Definition of Done",
      title: "Before a change is truly done",
      columns: 2,
      items: [
        { title: "Spec met & demonstrated", body: "Acceptance criteria satisfied, with output/run shown." },
        { title: "All rungs green", body: "Locally (ci.sh) and in CI — the same checks in both places." },
        { title: "Tests added", body: "Meaningful coverage where there's code." },
        { title: "Reviewed for design/security/perf", body: "Not just “does it run.”" },
        { title: "Observable in prod", body: "Logs / metrics / traces wired before release." },
        { title: "Docs & status updated", body: "CLAUDE.md / ROADMAP reflect the change." },
      ],
    },
  ],
};
