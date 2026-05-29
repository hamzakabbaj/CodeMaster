"""Unit tests for scripts/roadmap_stats.py — the repo's first test rung."""
import contextlib
import io
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

import roadmap_stats as rs  # noqa: E402


def _run_main(argv):
    """Call main(argv) capturing stdout/stderr; return (exit_code, out, err)."""
    out, err = io.StringIO(), io.StringIO()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
        code = rs.main(argv)
    return code, out.getvalue(), err.getvalue()

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


class MainCli(unittest.TestCase):
    def test_directory_arg_returns_1_no_traceback(self):
        # The CM-25 finding: a directory must take the clean error path, not
        # raise IsADirectoryError. This test fails on the pre-CM-38 code.
        with tempfile.TemporaryDirectory() as d:
            code, _out, err = _run_main([d])
        self.assertEqual(code, 1)
        self.assertIn("not a readable file", err)

    def test_missing_path_returns_1(self):
        code, _out, err = _run_main([str(Path(tempfile.gettempdir()) / "definitely_missing_roadmap.md")])
        self.assertEqual(code, 1)
        self.assertIn("not a readable file", err)

    def test_readable_file_returns_0(self):
        with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False) as f:
            f.write(SAMPLE)
            name = f.name
        try:
            code, out, _err = _run_main([name])
        finally:
            Path(name).unlink()
        self.assertEqual(code, 0)
        self.assertIn("2/4 tickets done", out)


if __name__ == "__main__":
    unittest.main()
