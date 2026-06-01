/* How Big Tech engineering orgs work — context & inspiration for the fleet/process.
   Distinct from fleet.html (which maps these roles -> Claude subagents).
   Source: docs/04-team-profiles.md + general Big-Tech org practice. */
window.CM = window.CM || {};
window.CM.pages = window.CM.pages || {};
window.CM.pages.bigtech = {
  title: "Inside Big Tech",
  blocks: [
    {
      type: "hero",
      kicker: "Context & inspiration",
      title: "How Big Tech engineering works",
      subtitle:
        "Before modeling an org in software, it helps to know the org. This is the human system CodeMaster compresses — <strong>team topologies, roles, ceremonies, ownership, and the career ladder</strong> — and the bridge back to our fleet of subagents.",
    },
    { type: "divider" },
    {
      type: "callout",
      variant: "principle",
      title: "Why this page exists",
      html:
        "A Big-Tech org is a machine for turning intent into operated software at scale. Its structure — who owns what, which gate blocks what — is exactly what we encode in <strong>hooks, agents, and workflows</strong>. Study the org to design the cage.",
    },
    {
      type: "cards",
      kicker: "Team topology",
      title: "How teams are shaped (Team Topologies)",
      intro:
        "Modern orgs minimize coordination by giving each team a clear type and a single mode of interaction. Four shapes recur:",
      items: [
        { tag: "delivers value", title: "Stream-aligned (squad)", body: "Owns one product slice end to end — design, build, run. Small, durable, cross-functional. The default team type; everything else exists to support it." },
        { tag: "reduces load", title: "Platform", body: "Builds the internal product (CI/CD, infra, tooling) the squads consume as self-service, so they don't each reinvent it." },
        { tag: "raises capability", title: "Enabling", body: "Specialists (security, SRE, testing) who coach squads to adopt a practice, then leave — not a permanent dependency." },
        { tag: "tames complexity", title: "Complicated-subsystem", body: "Owns a part needing deep expertise (a search engine, a video codec) so squads don't all need that depth." },
      ],
    },
    {
      type: "table",
      kicker: "Roles",
      title: "Who owns what — and the question each role asks",
      headers: ["Role", "Owns", "The question it keeps asking"],
      rows: [
        ["<strong>Product Manager</strong>", "The what &amp; why; backlog priority", "Is this the right thing to build?"],
        ["<strong>Architect / Tech Lead</strong>", "System design, boundaries, standards", "Where does complexity live? Will this rot?"],
        ["<strong>Software Engineer</strong>", "Implementation against spec", "Does it meet the spec correctly &amp; cleanly?"],
        ["<strong>QA / SDET</strong>", "Test strategy, coverage, edge cases", "How does this break? What's untested?"],
        ["<strong>DevOps / SRE</strong>", "CI/CD, deploy, reliability, on-call", "Is it reproducible, observable, recoverable?"],
        ["<strong>Security (AppSec)</strong>", "Threat model, vulns, secrets, authz", "What's the attack surface?"],
        ["<strong>Eng Manager</strong>", "People, delivery, process health", "Is the team healthy and shipping?"],
      ],
    },
    {
      type: "ladder",
      kicker: "The career ladder",
      title: "Seniority is scope of impact, not years",
      intro:
        "The IC track ladder measures the blast radius of your decisions — from a task, to a team, to the whole org. Management is a parallel track, not a promotion.",
      items: [
        { level: "L3", title: "Junior", body: "Delivers well-defined tasks with guidance. Scope: a ticket." },
        { level: "L4", title: "Mid / SWE II", body: "Owns features independently end to end. Scope: a feature." },
        { level: "L5", title: "Senior", body: "Owns a system and mentors; makes sound design tradeoffs. Scope: a team's domain." },
        { level: "L6", title: "Staff", body: "Drives technical direction across teams; the multiplier on others' work. Scope: multiple teams." },
        { level: "L7+", title: "Principal / Distinguished", body: "Sets strategy and standards org-wide; bets the company makes on hard problems. Scope: the org." },
      ],
    },
    {
      type: "steps",
      kicker: "The cadence",
      title: "Agile ceremonies, and what each is actually for",
      items: [
        { title: "Backlog refinement", body: "Shape upcoming work to <em>Definition of Ready</em> — clear acceptance criteria — so planning isn't archaeology." },
        { title: "Sprint planning", body: "Pull a committed slice of refined work the team believes it can finish. A forecast, not a promise." },
        { title: "Daily standup", body: "Surface blockers fast; re-aim for the day. Sync the plan, not status theatre." },
        { title: "Review / demo", body: "Show working software to stakeholders against the acceptance criteria. Proof, not slides." },
        { title: "Retro", body: "Improve the <em>process</em> itself — one concrete change per cycle. The team debugging the team." },
      ],
    },
    {
      type: "cards",
      kicker: "Ownership & operations",
      title: "“You build it, you run it”",
      columns: 2,
      items: [
        { tag: "ownership", title: "End-to-end accountability", body: "The team that ships a service operates it. No throwing code over a wall to a separate ops group — ownership and feedback live together." },
        { tag: "on-call", title: "On-call rotation", body: "Engineers carry the pager for what they ship. Pain from a fragile release lands on the team that can fix it — aligning incentives toward reliability." },
        { tag: "reliability", title: "SLIs / SLOs / error budget", body: "Reliability is a number you target, not a vibe. Burn the error budget and feature work pauses for hardening — a self-regulating gate." },
        { tag: "learning", title: "Blameless postmortems", body: "Incidents interrogate the <em>system</em>, not the person. The output is a durable fix — often a new automated guardrail — not blame." },
      ],
    },
    {
      type: "flow",
      kicker: "The throughline",
      title: "Intent becomes operated software",
      nodes: ["Strategy", "Roadmap", "Squad backlog", "Build + review", "CI / CD", "Operate + on-call", "Learn"],
    },
    {
      type: "callout",
      title: "The bridge to CodeMaster",
      html:
        "This whole org is a set of <strong>responsibilities and gates</strong>. CodeMaster compresses it: each role becomes a scoped <strong>subagent persona</strong>, each ceremony becomes a <strong>skill or command</strong>, each gate becomes a <strong>hook or CI rung</strong>. One engineer plays PM + architect + dev and leans on the fleet for tester / devops / security / reviewer — Big-Tech role coverage without Big-Tech headcount. <a href=\"fleet.html\">See how the fleet maps these roles →</a>",
    },
  ],
};
