/* Capabilities page. Source doctrine: docs/01-claude-capabilities.md */
window.CM = window.CM || {};
window.CM.pages = window.CM.pages || {};
window.CM.pages.capabilities = {
  title: "Capabilities",
  blocks: [
    {
      type: "hero",
      kicker: "Doc 01",
      title: "Capabilities",
      subtitle:
        "Claude Code is a <strong>layered, programmable platform</strong>. The model is probabilistic; the layers around it are where you put determinism, reuse, and isolation. The #1 mistake is using the right tool in the wrong layer.",
    },
    {
      type: "table",
      kicker: "The primitives",
      title: "What each primitive is for",
      headers: ["Primitive", "What it is", "Runs when", "Determinism", "Context cost"],
      rows: [
        ["<strong>CLAUDE.md</strong>", "Always-on project memory", "Every turn", "Model decides", "High (always in context)"],
        ["<strong>Skill</strong>", "On-demand procedure", "Description match / <code>/name</code>", "Model-driven", "Body loads on use"],
        ["<strong>Subagent</strong>", "Isolated agent, own context", "When delegated to", "Model-driven", "Returns only a conclusion"],
        ["<strong>Slash command</strong>", "Reusable prompt template", "You type <code>/name</code>", "Model-driven", "Injected on use"],
        ["<strong>Hook</strong>", "Deterministic script on an event", "On the event, always", "<strong>Deterministic</strong>", "None (outside the model)"],
        ["<strong>MCP server</strong>", "External tool/data integration", "When its tools are called", "Tool is deterministic", "Schemas in context"],
        ["<strong>Workflow</strong>", "JS script orchestrating subagents", "Explicit, opt-in", "<strong>Control flow</strong> deterministic", "Runs in background"],
        ["<strong>Plugin</strong>", "Versioned bundle of all the above", "On install", "Inherits children", "Inherits children"],
        ["<strong>Headless / SDK</strong>", "Claude Code as a process/library", "When you invoke it", "You own the harness", "You control it"],
      ],
    },
    {
      type: "cards",
      kicker: "Decision rules",
      title: "Which layer does the concern belong in?",
      items: [
        { tag: "→ CLAUDE.md", title: "Invariant truth", body: "Build cmd, arch rule, “we use X not Y.” Keep it short — paid every turn." },
        { tag: "→ Skill", title: "Repeatable procedure", body: "Release, migration, scaffold. Procedural knowledge that shouldn't bloat every chat." },
        { tag: "→ Subagent", title: "Heavy / isolated work", body: "Scan logs, read many files, review a diff. Protects the main context." },
        { tag: "→ Hook", title: "Non-negotiable rule", body: "Format, secret scan, test gate, “never touch X.” If it must always hold, it's code." },
        { tag: "→ Workflow", title: "Orchestrate many agents", body: "Fan-out review, judge panel, loop-until-dry. Heavy artillery, opt-in." },
        { tag: "→ Plugin", title: "Ship to a team", body: "Bundle skills/agents/hooks/commands, version, distribute via marketplace." },
        { tag: "→ Headless / SDK", title: "Run on an event", body: "CI, webhook, cron, pipeline step. Reasoning as a service in your stack." },
      ],
    },
    {
      type: "code",
      caption: "hook events — the determinism surface",
      text: "PreToolUse · PostToolUse · UserPromptSubmit · Notification\nStop · SubagentStop · PreCompact · SessionStart · SessionEnd\n\nPreToolUse  → allow / deny / modify a tool call before it runs   (enforcement gate)\nPostToolUse → react after (auto-format, run tests, log for audit)\nSessionStart→ inject context automatically\n\nverified: new hooks & custom agents register only at SESSION START\n          (external script files are re-read per invocation)",
    },
    {
      type: "callout",
      variant: "principle",
      title: "The one senior insight",
      html:
        "Push your guarantees out of the prompt and into <strong>code</strong> — hooks, tests, CI. Everything trustworthy about an AI workflow comes from the deterministic cage you build around a probabilistic model.",
    },
  ],
};
