# CM-28: Version + changelog — release discipline for the plugin unit

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-5-package-as-plugin-track-b
- **Type:** task
- **Status:** ✅ done

## Goal
Give the plugin unit a release discipline: a Keep-a-Changelog `CHANGELOG.md`, a documented SemVer + `claude plugin tag` flow, so versions are deliberate and traceable — even though CodeMaster is dogfooded in-repo and not published.

## Acceptance criteria
- [x] `.claude/CHANGELOG.md` exists in Keep-a-Changelog format with an `[Unreleased]` section targeting 0.1.0, listing the packaging work (CM-26 manifest, CM-27 hooks component + drift guard, CM-28 changelog) under Added and the CM-26 frontmatter fixes under Fixed; co-located with plugin.json so it ships with the unit; not scanned as a plugin component (verified: validate shows only the two known agents/ README warnings)
- [x] `plugin.json` carries the SemVer version of record (0.1.0, present since CM-26) — the changelog defers to it
- [x] Release flow documented in `docs/03-delivery-process.md` §6: bump `plugin.json` version, accumulate under `[Unreleased]`, then `claude plugin tag .claude` creates the annotated tag `codemaster--v<version>` (`--dry-run` to preview, `--push --remote origin` to publish), then promote `[Unreleased]` -> `[<version>] - <date>`
- [x] `claude plugin tag .claude --dry-run` succeeds and reports `codemaster--v0.1.0` (verified). The actual tag is cut at PHASE CLOSE (after CM-29), not in this ticket, so 0.1.0 includes the CI rung + install smoke.
- [x] scripts/ci.sh green (markdown-links rung happy; external https refs are reference-style, not relative)

## Verification
`claude plugin tag .claude --dry-run` -> `Tag: codemaster--v0.1.0 ... would create tag codemaster--v0.1.0 at HEAD` (validates plugin.json; the two agents/ README warnings are tolerated). `claude plugin validate .claude` still passes with only those two warnings — CHANGELOG.md at the .claude/ root is NOT treated as a component. bash scripts/ci.sh green.

## Plan
1) `.claude/CHANGELOG.md` (Keep a Changelog), [Unreleased] -> 0.1.0, Added/Fixed from CM-26/27/28. 2) docs/03-delivery-process.md §6: 'Releasing the CodeMaster plugin' (SemVer in plugin.json, accumulate Unreleased, `claude plugin tag .claude`). 3) Verify `claude plugin tag --dry-run` + validate. 4) Defer the real tag to phase close. 5) ci green.

## Notes
Version (0.1.0) already shipped in plugin.json with CM-26, so this ticket is the CHANGELOG + the release ceremony, not the version field itself. CHANGELOG lives at `.claude/CHANGELOG.md` (the plugin root) so it travels with the unit if ever installed. Deliberately do NOT cut the real `codemaster--v0.1.0` tag yet — phase isn't complete until CM-29 (CI rung + install smoke); cutting 0.1.0 now would tag an incomplete unit. The tag is the last act of Phase 5.
