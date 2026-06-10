---
name: new-ticket
description: Scaffold ONE already-shaped CodeMaster ticket (CM-<n>) as JSON and register it in the canonical roadmap.json. Use when it's already clear the work is a single, well-formed ticket. If the request is out of the blue and its size/shape is undecided (a feature, idea, or bug that might be several stories or a whole epic), use feature-intake first to triage the altitude.
---

# new-ticket

Create a well-formed CodeMaster ticket so every item meets our Definition of Ready. Encodes the process in `backlog/README.md`.

> **Scope:** this skill scaffolds **one ticket whose shape is already decided.** It does **not** triage altitude — if you don't yet know whether the request is one ticket, several stories, or an epic, start at [`feature-intake`](../feature-intake/SKILL.md) (the front door), which routes back here for the small cases.

## Steps
1. **Get the next number.** Run `.claude/skills/new-ticket/next-number.sh` — it prints the next free `CM-<n>`.
2. **Gather inputs** (ask only for what's missing): title, epic/phase, type (`task|story|spike|fix`), goal (one sentence), acceptance criteria.
3. **Create the ticket folder** `blueprint/v1/backlog/tickets/CM-<n>-<short-slug>/` and write its `ticket.json`, conforming to `.claude/skills/backlog/schema/ticket.schema.json` (`id`, `title`, `epic` = the epic id, `type`, `status: "todo"`, `acceptance_criteria`, plus a `goal` for a task or `story` for a story). Slug = kebab-case of the title. (`plan.md` and `evidence.md` are optional siblings, added later when the ticket is built — see `backlog/README.md`.)
4. **Register in `roadmap.json`**: append `CM-<n>` to the correct epic's `tickets` list in `blueprint/v1/backlog/roadmap.json` and add its board line under `board_summaries` (`"CM-<n>": "— <title>"`), then run `python3 scripts/gen_roadmap.py` to regenerate `ROADMAP.md`. **Never hand-edit `ROADMAP.md`** — it is a generated view.
5. **Confirm** the new path and number back to the user. Do not start work — creating ≠ starting (that's `/start-ticket`).

## Guardrails
- One concern per ticket. If acceptance criteria span unrelated changes, suggest splitting.
- Keep detail just-in-time: a placeholder-only ticket is fine until it's pulled into work.
- Status lives only in `ticket.json`; `ROADMAP.md` is generated from the JSON backlog (`scripts/gen_roadmap.py`), so never edit the board by hand. `next-number.sh` still works (it greps `CM-<n>` across files, JSON included).
