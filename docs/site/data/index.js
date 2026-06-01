/* Overview page content. Edit these block objects to update the page. */
window.CM = window.CM || {};
window.CM.pages = window.CM.pages || {};
window.CM.pages.overview = {
  title: "Overview",
  blocks: [
    {
      type: "hero",
      kicker: "Engineering Operating System",
      title: "An engineering operating system on Claude Code",
      subtitle:
        "CodeMaster turns Claude Code from a chat assistant into <strong>infrastructure</strong> — a deterministic cage of hooks, gates, agents, and orchestration around a probabilistic model. Proven by dogfooding the process on this repo itself.",
      meta: [
        { value: "5", label: "Track-A phases" },
        { value: "16+", label: "PRs, all green" },
        { value: "0", label: "red main builds" },
      ],
      actions: [
        { label: "Explore capabilities →", href: "capabilities.html", primary: true },
        { label: "See the roadmap", href: "roadmap.html" },
      ],
    },
    { type: "divider" },
    {
      type: "callout",
      variant: "principle",
      title: "The core thesis",
      html:
        "Guarantees come from the <strong>deterministic cage</strong> you build around a probabilistic model — hooks, tests, CI — not from the model behaving. When adding a safeguard, prefer code over instruction.",
    },
    {
      type: "ladder",
      kicker: "The leverage ladder",
      title: "From talking to an agent → building infrastructure",
      intro:
        "Each rung wraps the one below in more determinism and more reach. The architect's edge is knowing which concern lives where.",
      items: [
        { level: "00", title: "The determinism boundary", body: "Push non-negotiables out of the prompt into code: hooks, tests, CI. The foundation everything else stands on." },
        { level: "01", title: "Single subagent", body: "Offload isolated, context-heavy work; get back only a conclusion." },
        { level: "02", title: "Workflow orchestration", body: "A deterministic script fanning out many subagents — review boards, adversarial verification, judge panels." },
        { level: "03", title: "Headless / SDK", body: "Run reasoning on an event — CI, webhook, cron. Claude becomes a service in the stack." },
        { level: "04", title: "Plugin distribution", body: "Bundle skills, agents, hooks, commands, workflows — ship your judgment to a whole team with one install." },
      ],
    },
    {
      type: "flow",
      kicker: "The lifecycle",
      title: "How a change travels, end to end",
      nodes: ["Design", "Backlog", "Robust-Code Loop", "CI / CD", "Release", "Observe"],
    },
    {
      type: "cards",
      kicker: "Explore",
      title: "The five pillars",
      items: [
        { tag: "Doc 01", title: "Capabilities", body: "Every Claude Code primitive and the decision rule for which layer each concern belongs in.", href: "capabilities.html" },
        { tag: "Doc 02", title: "The Robust-Code Loop", body: "Spec → plan → generate → verify → critique. Be the discriminator, not just the generator.", href: "loop.html" },
        { tag: "Doc 03", title: "Delivery", body: "Design-done → Agile → git → CI/CD → release → observability, the Big-Tech way.", href: "delivery.html" },
        { tag: "Doc 04 / 05", title: "The Fleet & Orchestration", body: "Role-based subagents and the review-board workflow that runs them as a pipeline.", href: "fleet.html" },
        { tag: "Status", title: "Roadmap", body: "Phases, tickets, and the defects we found by running what we built.", href: "roadmap.html" },
      ],
    },
  ],
};
