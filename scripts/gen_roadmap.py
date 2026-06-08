#!/usr/bin/env python3
"""Generate ROADMAP.md from the canonical JSON backlog.

ROADMAP.md is a GENERATED VIEW — do not hand-edit it. The source of truth is
blueprint/v1/backlog/roadmap.json (board structure + prose) and
blueprint/v1/backlog/tickets/CM-<n>.json (per-ticket status + body).

Emits the same `- [x] \`CM-n\` — ...` line format roadmap_stats.py parses, so the
ladder's test rung keeps working. Triggered on demand, by the pre-commit hook
when backlog JSON changes, and checked in CI for drift (--check).

Usage:
  python3 scripts/gen_roadmap.py            # write ROADMAP.md
  python3 scripts/gen_roadmap.py --check    # exit 1 if ROADMAP.md is stale
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BACKLOG = ROOT / "blueprint" / "v1" / "backlog"
ROADMAP = ROOT / "ROADMAP.md"
STATUS_EMOJI = {"done": "✅", "todo": "⬜", "in_progress": "🟦", "blocked": "⏸️"}


def ticket_status_map():
    """id -> status, reading foldered (tickets/<id>-<slug>/ticket.json) or flat tickets."""
    out = {}
    tdir = BACKLOG / "tickets"
    if tdir.is_dir():
        for entry in tdir.iterdir():
            tj = entry / "ticket.json" if entry.is_dir() else (entry if entry.suffix == ".json" else None)
            if tj and tj.is_file():
                d = json.loads(tj.read_text(encoding="utf-8"))
                out[d["id"]] = d.get("status", "todo")
    return out


def render():
    rm = json.loads((BACKLOG / "roadmap.json").read_text(encoding="utf-8"))
    status = ticket_status_map()
    out = [rm["preamble"], "", "## Status overview", "",
           "| Phase | Epic | Track | Status |", "|---|---|---|---|"]
    for e in rm["epics"]:
        out.append(f"| {e['phase']} | {e['short_name']} | {e['track']} | {STATUS_EMOJI[e['status']]} |")
    out += ["", "---"]
    for e in rm["epics"]:
        out += ["", f"## {e['name']}"]
        if e.get("description"):
            out.append(f"*{e['description']}*")
        out.append("")
        for tid in e["tickets"]:
            box = "x" if status.get(tid) == "done" else " "
            out.append(f"- [{box}] `{tid}` {rm['board_summaries'][tid]}")
        if e.get("exit"):
            out += ["", f"**Exit:** {e['exit']}"]
    out += ["", "---", "", "## Decisions log"]
    out += rm["decisions_log"]
    return "\n".join(out) + "\n"


def main(argv=None):
    argv = argv if argv is not None else sys.argv[1:]
    generated = render()
    if "--check" in argv:
        current = ROADMAP.read_text(encoding="utf-8") if ROADMAP.is_file() else ""
        if current != generated:
            print("✗ ROADMAP.md is out of sync with the JSON backlog. "
                  "Run: python3 scripts/gen_roadmap.py", file=sys.stderr)
            return 1
        print("✓ ROADMAP.md is in sync with the JSON backlog")
        return 0
    ROADMAP.write_text(generated, encoding="utf-8")
    print(f"wrote {ROADMAP.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
