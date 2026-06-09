"""Drift guard: the plugin hook registration (.claude/hooks/hooks.json) must stay
semantically identical to the live project registration (.claude/settings.json).

Why this test exists (CM-27): CodeMaster is packaged as a plugin *unit* but is NOT
installed in its own repo — it loads .claude/ natively, so .claude/settings.json is
what actually runs the hooks. hooks.json is the packaged mirror that ships in the
plugin. Two registrations of the same hooks can silently diverge; this test fails
the build the moment they do.

The two files differ ONLY in the path prefix (settings.json uses
${CLAUDE_PROJECT_DIR:-$PWD}/.claude/..., the plugin uses ${CLAUDE_PLUGIN_ROOT}/...),
so we compare on the handler SCRIPT BASENAME plus every other field (event, matcher,
type, if, timeout, statusMessage). A new/changed/removed hook in one file but not the
other => drift => red.
"""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SETTINGS = ROOT / ".claude" / "settings.json"
PLUGIN_HOOKS = ROOT / ".claude" / "hooks" / "hooks.json"

_SCRIPT = re.compile(r"([\w.-]+\.(?:sh|py|js|ts|mjs))")


def _script_basename(command):
    """Reduce a hook command to its handler script basename, dropping the path
    prefix that legitimately differs between settings.json and the plugin."""
    m = _SCRIPT.findall(command or "")
    return m[-1] if m else (command or "")


def _canonical(hooks_block):
    """Normalize a {EventName: [{matcher, hooks:[...]}]} block to a comparable,
    order-independent structure keyed by event -> sorted groups."""
    out = {}
    for event, groups in (hooks_block or {}).items():
        norm_groups = []
        for g in groups:
            handlers = tuple(sorted(
                (
                    h.get("type"),
                    _script_basename(h.get("command")),
                    h.get("if"),
                    h.get("timeout"),
                    h.get("statusMessage"),
                )
                for h in g.get("hooks", [])
            ))
            norm_groups.append((g.get("matcher"), handlers))
        out[event] = sorted(norm_groups)
    return out


class TestHooksSync(unittest.TestCase):
    def test_both_files_exist(self):
        self.assertTrue(SETTINGS.exists(), f"missing {SETTINGS}")
        self.assertTrue(PLUGIN_HOOKS.exists(), f"missing {PLUGIN_HOOKS}")

    def test_plugin_hooks_mirror_settings(self):
        settings = json.loads(SETTINGS.read_text())
        plugin = json.loads(PLUGIN_HOOKS.read_text())
        live = _canonical(settings.get("hooks"))
        packaged = _canonical(plugin.get("hooks"))
        self.assertEqual(
            live,
            packaged,
            "\n.claude/settings.json and .claude/hooks/hooks.json have DRIFTED.\n"
            "Every hook (event, matcher, handler script, if, timeout, statusMessage) "
            "must match in both. Update whichever you changed so they agree.",
        )


if __name__ == "__main__":
    unittest.main()
