# EtiKets — Design of Record

> **What this file is.** The human-readable **design-of-record**: a summary of the
> approved design, pointers to the full imported dataset, and the **approval note**
> that marks "design done." It answers *what & why* — never *how*. In a real repo the
> detailed artifacts (personas, journey maps, IA, wireframes, architecture) live in
> `design/design_thinking/` and `design/technical_design/`; this file is the index.

**Status:** ✅ Design done — reviewed by `architect` on 2026-05-20. No unresolved
high-severity concerns. Approved to proceed to `/spec`.

---

## What
A mobile app (iOS/Android) for everyday micro-tasks where the day's task is **picked
at random** and **can't be swapped** — turning "I'll do it later" into a daily game.
Add tasks by title to a pool; one is drawn each day; mark it done; build a streak.

## Why
People accumulate small-but-important tasks (admin, errands, upkeep) that never feel
urgent, so they're deferred indefinitely — and the pile becomes stress. Classic to-do
lists fail because they *leave the choice to the user*, who picks the easy thing or
nothing. **Removing the choice** (random draw + no swapping) kills the decision
paralysis; **gamification** (streaks) turns chores into a satisfying habit.

## Who
Primary: active **young adults (20–35)**, mobile-native, prone to procrastinating on
life's small tasks.

## Goal & success metrics
> "Deliver a gamified task-draw experience that lets young adults complete one
> friction-free micro-task per day."

| Metric | Target | Timeframe |
|---|---|---|
| Completion rate of drawn tasks | > 70% | 3 months post-launch |
| Avg. streak (active users) | 5+ consecutive days | 3 months post-launch |
| D7 retention | > 30% | 3 months post-launch |
| Open-to-draw time | < 30 s | at MVP launch |
| Tasks added / user / week | 3+ | 3 months post-launch |

## MVP scope
**One loop only:** add tasks (title only) → draw one random task per day → mark it
done → track the streak. Push notifications to remind the daily draw. One achievement:
the streak.

## Non-goals (hard constraints on the build)
- No project/work task management — personal micro-tasks only
- No collaboration or social sharing in V1
- No priorities or categories — **randomness is the system**
- No calendar or deadlines — day-by-day only
- **Mobile only** — no web for the MVP
- No monetization in V1 — validate the concept first

## Key product decisions (the *why* behind the mechanic)
- **Forced random draw** — the user never chooses; this is the core anti-procrastination bet.
- **Immutability** — once drawn, the task can't be changed (commitment), *except* with an
  active streak (a reward that buys one swap).
- **Streak as the only gamification in V1** — keep the loop legible; defer badges/levels.

## Pointers to the full design (imported dataset)
- `design/design_thinking/` — project_brief, persona, user_journey_map, value_proposition,
  how_might_we, user_flow, storyboards, information_architecture, wireframing_prototyping
- `design/technical_design/` — architecture, design_system

## Hand-off
This design is the **input to [`/spec`](../specs/README.md)**. The spec will translate
this *what/why* into a build plan — and surface the build-time risks this document never
had to consider (see the day-boundary problem in the MVP-loop spec).
