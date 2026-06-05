/* Greenfield, in detail — a step-by-step deep dive into Playbook 01.
   Each step is a collapsible stepgroup (native <details>) for navigation,
   and opens with an Input / Output / where-it-lives table — the artifact
   chain. Grounded in CodeMaster's real primitives + folder-per-ticket. */
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
      title: "Six steps, end to end",
      nodes: ["1 · Design Thinking", "2 · System Design", "3 · /spec", "4 · Backlog", "5 · Build", "6 · Ship"],
    },
    {
      type: "flow",
      kicker: "The artifact chain — each step's output is the next step's input",
      nodes: ["blueprint/design-thinking/", "blueprint/system-design/", "blueprint/specs/", "blueprint/backlog/", "branch + plan.md", "main + evidence.md"],
    },
    {
      type: "callout",
      title: "Where it all lives: the blueprint/",
      html:
        "Everything upstream of code — the product discovery, the system design, the epic plan, the sliced backlog — is the project's <strong>structured record of intent</strong>. It lives in one versioned folder: <code>blueprint/</code>. It's <strong>machine-readable on purpose</strong> (JSON where there's a schema): a structured record is one a tool can validate, diff, generate from, and dashboard — not just a doc a human reads. Code is downstream of it.",
    },
    {
      type: "code",
      caption: "blueprint/ — the structured project record (versioned; v1, v2, … let you re-run discovery without clobbering history)",
      text:
        "blueprint/\n  v1/\n    design-thinking/            # Step 1 — what & why · users · IA (design-thinking skill)\n      01_project_brief/data.json\n      05_persona/data.json\n      …17 steps, each schema-validated JSON…\n      17_wireframing_prototyping/   # the one non-JSON artifact: HTML wireframes\n    system-design/              # Step 2 — how it's built (technical-design skill)\n      01_architecture/data.json\n      02_api_design/data.json\n      03_database_schema/schema.dbml\n      04_design_system/          # design tokens + component gallery\n    specs/                      # Step 3 — the epic plan, /spec (narrative)\n      <epic>.spec.md\n    backlog/                    # Step 4 — sliced, ordered work\n      roadmap.json\n      tickets/CM-1.json …",
    },
    { type: "divider" },

    /* ===== STEP 1 ===== */
    {
      type: "stepgroup",
      kicker: "Step 1 · collapse uncertainty before code",
      title: "Design Thinking",
      open: true,
      intro:
        "Decide <em>what</em> we're building and <em>why</em>, and converge on an approach — before a single line of code exists. The engine is the <code>design-thinking</code> skill: a 6-phase, 20-step methodology (Brief → Empathize → Define → Ideate → Prototype → Test), each step schema-validated. <strong>Exit:</strong> an approved <code>design-thinking</code> record that the system design, backlog, and every later <code>/spec</code> must conform to.",
      blocks: [
        {
          type: "table",
          kicker: "Input · Output · Where it lives",
          headers: ["", "What", "Where it lives"],
          rows: [
            ["<strong>Input</strong>", "the raw idea / problem", "— nothing committed yet"],
            ["<strong>Output</strong>", "approved design-of-record (what/why · users · IA · scope · non-goals), as structured JSON, + a throwaway wireframe", "<code>blueprint/v1/design-thinking/</code> (committed, schema-validated); wireframe in gitignored <code>prototypes/</code> (not versioned)"],
          ],
        },
        {
          type: "table",
          kicker: "Where it sits",
          title: "The three upstream altitudes",
          intro: "Three steps, three altitudes, three gates — all <em>before</em> code. Design Thinking and System Design are broad and per-project; <code>/spec</code> narrows to a buildable plan.",
          headers: ["", "Altitude", "Decides", "Artifact", "Gate"],
          rows: [
            ["<strong>Step 1 — Design Thinking</strong>", "Project", "What &amp; why; for whom", "<code>blueprint/v1/design-thinking/</code>", "Design-review"],
            ["<strong>Step 2 — System Design</strong>", "Project", "How it's built; system shape", "<code>blueprint/v1/system-design/</code>", "Design-doc review"],
            ["<strong>Step 3 — /spec</strong>", "Epic / ticket", "The build plan to slice from", "<code>blueprint/v1/specs/</code>", "Plan-review"],
          ],
        },
        {
          type: "steps",
          kicker: "The sub-flow",
          title: "Diverge → make tangible → converge → review → approve",
          items: [
            { title: "Frame the problem", body: "Problem, target users, success criteria, and explicit <strong>non-goals</strong> — the <code>design-thinking</code> skill's Brief + Empathize + Define phases. You wear the PM hat here. The test: if you can't state what this <em>won't</em> do, it isn't framed yet." },
            { title: "Diverge — 2–3 real options", body: "Sketch genuinely different approaches — architecture <em>and</em> UX — each with its tradeoffs (the skill's Ideate phase). Resist converging early; the cheapest pivot is the one on paper." },
            { title: "Make it tangible — wireframe (UI work only)", body: "Generate a low-fidelity <strong>HTML wireframe</strong> with the <code>frontend-design</code> skill into the gitignored <code>prototypes/</code> folder. Open it over <code>file://</code>, walk the primary flows, feel the information architecture. It's a thinking aid — disposable by design." },
            { title: "Converge — record the decision", body: "Pick one option and record it in the design-thinking record: the choice, <em>why</em>, and why-<em>not</em> the rejected alternatives. That's a lightweight ADR — the rationale of record that outlives the debate." },
            { title: "Design review — Gate 1", body: "Hand the design-thinking record to the <code>architect</code> subagent (read-only, opus): where does complexity live? what will rot? which boundary breaks? Add <code>security</code> if the surface is risky. Its job is to attack the design while changing it is still free." },
            { title: "Approve", body: "You resolve the review and sign off. <strong>“Design done”</strong> is the entry condition that unlocks <em>system design</em> — not before." },
          ],
        },
        {
          type: "code",
          caption: "Where the Step-1 artifacts live",
          text:
            "blueprint/v1/design-thinking/   # committed · reviewed · schema-validated JSON\n  01_project_brief/data.json    # the design-of-record — exists before any CM-<n> ticket\n  05_persona/data.json\n  09_goal_statement/data.json\n  …\n\nprototypes/                     # gitignored — never committed, never seen by CI\n  analytics-dashboard/\n    index.html                  # file:// wireframe (UI work only), thrown away after",
        },
        {
          type: "callout",
          html:
            "Because the wireframe is <strong>never committed</strong>, the CI-fencing problem disappears: not versioned = the ladder never sees it. The durable Step-1 artifact is the structured <code>design-thinking/</code> record — and in greenfield it exists <em>before</em> any ticket. System design builds on it in Step 2; tickets get sliced from it in Step 4.",
        },
        {
          type: "cards",
          kicker: "A resolved principle",
          title: "Design altitude follows work altitude",
          intro: "The same wireframe-and-pick loop runs at <strong>three</strong> scales — only the scope and where the decision is filed change. The prototype is always thrown away.",
          items: [
            { tag: "this playbook · greenfield", title: "Global design", body: "Whole-project shape: IA, primary screens, the main flows. Lives in <code>blueprint/v1/design-thinking/</code> and exists <strong>before any ticket</strong>." },
            { tag: "see: brownfield", title: "Ticket-scoped design", body: "The same loop in miniature, for a change to an existing project. The design note rides <strong>with the ticket</strong> (a <code>## Design</code> section) — no project-level <code>design.md</code> needed." },
            { tag: "during build · Step 5", title: "Element-level", body: "Exploring one component's look — 2–3 variants of a button in a throwaway gallery, pick, record in <code>plan.md</code>. The loop scaled to a single element." },
          ],
        },
        {
          type: "callout",
          variant: "principle",
          title: "The gate that matters: design-review",
          html:
            "Uncertainty is highest before code exists — so that's exactly where the scrutiny goes. The <code>architect</code> review on the <code>design-thinking</code> record is the cheapest place on earth to kill a wrong approach. Passing it is what makes “design done” mean something instead of being a vibe.",
        },
        {
          type: "callout",
          title: "Mechanics — even the design rides the cage",
          html:
            "The <code>design-thinking/</code> record is reviewable work, so it travels the normal path: a <code>feat/&lt;slug&gt;-design</code> branch → PR → <code>architect</code> review → merge. No direct-to-main, design included. The wireframe never leaves your machine (gitignored <code>prototypes/</code>); the durable, versioned record is the structured JSON under <code>blueprint/</code>.",
        },
        {
          type: "callout",
          title: "What we'd add to ship this",
          html:
            "Step 1 reuses the <code>architect</code> agent and the <code>frontend-design</code> skill, and now the <code>design-thinking</code> skill carries the 20-step methodology — all already exist. New, small, additive: wiring the skill's output to the <code>blueprint/v1/design-thinking/</code> path, and one <code>.gitignore</code> line for <code>prototypes/</code>.",
        },
      ],
    },

    /* ===== STEP 2 ===== */
    {
      type: "stepgroup",
      kicker: "Step 2 · the engineering design doc",
      title: "System Design",
      intro:
        "Translate <em>what &amp; why</em> into <em>how it's built</em>: the architecture, the API, the data model, the design system — <strong>before</strong> the work is sliced. The engine is the <code>technical-design</code> skill. <strong>Why before the backlog?</strong> Architecture decides ticket boundaries: you can't slice good vertical tickets until you know the services, the data model, and the seams. <strong>Exit:</strong> an approved system-design record the backlog is sliced against.",
      blocks: [
        {
          type: "table",
          kicker: "Input · Output · Where it lives",
          headers: ["", "What", "Where it lives"],
          rows: [
            ["<strong>Input</strong>", "the approved design-thinking record", "<code>blueprint/v1/design-thinking/</code>"],
            ["<strong>Output</strong>", "architecture · API design · DB schema · design system — structured", "<code>blueprint/v1/system-design/</code> (JSON + DBML; the design system carries tokens + a component gallery)"],
          ],
        },
        {
          type: "steps",
          kicker: "The sub-flow",
          title: "Architecture → API → data model → design system → review",
          items: [
            { title: "Architecture", body: "System layers, the major components and their seams, and the load-bearing <strong>architectural decisions</strong> (with their tradeoffs). This is the skeleton every later slice hangs off — <code>01_architecture/data.json</code>." },
            { title: "API design", body: "The contracts between components — endpoints / messages, request &amp; response shapes, auth. Designing them now is what lets backend and frontend tickets be sliced <em>independently</em> — <code>02_api_design/data.json</code>." },
            { title: "Data model", body: "Tables, relationships, indexes, constraints, in <strong>DBML</strong> — <code>03_database_schema/schema.dbml</code>. The data model is the hardest thing to change after launch, so it earns scrutiny here." },
            { title: "Design system", body: "Design tokens (color, type, spacing) + a component gallery — the visual language every UI ticket reuses instead of reinventing. <code>04_design_system/</code>. This is the durable cousin of Step 1's throwaway wireframe and Step 5's element mini-wireframes." },
            { title: "Design-doc review — Gate 2", body: "Hand the system-design record to the <code>architect</code> (read-only, opus), and <code>security</code> if the surface is risky. Attack the boundaries and the data model while they're still free to move. Approval is what unlocks <code>/spec</code> and slicing." },
          ],
        },
        {
          type: "callout",
          title: "The big-tech parallel: PRD + design doc",
          html:
            "In a big-tech org, two documents precede the stories: the <strong>PRD / product spec</strong> (what &amp; why — that's Step 1) and the <strong>engineering design doc / RFC / TDD</strong> (how — that's this step). Both are written and reviewed <em>before</em> work is broken into tickets, because the system shape determines how the work decomposes. CodeMaster makes that explicit: <code>design-thinking</code> → <code>technical-design</code> → slice.",
        },
        {
          type: "callout",
          title: "Altitude: full doc for epics, lighter for small work",
          html:
            "Full architecture/API/schema/design-system depth is for <strong>greenfield and large epics</strong>. The same “think about the system before you build” instinct shows up smaller elsewhere: a brownfield feature gets a <code>## Design</code> section on its ticket; a single ticket gets its <code>plan.md</code> Plan beat (Step 5). Same discipline, three altitudes — System Design is just the heaviest one.",
        },
        {
          type: "callout",
          variant: "principle",
          title: "The gate that matters: design-doc review",
          html:
            "The data model and the component seams are the most expensive things to get wrong — every later ticket inherits them. Reviewing them here, with no code committed, is the cheapest correction you'll ever make.",
        },
        {
          type: "callout",
          title: "What we'd add to ship this",
          html:
            "The <code>technical-design</code> skill (architecture · api_design · database_schema · design_system) already carries the methodology and its schemas. New, small, additive: wiring its output to <code>blueprint/v1/system-design/</code> so it lands in the project record alongside the design-thinking output.",
        },
      ],
    },

    /* ===== STEP 3 ===== */
    {
      type: "stepgroup",
      kicker: "Step 3 · how, broadly — and gate it",
      title: "/spec & the plan-review gate",
      intro:
        "Translate the approved design &amp; system design into a buildable <strong>plan</strong> — and stop for review before any code. <strong>Exit:</strong> an approved build blueprint for the whole feature.",
      blocks: [
        {
          type: "table",
          kicker: "Input · Output · Where it lives",
          headers: ["", "What", "Where it lives"],
          rows: [
            ["<strong>Input</strong>", "the approved design + system design", "<code>blueprint/v1/design-thinking/</code> · <code>blueprint/v1/system-design/</code>"],
            ["<strong>Output</strong>", "approved implementation plan — constraints · AC · risks · steps→verification", "<code>blueprint/v1/specs/&lt;epic&gt;.spec.md</code> (a plan note kept with the epic)"],
          ],
        },
        {
          type: "steps",
          kicker: "The sub-flow",
          title: "Feed the design in → read the plan → attack it → approve",
          items: [
            { title: "Feed design + system design to /spec", body: "Run <code>/spec</code> pointing at <code>blueprint/v1/design-thinking/</code> and <code>blueprint/v1/system-design/</code>. It's written to read a ticket <em>or</em> a feature, so at this altitude it takes the whole feature, now with its architecture already decided." },
            { title: "Read what it emits", body: "Problem &amp; intent, the <strong>constraints</strong> that must not change (CLAUDE.md invariants + the design's non-goals), testable acceptance criteria, the <strong>risks / unknowns</strong>, and the <strong>plan</strong>: the smallest sequence of steps, the files each touches, and which <em>ladder rung</em> verifies each." },
            { title: "Attack the plan — plan-review (Gate 2)", body: "<code>/spec</code> stops here on purpose. Be the discriminator: name the riskiest assumption and how you'll de-risk it; pull in the <code>architect</code> for a second pair of eyes. The cheapest place to fix a wrong approach is a plan with no code behind it." },
            { title: "Approve the blueprint", body: "The approved plan's build-sequence becomes the ticket order in Step 4. Save it as <code>blueprint/v1/specs/&lt;epic&gt;.spec.md</code> with the epic — lightweight, not ceremony." },
          ],
        },
        {
          type: "callout",
          title: "Two altitudes of /spec",
          html:
            "Here <code>/spec</code> runs at <strong>epic altitude</strong> — one coherent plan for the whole feature, <em>before</em> it's fragmented into tickets (you want the shape right before you slice). Later, in Step 5, a gnarly individual ticket can get its own <strong>ticket-altitude</strong> <code>/spec CM-n</code> saved as <code>plan.md</code>. Most tickets just inherit this epic plan.",
        },
        {
          type: "callout",
          variant: "principle",
          title: "The gate that matters: plan-review",
          html:
            "A plan is the last artifact you can rewrite for free. Spend your scrutiny there — once code exists, every change costs more.",
        },
      ],
    },

    /* ===== STEP 4 ===== */
    {
      type: "stepgroup",
      kicker: "Step 4 · slice into shippable work",
      title: "Backlog — from plan to tickets",
      intro:
        "Fragment the approved plan into small, ordered tickets that each meet the <strong>Definition of Ready</strong>. <strong>Exit:</strong> a dependency-ordered backlog in <code>blueprint/v1/backlog/</code>.",
      blocks: [
        {
          type: "table",
          kicker: "Input · Output · Where it lives",
          headers: ["", "What", "Where it lives"],
          rows: [
            ["<strong>Input</strong>", "the approved plan", "<code>blueprint/v1/specs/&lt;epic&gt;.spec.md</code>"],
            ["<strong>Output</strong>", "dependency-ordered backlog: epic + stories/tasks", "<code>blueprint/v1/backlog/</code>: <code>roadmap.json</code> (epics + order) + <code>tickets/CM-n.json</code>"],
          ],
        },
        {
          type: "steps",
          kicker: "The sub-flow",
          title: "Scaffold → slice vertically → meet DoR → refine just-in-time",
          items: [
            { title: "Scaffold each structured ticket", body: "Each ticket gets the next id and is written as a structured record — goal · acceptance criteria · verification — and registered in <code>roadmap.json</code> under its epic, in dependency order. A ticket also carries optional siblings: the Plan beat and the proof of done (pointers to the CI run / PR / tests)." },
            { title: "Slice vertically, one concern each", body: "Each ticket is finishable in one short-lived branch and delivers something verifiable end to end. Order them by the plan's dependency sequence. If a ticket's AC span unrelated changes, split it." },
            { title: "Meet the Definition of Ready", body: "Clear single-sentence goal · testable AC · deps known &amp; unblocked · small enough for one branch · verification approach identified. A ticket that can't state testable AC isn't ready to start." },
            { title: "Refine just-in-time", body: "Only elaborate a ticket when it's pulled into work — speculative over-specification is waste. <code>roadmap.json</code> is the index/status; the ticket record holds the detail. The <code>librarian</code> can check the two stay consistent." },
          ],
        },
        {
          type: "callout",
          variant: "principle",
          title: "The gate that matters: Definition of Ready",
          html:
            "DoR is the contract between planning and building. It's what lets <code>/start-ticket</code> assume the work is well-formed — and what stops a half-baked idea from becoming a branch.",
        },
        {
          type: "callout",
          title: "Two serializations of the same model",
          html:
            "A project <em>built via</em> CodeMaster keeps its backlog as structured <strong>JSON</strong> in <code>blueprint/v1/backlog/</code> — machine-readable, ready for validation and tooling (this is the model demonstrated in <code>examples/etikets/</code>). CodeMaster's <em>own</em> meta-repo keeps the markdown variant — <code>new-ticket</code> + <code>next-number.sh</code> writing <code>backlog/tickets/CM-n-&lt;slug&gt;/README.md</code> and a <code>ROADMAP.md</code> index — because its tooling predates the blueprint model. <strong>Same model, two serializations:</strong> goal · AC · verification · plan · evidence, whether as JSON fields or markdown sections.",
        },
      ],
    },

    /* ===== STEP 5 ===== */
    {
      type: "stepgroup",
      kicker: "Step 5 · implement · verify · repeat",
      title: "Build — the robust-code loop",
      intro:
        "Per ticket: pull &amp; refine to Ready, branch, <strong>plan the implementation</strong>, then loop <strong>generate → verify → critique</strong> until green. <strong>Exit:</strong> a ticket whose acceptance criteria are met and demonstrated, on a branch, ladder green.",
      blocks: [
        {
          type: "table",
          kicker: "Input · Output · Where it lives",
          headers: ["", "What", "Where it lives"],
          rows: [
            ["<strong>Input</strong>", "a Ready ticket + the epic plan", "<code>backlog/tickets/CM-n-&lt;slug&gt;/README.md</code>"],
            ["<strong>Output</strong>", "working code + tests; the implementation plan; <em>(UI tickets)</em> a throwaway variant gallery", "code on branch <code>feat/CM-n-&lt;slug&gt;</code>; <code>…/CM-n-&lt;slug&gt;/plan.md</code>; green-gated commits — plus, for UI, a gallery in gitignored <code>prototypes/</code> (not versioned)"],
          ],
        },
        {
          type: "steps",
          kicker: "The sub-flow",
          title: "Pull & refine → branch → plan → loop → checkpoint on green",
          items: [
            { title: "Pull the next ticket & refine it to Ready", body: "This is where Step 4's <em>just-in-time refinement</em> actually happens — there's no planning ceremony in continuous flow, so you refine at the pull. Take the next ticket by dependency order; flesh the rough line-item against the epic spec — sharpen the <strong>testable AC</strong>, confirm it's <strong>one concern</strong>, confirm deps are done/unblocked, split if it grew too big. That's <strong>Definition of Ready</strong> applied as the gate. Can't reach Ready because of unknowns? <strong>Spike it</strong> instead of starting blind. (Light for planned tickets — the epic spec did the thinking; heavier for emergent ones.)" },
            { title: "Branch with /start-ticket", body: "<code>/start-ticket CM-n</code> checks you're on an up-to-date <code>main</code>, cuts <code>feat/CM-n-&lt;slug&gt;</code>, and flips the ticket + ROADMAP status to 🟦 in progress. One ticket → one branch." },
            { title: "Plan the implementation", body: "The loop's <strong>Plan</strong> beat — <em>always</em>, even if it's a sentence in your head. Sketch the change across the stack: which <strong>backend / frontend / data</strong> layers, which files, in what order, verified by which tests (often test-first). Use <strong>plan mode</strong> to attack it before code exists. Fidelity scales with risk × uncertainty: a trivial ticket plans in-head; a gnarly one earns a written ticket-altitude <code>/spec CM-n</code> saved as <code>plan.md</code>. Most tickets inherit the epic plan from Step 3. For <strong>UI work</strong>, this is also where you settle the <em>look</em> — see <em>Mini-wireframes</em> below." },
            { title: "Loop: generate → verify → critique", body: "Generate against the plan; <strong>verify</strong> with the ladder (<code>scripts/ci.sh</code>: shell · JS · tests · JSON · links · commit — cheapest first, fail-fast); <strong>critique</strong> as the discriminator — design/security/perf, not just “does it run.” Lean on <code>tester</code> for edge cases, <code>security</code> for surface." },
            { title: "Checkpoint on green", body: "<code>scripts/checkpoint.sh</code> makes a green-gated commit — it <em>refuses</em> if the ladder is red, so every safe point is revertible. Conventional Commits are enforced by the <code>commit-msg</code> hook." },
          ],
        },
        {
          type: "callout",
          title: "Mini-wireframes — exploring UI variants (the element altitude)",
          html:
            "For a UI ticket, planning the implementation can include a <em>visual</em> choice. Generate 2–3 variants of the element — a button, a card — as a throwaway <strong>options gallery</strong> (<code>prototypes/CM-n-&lt;slug&gt;/index.html</code>, <code>file://</code>-openable, via the <code>frontend-design</code> skill), open it, <strong>pick</strong>, and record the decision in <code>plan.md</code>. It's the Step-1 wireframe loop scaled down to a single element. The gallery is thrown away (gitignored <code>prototypes/</code>); the chosen variant is then built <em>for real</em> with the project's components and runs the loop. <strong>The prototype is a decision aid, never the implementation.</strong>",
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
      ],
    },

    /* ===== STEP 6 ===== */
    {
      type: "stepgroup",
      kicker: "Step 6 · review &amp; merge with guarantees",
      title: "Ship — PR → review → green CI → merge",
      intro:
        "Get each ticket reviewed and merged behind enforced gates. <strong>Exit:</strong> ticket ✅ in <code>ROADMAP.md</code>, branch merged, <code>main</code> green.",
      blocks: [
        {
          type: "table",
          kicker: "Input · Output · Where it lives",
          headers: ["", "What", "Where it lives"],
          rows: [
            ["<strong>Input</strong>", "the finished branch + ticket", "<code>feat/CM-n-&lt;slug&gt;</code>"],
            ["<strong>Output</strong>", "merged code on main; proof of done; ticket ✅", "merged to <code>main</code> via PR; <code>…/CM-n-&lt;slug&gt;/evidence.md</code>; status in <code>ROADMAP.md</code>"],
          ],
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
            { title: "Close the loop", body: "Record proof in <code>evidence.md</code>, flip the ticket + ROADMAP to ✅, and <strong>verify post-merge <code>main</code> CI is green</strong> — a standing step after every merge. Repeat per ticket until the epic's tickets are all ✅: the greenfield MVP is shipped." },
          ],
        },
        {
          type: "callout",
          variant: "principle",
          title: "The gate that matters: green CI + the post-merge check",
          html:
            "A merge is only as trustworthy as the gate a machine enforces. The PR's green ladder is the merge bar; the post-merge <code>main</code> check is the proof the merge didn't break the trunk.",
        },
      ],
    },
    { type: "divider" },

    {
      type: "callout",
      title: "This is how CodeMaster built itself",
      html:
        "Every page on this site shipped through exactly this arc — discover → design → plan → slice → loop → ship — dogfooded ticket by ticket from <code>CM-7</code> onward. See <a href=\"loop.html\">The Loop</a> for the engine inside Step 5, <a href=\"delivery.html\">Delivery</a> for the pipeline these steps ride, and the <a href=\"roadmap.html\">Roadmap</a> for the receipts.",
    },
  ],
};
