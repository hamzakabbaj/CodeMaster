/* Site-wide config. Classic script -> assigns to window.CM (file://-safe). */
window.CM = window.CM || {};
window.CM.site = {
  name: "CodeMaster",
  tagline: "An engineering operating system on Claude Code",
  nav: [
    { label: "Overview", href: "index.html" },
    { label: "Capabilities", href: "capabilities.html" },
    { label: "The Loop", href: "loop.html" },
    { label: "Delivery", href: "delivery.html" },
    { label: "Playbooks", href: "playbooks.html" },
    { label: "The Fleet", href: "fleet.html" },
    { label: "Inside Big Tech", href: "bigtech.html" },
    { label: "Roadmap", href: "roadmap.html" },
  ],
  footer: "CodeMaster — built by dogfooding its own process.",
  note: "guarantees come from the cage, not the model.",
};
