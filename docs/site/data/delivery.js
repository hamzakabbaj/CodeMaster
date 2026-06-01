/* Delivery. Source doctrine: docs/03-delivery-process.md */
window.CM = window.CM || {};
window.CM.pages = window.CM.pages || {};
window.CM.pages.delivery = {
  title: "Delivery",
  blocks: [
    {
      type: "hero",
      kicker: "Doc 03",
      title: "Delivery",
      subtitle:
        "From an approved design to operated software, the Big-Tech way. The throughline: a ticket links commit → branch → PR → release, and every gate is enforced by code, not goodwill.",
    },
    {
      type: "flow",
      kicker: "The pipeline",
      title: "How a change reaches production",
      nodes: ["Design (done)", "Backlog", "Branch", "Build + Verify", "PR / Review", "CI / CD", "Release", "Observe"],
    },
    {
      type: "cards",
      kicker: "The stages",
      title: "What each stage owns",
      items: [
        { tag: "Agile", title: "Backlog & tickets", body: "Epic → story → task. Every ticket carries acceptance criteria, DoR/DoD. The ticket ID is the thread." },
        { tag: "Git", title: "Trunk-based", body: "Short-lived <code>feat/CM-n-*</code> branches off main. Conventional Commits drive changelogs & semver." },
        { tag: "Review", title: "PR contract", body: "Automated review first (lint/types/tests/security), human review second — design/security/perf." },
        { tag: "CI / CD", title: "Gates & deploy", body: "Install → lint → test → build → scan → coverage. Then staging → smoke → promote, with rollback." },
        { tag: "Release", title: "Versioning", body: "SemVer + auto-generated changelog from commits. Tagged releases, migration notes." },
        { tag: "Ops", title: "Observability", body: "Logs, metrics, traces. SLIs/SLOs, alerting on error-budget burn, blameless postmortems." },
      ],
    },
    {
      type: "callout",
      title: "Gates are blocking",
      html:
        "Coverage thresholds, no high-severity vulns, no secrets, license checks — these are <strong>encoded in CI</strong>, not left to reviewer goodwill. The rule that matters is the rule a machine enforces.",
    },
    {
      type: "table",
      kicker: "Where Claude plugs in",
      title: "Leverage at each stage",
      headers: ["Stage", "Claude leverage"],
      rows: [
        ["Backlog", "Draft stories & acceptance criteria from the design doc"],
        ["Build", "The robust-code loop"],
        ["Review", "Automated PR review (headless agent in CI)"],
        ["CI / CD", "Hooks + headless reasoning on pipeline events"],
        ["Release", "Generate changelog / release notes from commits"],
        ["Observe", "Triage logs / incidents via subagents; draft postmortems"],
        ["Org-wide", "A <strong>plugin</strong> encoding these gates & conventions, installed by every engineer"],
      ],
    },
  ],
};
