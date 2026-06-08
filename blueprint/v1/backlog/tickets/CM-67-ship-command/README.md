# CM-67: Add the ship command: encode the Step-6 PR -> review -> merge ceremony

> Generated from `ticket.json` — do not edit by hand (`scripts/gen_tickets.py`).

- **Epic:** phase-0-delivery-infrastructure
- **Type:** task
- **Status:** ✅ done

## Goal
Encode the greenfield Step-6 ship ceremony as a /ship command so a finished branch goes PR -> both gates -> automated review -> (confirm) -> squash-merge -> sync -> verify post-merge main, with the PR-title length trap prevented deterministically instead of by hand.

## Acceptance criteria
- [x] .claude/commands/ship.md exists and drives the Step-6 ceremony for CM-<n> on its feature branch: final ci.sh gate, flip ticket to done + regen, push, open PR with the template body, wait for both required gates, automated review, squash-merge --delete-branch, sync main, verify post-merge main CI
- [x] The command VALIDATES the proposed PR title by feeding it through .githooks/commit-msg BEFORE gh pr create (deterministic guard against the squash-subject-too-long trap); pr-title.yml stays the CI backstop
- [x] The command STOPS for human review + explicit confirmation before the irreversible squash-merge (merge is outward-facing and hard to reverse)
- [x] The command never merges on red CI or a failing gate, and reuses existing primitives (ci.sh, checkpoint.sh, the commit-msg hook, the reviewer agent / review-board) rather than restating them
- [x] CONTRIBUTING.md points at /ship as the encoded form of the PR contract
- [x] scripts/ci.sh green (8 rungs)

## Verification
bash scripts/ci.sh green (markdown-links rung covers ship.md's cross-references; commit-message rung covers the conventional subject). Dogfooded: CM-67 itself is shipped via the full manual ceremony this command encodes (the last time by hand).

## Plan
Mirror .claude/commands/start-ticket.md's imperative numbered style. Reuse: ci.sh (final gate), commit-msg hook (title validation), gen_roadmap/gen_tickets (close the ticket), reviewer agent / review-board (automated review). Add a one-line CONTRIBUTING.md pointer. Ship CM-67 itself through the manual ceremony it encodes.

## Notes
Completes the Build->Ship arc started by CM-66 (build skill). ship and start-ticket are the two mechanical bookends around the build skill; ship is a command (mechanical ceremony) not a skill. The deterministic title guard is the headline win — the PR title is the squash-merge subject, and a >72-char subject has turned main red twice (CM-57, CM-60). Confirm-before-merge is the safe default until branch protection (CM-35) is enabled.
