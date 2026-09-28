---
description: Alias for /codemaster-init — set up a project's CodeMaster tracker (folder | plane).
argument-hint: <folder | plane>
---

**This is an alias.** `/tracker-init` is kept so existing muscle memory and docs keep working; the
implementation lives in **[`/codemaster-init`](codemaster-init.md)**.

Run `/codemaster-init` now, treating `$ARGUMENTS` as its arguments: a bare positional `folder` or
`plane` means `--tracker=<that>`, and every `--flag` is passed through unchanged. Follow that
command's steps exactly — doctor first, then the action, then verify.

Mention once, in the final report, that `/codemaster-init` is the current name and does more than
the tracker (it also diagnoses and repairs an existing setup via `--check`).
