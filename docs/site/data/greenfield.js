/* Greenfield, in detail — a step-by-step deep dive into Playbook 01.
   Detailed one step at a time. Step 1 (Design Thinking) is complete;
   Steps 2-5 are the arc to come. Grounded in CodeMaster's real primitives. */
window.CM = window.CM || {};
window.CM.pages = window.CM.pages || {};
window.CM.pages.greenfield = {
  title: "Greenfield, in detail",
  blocks: [
    {
      type: "hero",
      kicker: "Playbook 01 · deep dive",
      title: "Greenfield, in detail",
      subtitle:
        "The full walkthrough of building from zero — where uncertainty is highest and the expensive mistake is building the wrong thing. We detail one step at a time, grounded in the primitives CodeMaster actually ships. <strong>Step 1 — Design Thinking — is below.</strong>",
      actions: [
        { label: "← All playbooks", href: "playbooks.html" },
      ],
    },
    {
      type: "callout",
      title: "The running example",
      html:
        "A brand-new internal <strong>analytics dashboard</strong> — no code, no users, nothing decided yet. We build it the CodeMaster way and watch each gate earn its keep.",
    },
    {
      type: "flow",
      kicker: "The greenfield arc",
      title: "Five steps — detailed one at a time",
      nodes: ["1 · Design", "2 · /spec", "3 · Backlog", "4 · Build", "5 · Ship"],
    },
    { type: "divider" },

    /* ===== STEP 1 ===== */
    {
      type: "section",
      kicker: "Step 1 · collapse uncertainty before code",
      title: "Design Thinking",
      intro:
        "Decide <em>what</em> we're building and <em>why</em>, and converge on an approach — before a single line of code exists. <strong>Exit:</strong> an approved, committed <code>design.md</code> that the backlog and every later <code>/spec</code> must conform to.",
    },
    {
      type: "table",
      kicker: "Where it sits",
      title: "Design (Step 1) vs /spec (Step 2)",
      intro: "Two different altitudes, two different gates. Design is broad and upstream; <code>/spec</code> is narrow and per-ticket.",
      headers: ["", "Altitude", "Decides", "Artifact", "Gate"],
      rows: [
        ["<strong>Step 1 — Design</strong>", "Epic / project", "What &amp; why; which approach", "<code>design.md</code> + throwaway wireframe", "Design-review"],
        ["<strong>Step 2 — /spec</strong>", "One ticket", "How to build a slice", "spec + plan in the ticket", "Plan-review"],
      ],
    },
    {
      type: "steps",
      kicker: "The sub-flow",
      title: "Diverge → make tangible → converge → review → approve",
      items: [
        { title: "Frame the problem", body: "Problem, target users, success criteria, and explicit <strong>non-goals</strong>. You wear the PM hat here. The test: if you can't state what this <em>won't</em> do, it isn't framed yet." },
        { title: "Diverge — 2–3 real options", body: "Sketch genuinely different approaches — architecture <em>and</em> UX — each with its tradeoffs. Resist converging early; the cheapest pivot is the one on paper." },
        { title: "Make it tangible — wireframe (UI work only)", body: "Generate a low-fidelity <strong>HTML wireframe</strong> with the <code>frontend-design</code> skill into the gitignored <code>prototypes/</code> folder. Open it over <code>file://</code>, walk the primary flows, feel the information architecture. It's a thinking aid — disposable by design." },
        { title: "Converge — write the decision", body: "Pick one option and write it into <code>design.md</code>: the choice, <em>why</em>, and why-<em>not</em> the rejected alternatives. That's a lightweight ADR — the rationale of record that outlives the debate." },
        { title: "Design review — Gate 1", body: "Hand <code>design.md</code> to the <code>architect</code> subagent (read-only, opus): where does complexity live? what will rot? which boundary breaks? Add <code>security</code> if the surface is risky. Its job is to attack the design while changing it is still free." },
        { title: "Approve", body: "You resolve the review and sign off. <strong>“Design done”</strong> is the entry condition that unlocks backlog slicing and <code>/spec</code> — not before." },
      ],
    },
    {
      type: "code",
      caption: "Where the Step-1 artifacts live",
      text:
        "design/\n  analytics-dashboard.md      # committed · reviewed · the rationale of record\n                              # (named for the PROJECT — it exists before any CM-<n> ticket)\n\nprototypes/                   # gitignored — never committed, never seen by CI\n  analytics-dashboard/\n    index.html                # file:// wireframe (UI work only), thrown away after",
    },
    {
      type: "callout",
      html:
        "Because the wireframe is <strong>never committed</strong>, the CI-fencing problem disappears: not versioned = the ladder never sees it. The only durable Step-1 artifact is <code>design.md</code> — and in greenfield it's named for the <em>project</em>, because it exists <em>before</em> any ticket. Tickets get sliced from it in Step 3.",
    },
    {
      type: "cards",
      kicker: "A resolved principle",
      title: "Design altitude follows work altitude",
      intro: "The same wireframe-and-review loop runs at two scales. Only where the durable rationale is filed changes.",
      columns: 2,
      items: [
        { tag: "this playbook · greenfield", title: "Global design", body: "Whole-project shape: IA, primary screens, the main flows, the architectural skeleton. Lives in <code>design/&lt;project&gt;.md</code> and exists <strong>before any ticket</strong>." },
        { tag: "see: brownfield", title: "Ticket-scoped design", body: "The same loop in miniature, for a change to an existing project. The design note rides <strong>with the ticket</strong> (a <code>## Design</code> section) — no project-level <code>design.md</code> needed." },
      ],
    },
    {
      type: "callout",
      variant: "principle",
      title: "The gate that matters: design-review",
      html:
        "Uncertainty is highest before code exists — so that's exactly where the scrutiny goes. The <code>architect</code> review on <code>design.md</code> is the cheapest place on earth to kill a wrong approach. Passing it is what makes “design done” mean something instead of being a vibe.",
    },
    {
      type: "callout",
      title: "Mechanics — even the design rides the cage",
      html:
        "<code>design.md</code> is reviewable work, so it travels the normal path: a <code>feat/&lt;slug&gt;-design</code> branch → PR → <code>architect</code> review → merge. No direct-to-main, design included. The wireframe never leaves your machine (gitignored <code>prototypes/</code>); if you want to preserve a view, paste a screenshot into <code>design.md</code> — otherwise it's ephemeral.",
    },
    {
      type: "callout",
      title: "What we'd add to ship this",
      html:
        "Step 1 reuses the <code>architect</code> agent and the <code>frontend-design</code> skill — both already exist. New, small, additive: the <code>design/</code> convention + a <code>design.md</code> template, and one <code>.gitignore</code> line for <code>prototypes/</code>. A <code>new-design</code> scaffolder could come later — but we'll hand-author the first design doc to find the template's shape, exactly how <code>new-ticket</code> was earned.",
    },
    { type: "divider" },
    {
      type: "callout",
      title: "Up next — Step 2: /spec & the plan-review gate",
      html:
        "With the design approved, we drop to ticket altitude: slice the backlog, then <code>/spec</code> each ticket into a plan and <strong>stop at plan-review before code</strong>. We'll detail it next — including the order in which slicing and spec actually happen.",
    },
  ],
};
