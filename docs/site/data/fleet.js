/* The Fleet & Orchestration. Source: docs/04-team-profiles.md, docs/05-orchestration.md */
window.CM = window.CM || {};
window.CM.pages = window.CM.pages || {};
window.CM.pages.fleet = {
  title: "The Fleet",
  blocks: [
    {
      type: "hero",
      kicker: "Doc 04 · 05",
      title: "The Fleet & Orchestration",
      subtitle:
        "Each Big-Tech role becomes a <strong>subagent persona</strong> with scoped tools and a routed model. A workflow then runs them as a pipeline — a review board with adversarial verification.",
    },
    {
      type: "cards",
      kicker: "The fleet",
      title: "Role-based subagents (least privilege)",
      items: [
        { tag: "sonnet · read-only", title: "librarian", body: "Navigates & consistency-checks our own docs/ROADMAP/backlog.", meta: "Read · Grep · Glob" },
        { tag: "sonnet · read-only", title: "code-explorer", body: "Maps existing code before you change it — execution paths, dependencies, blast radius. Brownfield, and greenfield once it outgrows your context.", meta: "Read · Grep · Glob" },
        { tag: "opus · read-only", title: "architect", body: "Design review vs doctrine: where complexity lives, what will rot.", meta: "Read · Grep · Glob" },
        { tag: "sonnet · read-only", title: "tester", body: "Adversarial test design — finds the edge cases you didn't.", meta: "Read · Grep · Glob" },
        { tag: "sonnet · read-only", title: "devops", body: "Gates, CI, reproducibility; hunts silent skips & local↔CI drift.", meta: "Read · Grep · Glob" },
        { tag: "opus · read-only", title: "security", body: "Threat model: secrets, injection, untrusted input, blast radius.", meta: "Read · Grep · Glob" },
        { tag: "sonnet · read git", title: "reviewer", body: "PR review vs conventions & Definition of Done.", meta: "+ Bash (read-only git)" },
      ],
    },
    {
      type: "callout",
      variant: "principle",
      title: "Cross-cutting principles",
      html:
        "<strong>Least privilege</strong> — each agent gets only the tools its job needs; none can Edit/Write (they advise, the main thread changes). <strong>Model routing</strong> — opus for open-ended reasoning, sonnet for enumerate/summarize.",
    },
    {
      type: "flow",
      kicker: "The review board",
      title: "Orchestration as a pipeline",
      nodes: ["Review (per dimension)", "Verify (skeptics refute)", "Synthesize (survivors)"],
    },
    {
      type: "steps",
      kicker: "Adversarial verification",
      title: "Why findings get challenged",
      items: [
        { title: "Fan out by dimension", body: "Correctness, security, design — each reviewed independently (sonnet)." },
        { title: "Refute each finding", body: "N cheap skeptics (haiku) try to <em>disprove</em> each finding; default to refuted when uncertain." },
        { title: "Keep only survivors", body: "A finding is killed if a majority refute it — plausible-but-wrong claims don't survive." },
      ],
    },
    {
      type: "callout",
      title: "Proven live",
      html:
        "On its first bounded run (11 agents, ~130s), the review board considered 4 findings → confirmed 3 — and caught a <strong>real correctness bug the unit tests missed</strong> (a path that crashed on directory input). The orchestration found what the test rung didn't.",
    },
  ],
};
