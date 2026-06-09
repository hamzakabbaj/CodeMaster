# Design System Conventions

How to create and maintain the design system files for a project. Covers the file structure, token organization, component documentation, and the update workflow.

---

## Overview

The design system is a **living reference** of the project's visual language — colors, typography, spacing, and reusable components. It consists of three files:

| File | Purpose |
|------|---------|
| `styles.css` | Design tokens, base styles, and DS page layout (shared stylesheet) |
| `foundations.html` | Visual documentation of tokens (colors, type, spacing, radii, shadows) |
| `components.html` | All component specimens in a single scrollable page |

The design system is project-specific. Each project defines its own visual language based on its brand, audience, and product needs. Document what the project's wireframes use and what the development team needs to build consistently.

Navigation between files is handled by the app's tab UI — the HTML files do not need to link to each other.

---

## File Conventions

### Location

All design system files live in:

```
{project}/blueprint/{version}/system-design/design_system/
├── styles.css
├── foundations.html
└── components.html
```

### Shared stylesheet

Both HTML files link to `styles.css` for design tokens and DS page layout:

```html
<link rel="stylesheet" href="styles.css">
```

The stylesheet provides:
1. **Design tokens** — CSS custom properties in `:root`
2. **Base styles** — body, typography reset
3. **DS page layout** — `ds-page` grid, `ds-nav`, `ds-content`, `ds-section`, `ds-specimen`
4. **Utilities** — scrollbar, field-group/field-label

**Component-specific styles live in the `<style>` block of `components.html`**, not in `styles.css`.

---

## styles.css Structure

Organize the stylesheet in this order:

```
RESET             → box-sizing, margin/padding reset
DESIGN TOKENS     → :root { all CSS custom properties }
BASE              → body, default typography
DS PAGE LAYOUT    → ds-page grid, ds-nav, ds-content, ds-section, ds-specimen
UTILITIES         → scrollbar, field-group, field-label
```

Use clear section comments between each block:

```css
/* ================================================================
   DESIGN TOKENS
================================================================ */
```

**Important:** `styles.css` does NOT contain component styles. Component CSS lives in the `<style>` block of `components.html`.

### Token naming conventions

| Category | Prefix | Guideline |
|----------|--------|-----------|
| Surfaces | `--bg-` | Name by elevation: `app` → `panel` → `elevated` → `hover` → `active` |
| Text | `--text-` | Name by emphasis: `primary` → `secondary` → `tertiary` → `disabled` |
| Borders | `--border` | Plain for default, `-strong` for emphasis, `-focus` for interactive |
| Accent | `--accent` | Primary brand color. Add `-hover`, `-subtle` (low opacity), `-muted` variants |
| Semantic | Direct | `--success`, `--warning`, `--error`, `--info`. Add `-subtle` for backgrounds |
| Spacing | `--space-{n}` | Consistent base unit (typically 4px). Scale: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16 |
| Radii | `--radius-` | Size names: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `full` |
| Shadows | `--shadow-` | Size names: `sm`, `md`, `lg`. Optionally `glow` for accent-colored shadows |
| Typography | `--font-` | `sans` for UI text, `mono` for code. Limit to 2 font families |
| Transitions | `--transition-` | Speed names: `fast`, `base`, `slow` |
| Layout | descriptive | App-specific dimensions: `--sidebar-width`, `--topbar-height`, etc. |

### Token block template

```css
:root {
  /* ── Surfaces ── */
  /* ── Borders ── */
  /* ── Text ── */
  /* ── Accent ── */
  /* ── Semantic ── */
  /* ── Radii ── */
  /* ── Shadows ── */
  /* ── Spacing scale ({base}px base) ── */
  /* ── Typography ── */
  /* ── Transitions ── */
  /* ── Layout ── */
}
```

---

## foundations.html Structure

Foundations documents the raw design tokens with visual specimens.

### Page layout

```html
<div class="ds-page">
  <nav class="ds-nav">
    <div class="ds-nav-title">Foundations</div>
    <div class="ds-nav-group-label">Tokens</div>
    <a href="#colors">Colors</a>
    <a href="#typography">Typography</a>
    <a href="#spacing">Spacing</a>
    <a href="#radii">Radii</a>
    <a href="#shadows">Shadows</a>
  </nav>
  <main class="ds-content">
    <!-- sections -->
  </main>
</div>
```

The `ds-page` is a CSS Grid with a fixed-width side nav and flexible content area. The nav is sticky and scrollable.

### Section pattern

Each token category follows this structure:

```html
<section id="{category}" class="ds-section">
  <h2 class="ds-section-title">{Category Name}</h2>
  <p class="ds-section-desc">{Brief description of the category and usage guidance.}</p>

  <div class="ds-subsection">
    <h3 class="ds-subsection-title">{Subcategory}</h3>
    <!-- visual specimens -->
  </div>
</section>
```

### Token specimen types

