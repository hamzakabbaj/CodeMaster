#!/usr/bin/env python3
"""Report CodeMaster ticket completion from ROADMAP.md.

Pure core (count_tickets / summary) + a thin CLI, so the logic is unit-testable
without touching the filesystem. No third-party deps.
"""
import re
import sys
from pathlib import Path

# Ticket lines look like: "- [x] `CM-7` — ..." or "- [ ] `CM-35` — ...".
_DONE = re.compile(r"^- \[x\] `CM-\d+`", re.MULTILINE)
_OPEN = re.compile(r"^- \[ \] `CM-\d+`", re.MULTILINE)


def count_tickets(text):
    """Return {'done', 'open', 'total'} ticket counts parsed from ROADMAP text."""
    done = len(_DONE.findall(text))
    open_ = len(_OPEN.findall(text))
    return {"done": done, "open": open_, "total": done + open_}


def summary(text):
    """One-line completion summary, e.g. '12/15 tickets done (80%)'."""
    c = count_tickets(text)
    pct = round(100 * c["done"] / c["total"]) if c["total"] else 0
    return f'{c["done"]}/{c["total"]} tickets done ({pct}%)'


def main(argv=None):
    argv = argv if argv is not None else sys.argv[1:]
    path = Path(argv[0]) if argv else Path(__file__).resolve().parent.parent / "ROADMAP.md"
    # is_file() (not exists()) so a directory takes the clean error path instead
    # of raising IsADirectoryError from read_text() (CM-38, found by CM-25).
    if not path.is_file():
        print(f"not a readable file: {path}", file=sys.stderr)
        return 1
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as err:  # PermissionError and friends — keep the error contract
        print(f"could not read {path}: {err}", file=sys.stderr)
        return 1
    print(summary(text))
    return 0


if __name__ == "__main__":
    sys.exit(main())
