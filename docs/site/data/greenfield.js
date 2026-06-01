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
        "The full walkthrough of building from zero — from framing the problem to a shipped, reviewed, green merge. Every step grounded in the primitives CodeMaster actually ships, and run exactly the way this site was built.",
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
      title: "Five steps, end to end",
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

    /* ===== STEP 2 ===== */
    {
      type: "section",
      kicker: "Step 2 · how, broadly — and gate it",
      title: "/spec & the plan-review gate",
      intro:
        "Translate the approved design (<em>what &amp; why</em>) into a technical <strong>plan</strong> (<em>how</em>) — and stop for review before any code. <strong>Exit:</strong> an approved build blueprint for the whole feature.",
    },
    {
      type: "steps",
      kicker: "The sub-flow",
      title: "Feed the design in → read the plan → attack it → approve",
      items: [
        { title: "Feed the design to /spec", body: "Run <code>/spec</code> with the design as input — a feature description pointing at <code>design/&lt;project&gt;.md</code>. It's written to read a ticket <em>or</em> a feature, so at this altitude it takes the whole feature." },
        { title: "Read what it emits", body: "Problem &amp; intent, the <strong>constraints</strong> that must not change (CLAUDE.md invariants + the design's non-goals), testable acceptance criteria, the <strong>risks / unknowns</strong>, and the <strong>plan</strong>: the smallest sequence of steps, the files each touches, and which <em>ladder rung</em> verifies each." },
        { title: "Attack the plan — plan-review (Gate 2)", body: "<code>/spec</code> stops here on purpose. Be the discriminator: name the riskiest assumption and how you'll de-risk it; pull in the <code>architect</code> for a second pair of eyes. The cheapest place to fix a wrong approach is a plan with no code behind it." },
        { title: "Approve the blueprint", body: "The approved plan's build-sequence becomes the ticket order in Step 3. Keep it with the epic (a plan note) — lightweight, not ceremony." },
      ],
    },
    {
      type: "callout",
      title: "Two altitudes of /spec",
      html:
        "Here <code>/spec</code> runs at <strong>epic altitude</strong> — one coherent plan for the whole feature, <em>before</em> it's fragmented into tickets (you want the shape right before you slice). Later, in Step 4, a gnarly individual ticket can get its own <strong>ticket-altitude</strong> <code>/spec CM-n</code>. Most tickets just inherit this epic plan.",
    },
    {
      type: "callout",
      variant: "principle",
      title: "The gate that matters: plan-review",
      html:
        "A plan is the last artifact you can rewrite for free. Spend your scrutiny there — once code exists, every change costs more.",
    },
    { type: "divider" },

    /* ===== STEP 3 ===== */
    {
      type: "section",
      kicker: "Step 3 · slice into shippable work",
      title: "Backlog — from plan to tickets",
      intro:
        "Fragment the approved plan into small, ordered tickets that each meet the <strong>Definition of Ready</strong>. <strong>Exit:</strong> a dependency-ordered backlog under the epic in <code>ROADMAP.md</code>.",
    },
    {
      type: "steps",
      kicker: "The sub-flow",
      title: "Scaffold → slice vertically → meet DoR → refine just-in-time",
      items: [
        { title: "Scaffold each ticket with new-ticket", body: "The <code>new-ticket</code> skill takes the next id from <code>next-number.sh</code>, writes <code>backlog/tickets/CM-n-&lt;slug&gt;.md</code> from the template (goal · acceptance criteria · verification), and registers <code>- [ ] CM-n</code> under the epic in <code>ROADMAP.md</code>." },
        { title: "Slice vertically, one concern each", body: "Each ticket is finishable in one short-lived branch and delivers something verifiable end to end. Order them by the plan's dependency sequence. If a ticket's AC span unrelated changes, split it." },
        { title: "Meet the Definition of Ready", body: "Clear single-sentence goal · testable AC · deps known &amp; unblocked · small enough for one branch · verification approach identified. A ticket that can't state testable AC isn't ready to start." },
        { title: "Refine just-in-time", body: "Only elaborate a ticket when it's pulled into work — speculative over-specification is waste. <code>ROADMAP.md</code> is the index/status; the ticket file holds the detail. The <code>librarian</code> can check the two stay consistent." },
      ],
    },
    {
      type: "callout",
      variant: "principle",
      title: "The gate that matters: Definition of Ready",
      html:
        "DoR is the contract between planning and building. It's what lets <code>/start-ticket</code> assume the work is well-formed — and what stops a half-baked idea from becoming a branch.",
    },
    { type: "divider" },

    /* ===== STEP 4 ===== */
    {
      type: "section",
      kicker: "Step 4 · implement · verify · repeat",
      title: "Build — the robust-code loop",
      intro:
        "Per ticket: pull &amp; refine to Ready, branch, <strong>plan the implementation</strong>, then loop <strong>generate → verify → critique</strong> until green. <strong>Exit:</strong> a ticket whose acceptance criteria are met and demonstrated, on a branch, ladder green.",
    },
    {
      type: "steps",
      kicker: "The sub-flow",
      title: "Pull & refine → branch → plan → loop → checkpoint on green",
      items: [
        { title: "Pull the next ticket & refine it to Ready", body: "This is where Step 3's <em>just-in-time refinement</em> actually happens — there's no planning ceremony in continuous flow, so you refine at the pull. Take the next ticket by dependency order; flesh the rough line-item against the epic spec — sharpen the <strong>testable AC</strong>, confirm it's <strong>one concern</strong>, confirm deps are done/unblocked, split if it grew too big. That's <strong>Definition of Ready</strong> applied as the gate. Can't reach Ready because of unknowns? <strong>Spike it</strong> instead of starting blind. (Light for planned tickets — the epic spec did the thinking; heavier for emergent ones.)" },
        { title: "Branch with /start-ticket", body: "<code>/start-ticket CM-n</code> checks you're on an up-to-date <code>main</code>, cuts <code>feat/CM-n-&lt;slug&gt;</code>, and flips the ticket + ROADMAP status to 🟦 in progress. One ticket → one branch." },
        { title: "Plan the implementation", body: "The loop's <strong>Plan</strong> beat — <em>always</em>, even if it's a sentence in your head. Sketch the change across the stack: which <strong>backend / frontend / data</strong> layers, which files, in what order, verified by which tests (often test-first). Use <strong>plan mode</strong> to attack it before code exists. Fidelity scales with risk × uncertainty: a trivial ticket plans in-head; a gnarly one earns a written ticket-altitude <code>/spec CM-n</code>. Most tickets inherit the epic plan from Step 2 and only need a light local plan." },
        { title: "Loop: generate → verify → critique", body: "Generate against the plan; <strong>verify</strong> with the ladder (<code>scripts/ci.sh</code>: shell · JS · tests · JSON · links · commit — cheapest first, fail-fast); <strong>critique</strong> as the discriminator — design/security/perf, not just “does it run.” Lean on <code>tester</code> for edge cases, <code>security</code> for surface." },
        { title: "Checkpoint on green", body: "<code>scripts/checkpoint.sh</code> makes a green-gated commit — it <em>refuses</em> if the ladder is red, so every safe point is revertible. Conventional Commits are enforced by the <code>commit-msg</code> hook." },
      ],
    },
    {
      type: "code",
      caption: "The loop, on the command line",
      text:
        "/start-ticket CM-7                # branch off main · status -> in progress\n# …generate against the approved plan…\nsh scripts/ci.sh                  # the ladder — fail-fast, local mirrors CI\nscripts/checkpoint.sh \"feat: …\"   # green-gated commit (refuses on a red ladder)",
    },
    {
      type: "callout",
      title: "The cage stays on the whole time",
      html:
        "A PreToolUse hook blocks <code>git commit --no-verify</code>; the <code>commit-msg</code> hook rejects non-conforming messages. You <em>cannot</em> quietly bypass the gates — that's the point. Guarantees come from the cage, not from remembering to be careful.",
    },
    {
      type: "callout",
      variant: "principle",
      title: "The gate that matters: the green ladder",
      html:
        "Local <em>is</em> CI. Nothing advances on red, and the cheapest rung fails first — so you learn you're wrong in seconds, not in a ten-minute remote build.",
    },
    {
      type: "callout",
      title: "The feedback arrow: Build → Backlog",
      html:
        "Building ticket N is where you discover ticket N+3 — the edge case, the missing concern. The discipline when that happens: <strong>don't scope-creep the current branch.</strong> Park the discovery as a <em>new</em> ticket (one concern!), refined just-in-time when <em>it's</em> pulled. That's how the loop keeps the current PR focused <em>and</em> drives the backlog toward exhaustive — the cage catching what up-front slicing missed.",
    },
    { type: "divider" },

    /* ===== STEP 5 ===== */
    {
      type: "section",
      kicker: "Step 5 · review &amp; merge with guarantees",
      title: "Ship — PR → review → green CI → merge",
      intro:
        "Get each ticket reviewed and merged behind enforced gates. <strong>Exit:</strong> ticket ✅ in <code>ROADMAP.md</code>, branch merged, <code>main</code> green.",
    },
    {
      type: "flow",
      kicker: "The merge path",
      nodes: ["Push + PR", "Automated review", "Human review", "Green CI", "Squash-merge", "Verify main"],
    },
    {
      type: "steps",
      kicker: "The sub-flow",
      items: [
        { title: "Open a PR with the template", body: "Push the branch; the PR uses the repo template — <strong>What · Why · Test · Risk</strong> + the Definition of Done checklist. The description is the argument <em>for</em> the change." },
        { title: "Automated review first", body: "The <code>reviewer</code> agent (read-only git) and/or the <code>review-board</code> workflow fan out across correctness / security / design with <strong>adversarial verification</strong> — N skeptics try to refute each finding; only survivors surface. On its first run this caught a real correctness bug the unit tests missed." },
        { title: "Human review second", body: "With the noise cleared, human judgment goes where it's scarce — design, security, performance — not lint a machine already checked." },
        { title: "Green CI, then squash-merge", body: "GitHub Actions runs the <em>same</em> ladder; a red PR can't merge. Squash-merge → delete branch (the <code>commit-msg</code> hook tolerates the squash <code>(#n)</code> suffix). Hard branch protection is staged (CM-35) — meanwhile the cage + discipline hold." },
        { title: "Close the loop", body: "Flip the ticket + ROADMAP to ✅ and <strong>verify post-merge <code>main</code> CI is green</strong> — a standing step after every merge. Repeat per ticket until the epic's tickets are all ✅: the greenfield MVP is shipped." },
      ],
    },
    {
      type: "callout",
      variant: "principle",
      title: "The gate that matters: green CI + the post-merge check",
      html:
        "A merge is only as trustworthy as the gate a machine enforces. The PR's green ladder is the merge bar; the post-merge <code>main</code> check is the proof the merge didn't break the trunk.",
    },
    { type: "divider" },

    {
      type: "callout",
      title: "This is how CodeMaster built itself",
      html:
        "Every page on this site shipped through exactly this arc — design → plan → slice → loop → ship — dogfooded ticket by ticket from <code>CM-7</code> onward. See <a href=\"loop.html\">The Loop</a> for the engine inside Step 4, <a href=\"delivery.html\">Delivery</a> for the pipeline these steps ride, and the <a href=\"roadmap.html\">Roadmap</a> for the receipts.",
    },
  ],
};