| Token type | Visualization | Content |
|------------|---------------|---------|
| Colors | Swatch grid — color block + name + value | Group by: surfaces, text, accent/semantic, domain-specific |
| Typography | Text rendered at each scale | Show size, weight, usage context, font family |
| Spacing | Horizontal bars at each scale step | Show token name, bar at proportional width, px value |
| Radii | Rounded shapes at each radius | Show token name and px value |
| Shadows | Elevated cards with each shadow applied | Show token name |

Inline `<style>` blocks for specimen-only display helpers (swatch grids, type specimens, etc.) are acceptable in foundations.html since they only control specimen layout, not the design system itself.

---

## components.html Structure

All components are documented in a **single scrollable page** with sidebar navigation. Each component gets its own `<section>` with anchor links in the nav.

### Page layout

```html
<div class="ds-page">
  <nav class="ds-nav">
    <div class="ds-nav-title">Components</div>

    <div class="ds-nav-group-label">Primitives</div>
    <a href="#buttons">Buttons</a>
    <a href="#inputs">Inputs</a>
    <a href="#toggles">Toggles</a>
    <!-- ... -->

    <div class="ds-nav-group-label">Components</div>
    <a href="#topbar">Top Bar</a>
    <a href="#navigator">Navigator</a>
    <!-- ... -->

    <div class="ds-nav-group-label">Domain</div>
    <a href="#persona-card">Persona Card</a>
    <!-- ... -->
  </nav>

  <main class="ds-content">
    <!-- component sections -->
  </main>
</div>
```

### Component styles

Component-specific CSS lives in a `<style>` block in the `<head>` of `components.html`, using design tokens from `styles.css`:

```html
<head>
  <link rel="stylesheet" href="styles.css">
  <style>
    /* ── Buttons ── */
    .btn { /* ... */ }

    /* ── Inputs ── */
    .input { /* ... */ }

    /* ── Cards ── */
    .card { /* ... */ }
  </style>
</head>
```

Use section comments to separate component styles within the `<style>` block.

### Component section pattern

Each component follows this structure:

```html
<section id="{id}" class="ds-section">
  <h2 class="ds-section-title">{Component Name}</h2>
  <p class="ds-section-desc">{What it does, when to use it.}</p>

  <div class="ds-subsection">
    <h3 class="ds-subsection-title">{Variant}</h3>
    <div class="ds-specimen">
      <div class="ds-specimen-preview">
        <!-- Live HTML of the component -->
      </div>
      <div class="ds-specimen-code">
        <!-- Class names, key CSS properties -->
      </div>
    </div>
  </div>
</section>
```

### Specimen container

Every component specimen uses this structure:

| Part | Class | Content |
|------|-------|---------|
| Container | `ds-specimen` | Wraps preview + code |
| Preview | `ds-specimen-preview` | Live rendered component(s). Add `.dark` for dark backgrounds, `.column` for vertical layout, `.grid` for grid layout |
| Code | `ds-specimen-code` | Monospace block with class names, key CSS values |
| Label | `ds-specimen-label` | Optional header above the preview |

### Component grouping

Organize from simple to complex:

1. **Primitives** — buttons, inputs, toggles, badges, progress bars, status icons
2. **Components** — top bar, navigator, cards, modals, empty states
3. **Domain** — project-specific composite components tied to the product's unique features

### Documenting each component

For every component, show:

- **All meaningful variants** — default, hover, active, disabled, size variations
- **Realistic content** — use actual labels and data from the project, not "Button" or "Card Title"
- **Code notes** — class names, key CSS properties, sizing, and any usage constraints

---

## Adding New Tokens

When the project needs a new design token:

1. Add the CSS custom property to `:root` in `styles.css`, in the correct category
2. Add a visual specimen to the appropriate section in `foundations.html`
3. Use the token in component styles — never use the raw value directly

---

## Adding New Components

When the project needs a new documented component:

1. Add component-specific CSS to the `<style>` block in `components.html`
2. Add a new `<section>` in `<main>` following the specimen pattern
3. Add a nav link in the sidebar `<nav>`

---

## Do / Don't

| Do | Don't |
|----|-------|
| Define all colors, spacing, and radii as CSS custom properties in `styles.css` | Hardcode hex values or pixel values in component styles |
| Put component-specific CSS in the `<style>` block of `components.html` | Put component styles in `styles.css` |
| Keep `foundations.html` and `components.html` in sync with `styles.css` tokens | Let the HTML documentation drift from the actual CSS |
| Show realistic content in component specimens | Use "Button" as button text or "Lorem ipsum" in cards |
| Document all meaningful variants of a component | Document only the default state |
| Group components logically in the navigation | Dump all components in a flat list |
| Use the `ds-specimen` pattern consistently | Invent different documentation layouts per component |
| Use section comments in `styles.css` | Mix unrelated styles without clear separation |

---

## Workflow Summary

When creating or updating the design system:

1. **Read existing `styles.css`** to understand current tokens
2. **Read `components.html`** to check what's documented
3. **Update `styles.css`** if tokens need to be added or changed
4. **Update `foundations.html`** if tokens were added or changed
5. **Update `components.html`** if components were added or changed
6. **Verify consistency** — every token in CSS should have a specimen, every specimen should use real tokens
