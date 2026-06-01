/* Roadmap / Progress. Source: ROADMAP.md (curated snapshot — update as phases land). */
window.CM = window.CM || {};
window.CM.pages = window.CM.pages || {};
window.CM.pages.roadmap = {
  title: "Roadmap",
  blocks: [
    {
      type: "hero",
      kicker: "Progress",
      title: "Built by dogfooding itself",
      subtitle:
        "CodeMaster is proven by running its own process on its own repo — one ticket, one branch, one green PR at a time. Track A (the engine) is complete.",
      meta: [
        { value: "Track A", label: "complete" },
        { value: "16+", label: "PRs merged" },
        { value: "0", label: "red main builds" },
      ],
    },
    {
      type: "phases",
      kicker: "Phases",
      title: "Status board",
      items: [
        { name: "0 · Delivery Infrastructure", status: "done", note: "Hooks, ladder, CI, backlog — the deterministic cage." },
        { name: "1 · Capabilities Proving Ground", status: "done", note: "One of each primitive, mechanics confirmed live." },
        { name: "2 · Robust-Code Loop", status: "done", note: "shellcheck + tests + the 6-rung fail-fast ladder." },
        { name: "3 · Subagent Fleet", status: "done", note: "Six doctrine-aware role agents, scoped + routed." },
        { name: "4 · Orchestration", status: "done", note: "Review-board workflow with adversarial verification." },
        { name: "5 · Package as Plugin", status: "todo", note: "Bundle the whole substrate into one installable unit." },
        { name: "6 · Pilot in a Real Repo", status: "todo", note: "Install into a production repo; ship a real feature." },
        { name: "D · Docs Site", status: "prog", note: "This site — the reference showcase." },
        { name: "CM-35 · Branch protection", status: "blocked", note: "Needs GitHub Pro / public repo; script ready." },
      ],
    },
    {
      type: "cards",
      kicker: "The real scorecard",
      title: "Defects found by running, not reading",
      columns: 2,
      items: [
        { tag: "Phase 0", title: "CI false-green", body: "ci.sh reported pass while a check silently failed inside an <code>if</code> (set -e exemption)." },
        { tag: "Phase 1", title: "--no-verify false-positive", body: "The bypass-guard hook blocked a legitimate commit that merely mentioned the flag in text." },
        { tag: "Phase 1", title: "$ARGUMENTS bug", body: "A slash command used <code>$1</code>, which doesn't substitute — rendered an empty value." },
        { tag: "Phase 2", title: "Squash (#n) CI failure", body: "The commit-msg gate counted GitHub's squash suffix toward the length limit." },
        { tag: "Phase 4", title: "Review board catch", body: "Orchestration found a real correctness bug the unit tests never covered." },
        { tag: "Lesson", title: "Verify by running", body: "None of these were visible from reading the code. The cage earns trust by being exercised." },
      ],
    },
    {
      type: "callout",
      variant: "principle",
      title: "The throughline",
      html:
        "A junior writes the script. The senior knows <strong>which human-dependent guarantees are worth converting into mechanisms</strong>, and where on the pipeline to place each one.",
    },
  ],
};
