#!/usr/bin/env python3
"""Generate a synced README.md next to each ticket.json.

Each foldered ticket (blueprint/*/backlog/tickets/<id>-<slug>/ticket.json) gets a
README.md rendered from its JSON, so the ticket has a GitHub-rendered view while
ticket.json stays the source of truth. README.md is GENERATED — do not hand-edit.

Kept in sync by the pre-commit hook (regenerates when backlog JSON changes) and a
CI rung (--check fails on drift).

Usage:
  python3 scripts/gen_tickets.py            # write every ticket README.md
  python3 scripts/gen_tickets.py --check    # exit 1 if any is stale
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STATUS_LABEL = {"done": "✅ done", "in_progress": "🟦 in progress",
                "todo": "⬜ todo", "blocked": "⏸️ blocked"}


def find_ticket_jsons():
    """Every foldered ticket.json under any blueprint/*/backlog/tickets/<dir>/."""
    roots = []
    rb = ROOT / "blueprint"
    if rb.exists():
        roots.append(rb)
    ex = ROOT / "examples"
    if ex.exists():
        roots += [p / "blueprint" for p in ex.iterdir() if (p / "blueprint").exists()]
    out = []
    for bp in roots:
        for ver in bp.iterdir():
            tdir = ver / "backlog" / "tickets"
            if not tdir.is_dir():
                continue
            for entry in tdir.iterdir():
                tj = entry / "ticket.json"
                if entry.is_dir() and tj.is_file():
                    out.append(tj)
    return out


def render(tj):
    t = json.loads(tj.read_text(encoding="utf-8"))
    folder = tj.parent
    done = t.get("status") == "done"
    box = "x" if done else " "
    lines = [f"# {t['id']}: {t['title']}", ""]
    lines.append("> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).")
    lines.append("")
    lines.append(f"- **Epic:** {t.get('epic', '')}")
    lines.append(f"- **Type:** {t['type']}" + (f" · {t['subtype']}" if t.get("subtype") else ""))
    lines.append(f"- **Status:** {STATUS_LABEL.get(t.get('status', 'todo'), t.get('status'))}")
    if t.get("depends_on"):
        lines.append(f"- **Depends on:** {', '.join(t['depends_on'])}")
    if t.get("blocks"):
        lines.append(f"- **Blocks:** {', '.join(t['blocks'])}")
    if t.get("spec"):
        lines.append(f"- **Spec:** `{t['spec']}`")
    lines.append("")
    if t.get("story"):
        lines += ["## Story", t["story"], ""]
    elif t.get("goal"):
        lines += ["## Goal", t["goal"], ""]
    if t.get("acceptance_criteria"):
        lines.append("## Acceptance criteria")
        lines += [f"- [{box}] {ac}" for ac in t["acceptance_criteria"]]
        lines.append("")
    if t.get("verification"):
        lines += ["## Verification", t["verification"], ""]
    if t.get("plan_md"):
        lines += ["## Plan", t["plan_md"], ""]
    elif (folder / "plan.md").exists():
        lines += ["## Plan", "See [plan.md](plan.md).", ""]
    if t.get("notes"):
        lines += ["## Notes", t["notes"], ""]
    if (folder / "evidence.md").exists():
        lines += ["## Evidence", "See [evidence.md](evidence.md).", ""]
    elif t.get("evidence"):
        lines += ["## Evidence", t["evidence"], ""]
    return "\n".join(lines).rstrip() + "\n"


def main(argv=None):
    argv = argv if argv is not None else sys.argv[1:]
    check = "--check" in argv
    stale = []
    written = 0
    for tj in find_ticket_jsons():
        readme = tj.parent / "README.md"
        content = render(tj)
        if check:
            current = readme.read_text(encoding="utf-8") if readme.is_file() else ""
            if current != content:
                stale.append(str(readme.relative_to(ROOT)))
        else:
            readme.write_text(content, encoding="utf-8")
            written += 1
    if check:
        if stale:
            print("✗ Ticket README.md out of sync with ticket.json:", file=sys.stderr)
            for s in stale:
                print(f"    - {s}", file=sys.stderr)
            print("  Run: python3 scripts/gen_tickets.py", file=sys.stderr)
            return 1
        print("✓ All ticket README.md are in sync with their ticket.json")
        return 0
    print(f"wrote {written} ticket README.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
