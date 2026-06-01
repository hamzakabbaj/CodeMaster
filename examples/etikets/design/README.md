# design/ — the design-of-record

> **What this folder is.** It holds the **what & why** of the product, validated
> *before* any code: the problem, the users, the goal, the scope, and the
> non-goals. This is the output of **Step 1 (Design Thinking)** — and in a real
> project it's often produced by a mature, separate design process and *imported*.

## The design-of-record concept
When the design comes from a real design-thinking pipeline (interviews, personas,
journey maps, IA, wireframes, an architecture sketch), **that dataset *is* the design
artifact** — richer than a single hand-written `design.md`. In EtiKets' real repo it
would look like:

```
design/
  etikets-design.md          # the human-readable index + decision/approval record
  design_thinking/           # imported: project_brief, persona, journey, IA, wireframes…
  technical_design/          # imported: architecture, design_system…
```

Here we keep just [etikets-design.md](etikets-design.md) — the **summary + pointers +
approval note** — to illustrate the shape without copying the whole dataset.

## The Step-1 gate: design-review
The gate isn't "did we write a design," it's **"is this design sound & buildable."**
When the design is *imported* from a trusted process, the gate shifts from *generate*
to **validate**: the `architect` (and `security`, if the surface is risky) reviews it
against doctrine — where complexity lives, what will rot, what boundary breaks — and
you record the sign-off. That recorded approval is what "**design done**" means, and
it's the entry condition for `/spec` (Step 2).

## What lives here vs. what doesn't
- **Here:** problem, users, goal + success metrics, MVP scope, non-goals, key product
  decisions, and the approval record.
- **Not here:** the *how* (data models, APIs, build steps) — that's `specs/`. Keeping
  the two apart is deliberate: design is the problem space, the spec is the solution.
