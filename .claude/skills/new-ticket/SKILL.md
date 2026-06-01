---
name: new-ticket
description: Scaffold a new CodeMaster backlog ticket (CM-<n>) from the template and register it in ROADMAP.md. Use when the user asks to create, add, or file a ticket, story, task, spike, or bug for CodeMaster.
---

# new-ticket

Create a well-formed CodeMaster ticket so every item meets our Definition of Ready. Encodes the process in `backlog/README.md`.

## Steps
1. **Get the next number.** Run `.claude/skills/new-ticket/next-number.sh` — it prints the next free `CM-<n>`.
2. **Gather inputs** (ask only for what's missing): title, epic/phase, type (`task|story|spike|fix`), goal (one sentence), acceptance criteria.
3. **Create the ticket folder** `backlog/tickets/CM-<n>-<short-slug>/` and write its `README.md` from `backlog/templates/ticket.md`, filling every placeholder. Slug = kebab-case of the title. Status starts `⬜ todo`. (`plan.md` and `evidence.md` are optional siblings, added later when the ticket is built — see `backlog/README.md`.)
4. **Register in ROADMAP.md**: add `- [ ] \`CM-<n>\` — <title>` under the correct phase's ticket list. ROADMAP is the index/status board; the ticket folder holds the detail.
5. **Confirm** the new path and number back to the user. Do not start work — creating ≠ starting (that's `/start-ticket`).

## Guardrails
- One concern per ticket. If acceptance criteria span unrelated changes, suggest splitting.
- Keep detail just-in-time: a placeholder-only ticket is fine until it's pulled into work.
- Don't duplicate status between ROADMAP and the ticket file beyond the single status marker.
