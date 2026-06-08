# Step 4 — Backlog *(markdown, by design)*

CodeMaster's backlog is **markdown, not JSON** — the deliberate exception in the
two-serializations decision (ROADMAP decisions log, 2026-06-05). It is **not** mirrored to a
`roadmap.json` here, to avoid two sources of truth and to keep `next-number.sh`,
`roadmap_stats.py`, `new-ticket`, and `/start-ticket` working unchanged.

The authoritative backlog:
- [ROADMAP.md](../../../ROADMAP.md) — the index + status board (every `CM-<n>` and its state)
- [backlog/README.md](../../../backlog/README.md) — folder-per-ticket layout + DoR / DoD

Projects built *via* CodeMaster keep this module as JSON instead — see the worked example in
[examples/etikets](../../../examples/etikets/README.md).
