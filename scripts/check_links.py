#!/usr/bin/env python3
"""Verify that relative markdown links in tracked .md files resolve to real paths.

Skips external (http/https/mailto), pure anchors (#...), and template
placeholders (<...>). Exits 1 if any link is broken.
"""
import re
import subprocess
import sys
from pathlib import Path

LINK_RE = re.compile(r"\[[^\]]*\]\(([^)]+)\)")


def tracked_md_files():
    # Include tracked AND untracked-but-not-ignored files, so local runs
    # validate new work before it's committed (CI sees everything anyway).
    out = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard", "--", "*.md"],
        capture_output=True,
        text=True,
        check=True,
    ).stdout
    return sorted({Path(p) for p in out.splitlines() if p})


def main() -> int:
    broken = []
    for md in tracked_md_files():
        if not md.exists():
            continue
        text = md.read_text(encoding="utf-8")
        for target in LINK_RE.findall(text):
            target = target.strip()
            if (
                target.startswith(("http://", "https://", "mailto:", "#"))
                or target.startswith("<")
                or not target
            ):
                continue
            path = target.split("#", 1)[0]
            if not path:
                continue
            resolved = (md.parent / path).resolve()
            if not resolved.exists():
                broken.append(f"{md}: -> {target}")

    if broken:
        print("✗ Broken markdown links:")
        for b in broken:
            print(f"  {b}")
        return 1
    print("✓ All relative markdown links resolve")
    return 0


if __name__ == "__main__":
    sys.exit(main())
