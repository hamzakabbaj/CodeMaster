"""Unit tests for scripts/roadmap_stats.py — the repo's first test rung."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

import roadmap_stats as rs  # noqa: E402

SAMPLE = """
# Roadmap
- [x] `CM-1` — done one
- [x] `CM-2` — done two
- [ ] `CM-3` — open one
- [ ] `CM-4` — blocked ⏸️ still open
not a ticket line
- [x] not-a-ticket without backtick id
"""


class CountTickets(unittest.TestCase):
    def test_counts(self):
        c = rs.count_tickets(SAMPLE)
        self.assertEqual(c, {"done": 2, "open": 2, "total": 4})

    def test_ignores_non_ticket_lines(self):
        # The "- [x] not-a-ticket..." line lacks a `CM-<n>` id, so it's excluded.
        self.assertEqual(rs.count_tickets(SAMPLE)["total"], 4)

    def test_empty(self):
        self.assertEqual(rs.count_tickets(""), {"done": 0, "open": 0, "total": 0})


class Summary(unittest.TestCase):
    def test_summary(self):
        self.assertEqual(rs.summary(SAMPLE), "2/4 tickets done (50%)")

    def test_summary_empty_no_div_by_zero(self):
        self.assertEqual(rs.summary(""), "0/0 tickets done (0%)")


if __name__ == "__main__":
    unittest.main()
