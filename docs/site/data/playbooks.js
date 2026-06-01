/* Playbooks — the process applied to real scenarios. Worked, illustrative
   examples (generic, not repo-specific). The spine: same cage, different path;
   ceremony scales with risk x uncertainty. Edit these blocks to update. */
window.CM = window.CM || {};
window.CM.pages = window.CM.pages || {};
window.CM.pages.playbooks = {
  title: "Playbooks",
  blocks: [
    {
      type: "hero",
      kicker: "Worked examples",
      title: "Playbooks: the process, applied",
      subtitle:
        "Doctrine is abstract until you watch it run. Here is the same process taking <strong>seven different shapes</strong> — from a project born yesterday to production on fire at 3am. The cage never changes; the path through it does.",
    },
    { type: "divider" },
    {
      type: "callout",
      variant: "principle",
      title: "The one rule that picks the path",
      html:
        "<strong>Ceremony scales with risk × uncertainty.</strong> High uncertainty (a greenfield design) buys heavy up-front thinking. High risk, low uncertainty (a hotfix) buys a fast path with a hard regression gate. You don't apply <em>all</em> the ceremony every time — you apply the part that earns its keep, and the <strong>green ladder is the floor under all of them</strong>.",
    },
    {
      type: "table",
      kicker: "Pick your path",
      title: "Seven scenarios, seven shapes",
      intro:
        "Find your situation, then read the playbook below it. The “primary primitive” is where the leverage concentrates for that shape.",
      headers: ["Scenario", "Dominant force", "Shape of the process", "Primary primitive"],
      rows: [
        ["<strong>Greenfield</strong>", "Uncertainty", "Heavy design up front, then full loop", "<code>/spec</code> plan-review gate"],
        ["<strong>Brownfield feature</strong>", "Blast radius", "Understand first, then change", "<code>code-explorer</code> + architect"],
        ["<strong>Refactor</strong>", "Regression risk", "Freeze behavior, then restructure", "Characterization tests"],
        ["<strong>Bug fix / hotfix</strong>", "Time", "Compressed, reproduce-first", "Failing test before fix"],
        ["<strong>Spike / research</strong>", "Unknowns", "Timeboxed, throwaway, decide", "ADR / decision note"],
        ["<strong>Migration / upgrade</strong>", "Scale", "Pilot one, then fan out", "Workflow orchestration"],
        ["<strong>Incident</strong>", "Damage", "Stabilize, then learn", "Postmortem → new guardrail"],
      ],
    },
    { type: "divider" },

    /* 1. Greenfield */
    {
      type: "section",
      kicker: "Playbook 01 · uncertainty",
      title: "Greenfield — a project (or feature) from zero",
      intro:
        "Example: <em>“Add a CSV-export feature to a brand-new analytics dashboard.”</em> Nothing exists yet, so the expensive mistake is building the wrong thing. Invest before code. &nbsp;<strong><a href=\"greenfield.html\">Full step-by-step walkthrough →</a></strong>",
    },
    {
      type: "steps",
      items: [
        { title: "Design thinking — diverge, then converge", body: "Frame the problem and the user. Sketch 2–3 options with tradeoffs. Converge to a <strong>one-page design doc</strong>: problem, constraints, the chosen option, and <em>why</em>. Output is an approved design — not code." },
        { title: "/spec — turn design into a plan, gate it", body: "Run <code>/spec</code> to produce a spec + implementation plan, and stop at the <strong>plan-review gate</strong>. This is the cheapest place on earth to catch a wrong approach — before a single line exists." },
        { title: "Backlog — slice into tickets", body: "Break the plan into an epic → tickets via <code>new-ticket</code>, each with acceptance criteria and a Definition of Ready. The ticket ID becomes the thread linking commit → branch → PR." },
        { title: "Build — the robust-code loop per ticket", body: "<code>/start-ticket</code> branches; then generate → <strong>verify against the ladder</strong> → critique. You are the discriminator: review for design/security/perf, not just “does it run.”" },
        { title: "Ship — PR → review → green CI → merge", body: "Squash-merge on green. Repeat per ticket until the epic is done. The design doc stays as the rationale of record." },
      ],
    },
    {
      type: "callout",
      title: "The gate that matters here",
      html: "The <strong>plan-review gate</strong>. Uncertainty is highest before code; spend your scrutiny there, not in review of code that shouldn't have been written.",
    },
    { type: "divider" },

    /* 2. Brownfield */
    {
      type: "section",
      kicker: "Playbook 02 · blast radius",
      title: "Brownfield — improving an existing project",
      intro:
        "Example: <em>“Add pagination to an API endpoint that three other services already call.”</em> The risk isn't the new code — it's what the change quietly breaks. Understand before you touch.",
    },
    {
      type: "steps",
      items: [
        { title: "Map the territory before changing it", body: "Send the <code>code-explorer</code> (or <code>librarian</code> for docs) to trace how the current behavior actually works and <strong>who depends on it</strong>. Get back a conclusion, not a guess." },
        { title: "Scope by blast radius", body: "Write the ticket with acceptance criteria <em>and</em> an explicit list of what else touches this code. Have the <code>architect</code> subagent review: what will this break? what will rot?" },
        { title: "Pin current behavior with tests", body: "Before changing anything, add or confirm tests covering the existing contract — including the callers' assumptions. Now a regression is loud, not silent." },
        { title: "Loop the change, weighted to integration", body: "Run the robust-code loop, but bias review toward <strong>backward compatibility</strong> and the seams between old and new." },
        { title: "Ship behind a flag if reversibility is cheap", body: "For risky surface area, gate the new path so rollback is a config flip, not a revert." },
      ],
    },
    {
      type: "callout",
      title: "The gate that matters here",
      html: "<strong>Blast-radius awareness.</strong> The cheap failure is forgetting a caller. Reconnaissance (a subagent) and existing-behavior tests are the guardrails that catch it.",
    },
    { type: "divider" },

    /* 3. Refactor */
    {
      type: "section",
      kicker: "Playbook 03 · regression risk",
      title: "Refactoring — change the structure, not the behavior",
      intro:
        "Example: <em>“Untangle a 600-line god-function into composable units.”</em> A refactor that changes behavior is just an undocumented feature change. The whole game is proving behavior was preserved.",
    },
    {
      type: "steps",
      items: [
        { title: "Pin behavior FIRST with characterization tests", body: "Capture the current outputs in tests <strong>before touching the code</strong>. The rule: if it isn't tested, you can't refactor it safely — so add the tests first. These tests are the contract." },
        { title: "Establish a green baseline", body: "Full ladder green on the <em>unchanged</em> code. This is the reference you must return to." },
        { title: "Restructure in small, reversible steps", body: "Each step keeps the tests green. Use <code>checkpoint.sh</code> to commit green-gated safe points so any step is trivially revertible." },
        { title: "Prove behavior didn't change", body: "The diff changes structure only. A reviewer red flag: <strong>test assertions changed</strong> — that means behavior moved, and it's no longer a refactor." },
        { title: "Verify — same tests, still green", body: "Unchanged assertions passing on restructured code <em>is</em> the proof. Merge." },
      ],
    },
    {
      type: "callout",
      title: "The gate that matters here",
      html: "<strong>The tests are the contract.</strong> A refactor PR where the assertions were edited is the single biggest tell that behavior leaked — scrutinize it.",
    },
    { type: "divider" },

    /* 4. Bug fix / hotfix */
    {
      type: "section",
      kicker: "Playbook 04 · time",
      title: "Bug fix / hotfix — the fast path",
      intro:
        "Example: <em>“Users on Safari can't submit the form.”</em> Time pressure is real, but speed without a regression test just schedules the bug to come back. Compress ceremony, never the proof.",
    },
    {
      type: "steps",
      items: [
        { title: "Reproduce with a failing test", body: "Write the <strong>red test</strong> that captures the bug first. No reproduction, no fix — otherwise you're guessing whether you fixed the real thing." },
        { title: "Make the smallest fix that turns it green", body: "Resist scope creep. The hotfix changes exactly what's needed and nothing else; tidy-ups become separate tickets." },
        { title: "Lock the regression forever", body: "The once-failing test now passes and <strong>stays in the suite</strong>. This class of bug can't silently return." },
        { title: "Fast-track, don't skip", body: "Small diff → focused review → still a PR, still green CI. The fast path trims ceremony, not the cage." },
      ],
    },
    {
      type: "callout",
      title: "The gate that matters here",
      html: "<strong>Failing-test-first.</strong> It proves you fixed the actual defect and converts a one-time fix into a permanent guarantee.",
    },
    { type: "divider" },

    /* 5. Spike / research */
    {
      type: "section",
      kicker: "Playbook 05 · unknowns",
      title: "Spike / research — buying knowledge, not shipping code",
      intro:
        "Example: <em>“Can we replace our search with vector embeddings, and what would it cost?”</em> The deliverable here is a <strong>decision</strong>. The code is scaffolding you throw away.",
    },
    {
      type: "steps",
      items: [
        { title: "Frame a question and a timebox", body: "A spike ticket states one specific question to answer and a hard time limit. Open-ended “research” with no question is how weeks disappear." },
        { title: "Prototype on a throwaway branch", body: "Explore freely — ceremony is light because the code is disposable. Optimize for learning rate, not code quality." },
        { title: "Capture the decision as an ADR", body: "The durable output is a short <strong>decision note</strong>: what we asked, what we found, what we'll do, and why. This is what survives the spike." },
        { title: "Throw the prototype away; spawn real tickets", body: "Feed the learning into properly-specced tickets built the normal way. <strong>Don't ship the spike</strong> — that's how prototypes rot into production." },
      ],
    },
    {
      type: "callout",
      title: "The gate that matters here",
      html: "<strong>The timebox + the decision artifact.</strong> A spike that runs over time or produces no decision didn't succeed — it just spent money.",
    },
    { type: "divider" },

    /* 6. Migration / upgrade */
    {
      type: "section",
      kicker: "Playbook 06 · scale",
      title: "Migration / upgrade — the same change, a hundred times",
      intro:
        "Example: <em>“Rename a deprecated API call across 120 files before the framework drops it.”</em> The work is mechanical and repetitive — the exact shape where orchestration beats a human grinding through files.",
    },
    {
      type: "steps",
      items: [
        { title: "Pilot one site by hand", body: "Do the migration manually on a single file. Nail two things: the <strong>transformation pattern</strong> and the <strong>per-site verification</strong> that proves it worked." },
        { title: "Enumerate every site — know the denominator", body: "Use search (<code>grep</code> / <code>code-explorer</code>) to list all affected sites. You must know the count <em>before</em> you start; a migration with an unknown denominator can't be verified complete." },
        { title: "Fan out with a Workflow", body: "A <code>Workflow</code> runs one agent per site (worktree isolation so parallel edits don't collide), each applying the proven pattern and verifying its own site." },
        { title: "Verify in aggregate", body: "Full ladder green; the number of changed sites <strong>matches the scope count</strong>. Log anything skipped — silent partial migration is the failure mode." },
      ],
    },
    {
      type: "callout",
      title: "The gate that matters here",
      html: "<strong>Per-site verification against a known denominator.</strong> “I changed a lot of files” isn't done; “all 120 sites changed and verified, 0 skipped” is.",
    },
    { type: "divider" },

    /* 7. Incident / postmortem */
    {
      type: "section",
      kicker: "Playbook 07 · damage",
      title: "Incident — production is down",
      intro:
        "Example: <em>“Checkout is throwing 500s and revenue is bleeding.”</em> Order of operations is everything: stop the damage first, understand second, prevent recurrence last.",
    },
    {
      type: "steps",
      items: [
        { title: "Stabilize — stop the bleeding", body: "Roll back or mitigate to <strong>restore service</strong>. Diagnosis comes after the patient is stable, not before. Reversibility (the brownfield flag, a clean revert) pays off right here." },
        { title: "Diagnose to root cause", body: "Now find <em>why</em>, using logs, traces, and the failing path. A triage subagent can fan across logs while you reason about the timeline." },
        { title: "Fix forward through the loop", body: "Ship the proper fix the normal way — <strong>with a regression test</strong> that reproduces the incident. Same rigor as a hotfix." },
        { title: "Blameless postmortem → a new guardrail", body: "Interrogate the <strong>system</strong>, not the person. The non-negotiable output is a <em>change to the cage</em>: a new hook, CI rung, or alert so this class of failure can't recur silently. An incident that doesn't harden the cage will be relived." },
      ],
    },
    {
      type: "callout",
      title: "The gate that matters here",
      html: "<strong>The postmortem must produce a cage change.</strong> Stabilizing ends the incident; hardening the cage ends the <em>category</em>. That's the whole point of the system.",
    },
    { type: "divider" },

    {
      type: "callout",
      variant: "principle",
      title: "The throughline",
      html:
        "Every playbook lands in the same place: a <strong>green ladder, enforced by code</strong>. What differs is only how much you invest up front and where you concentrate scrutiny — and that's set by risk × uncertainty, not by habit. Read <a href=\"loop.html\">The Loop</a> for the engine each playbook runs, and <a href=\"delivery.html\">Delivery</a> for the pipeline they all flow through.",
    },
  ],
};
