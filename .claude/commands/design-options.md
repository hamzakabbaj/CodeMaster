---
description: Explore a UI/UX choice for a ticket — generate 2–3 throwaway variants of the element as a file://-openable gallery, then stop for the user to pick. The design-altitude parallel of /spec. Greenfield Step 5 (element altitude).
argument-hint: <CM-number>  (e.g. /design-options 68) — defaults to the current branch's ticket
---

You are exploring the **look & interaction** of one element for ticket **CM-$ARGUMENTS**, so the user can choose a direction *before* it's built. This is the design-altitude parallel of `/spec`: where `/spec` attacks a gnarly *plan*, this surfaces a UI/UX *choice*. The engine is the `frontend-design` skill (the official plugin) when it's installed; where it isn't (a Track B/C repo without it), fall back to generating the gallery directly with HTML/CSS — the skill makes the variants more distinctive, it isn't a hard dependency. **The gallery is a decision aid, never the implementation.**

Do exactly this:

1. **Resolve the ticket.** If `$ARGUMENTS` is empty, infer `CM-<n>` from the current branch (`feat/CM-<n>-<slug>`). Read its `ticket.json` — the goal, acceptance criteria, and the **specific element** in question (a button, a card, a form, a view).
2. **Confirm a choice is actually open.** This runs inside `build`'s Plan beat, on the ticket's branch. If the element's look is **already determined** by the Step-2 design system (`blueprint/v1/system-design/design_system/`), say so and **stop — reuse the system, don't re-explore.** Only proceed when there's a genuine visual/interaction decision to make.
3. **Generate 2–3 DISTINCT variants** of the element with the `frontend-design` skill (or directly, if that plugin isn't installed), written as a **single self-contained, `file://`-openable gallery** at `prototypes/CM-$ARGUMENTS-<slug>/index.html`. Requirements:
   - All variants on one page, clearly labelled, shown side by side, each with a one-line note on its tradeoff.
   - Genuinely different directions (layout / interaction / emphasis) — **not recolours of one idea.**
   - Reuse the project's **design tokens** where they exist; this is exploration of *direction*, not a license to ignore the system.
   - Self-contained HTML/CSS/JS (no server, no fetch, no modules) so it opens straight off disk — same `file://` constraint as the rest of CodeMaster's static surfaces.
4. **Present + STOP for the pick.** Give the user the `file://` path to open and a short summary of each variant and its tradeoff. **Stop and let the user choose** — this is the human gate, exactly as `/spec` stops for plan-review. Do not start building.
5. **Record the decision in `plan.md`** beside the ticket (`blueprint/v1/backlog/tickets/CM-$ARGUMENTS-<slug>/plan.md`, create if absent): the **chosen variant, why, and why-not the rejected ones** — a lightweight ADR. (This `plan.md` is also the `gnarly` signal for `build-critique`, so the design decision and the architect lens travel together.)
6. **Hand back to `build`.** The chosen direction is now built **for real** with the project's components in the loop — the prototype is discarded.

Guardrails:
- **`prototypes/` is gitignored — never commit the gallery.** The durable artifact is the decision recorded in `plan.md`. No committed binaries or screenshots (they bloat history and go stale).
- **The prototype is a decision aid, never the implementation.** Build the pick with real project components, then run the verify → checkpoint → critique loop on *that*.
- **Reuse the design system first.** If the look is already dictated, don't re-explore — stop (step 2).
- **Element altitude only.** This is one element/screen for one ticket. Whole-project UX is Step-1 `design-thinking`; the system's component language is the Step-2 `design_system`. Same wireframe-and-pick loop, smallest scale.
