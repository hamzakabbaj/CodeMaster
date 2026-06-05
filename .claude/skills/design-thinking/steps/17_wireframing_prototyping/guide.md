# Wireframe Conventions

How to create wireframe HTML files for a project. Covers sets, file structure, naming, per-set stylesheets, and content approach.

---

## Overview

Wireframes are **static HTML files** that visualize the application's screens. They are not functional prototypes — no JavaScript logic, no API calls, no state management. They exist so the user can see the layout, content hierarchy, and visual tone of each screen.

Wireframes are organized into **sets** — each set is a subfolder representing a distinct target (e.g., desktop, mobile, admin dashboard). Every set has its own `styles.css` stylesheet and numbered HTML files. Content is realistic (populated with actual project data from prior steps), not lorem ipsum.

Sets are **auto-detected** by the viewer — any subfolder containing HTML files is treated as a wireframe set. No manifest or JSON catalog is needed.

---

## Wireframe Sets

A wireframe set groups screens that belong to the same target. Split wireframes into multiple sets when:

- **Different viewports** — desktop vs. mobile vs. tablet responsive designs
- **Different products** — main app vs. admin panel vs. marketing site
- **Different audiences** — end-user interface vs. internal tools

A project with only one target still uses a single set (e.g., `app/`).

Each set has its own:
- Subfolder (directly under the step's data directory)
- `styles.css` with independent design tokens
- Numbered HTML wireframe files

---

## File Conventions

### Location

Wireframes live inside set subfolders directly under the step directory:

```
{step-directory}/
  {set-id}/
    styles.css
    01_{kebab-case}.html
    02_{kebab-case}.html
    ...
```

Example with multiple sets:

```
wireframing_prototyping/
  desktop/
    styles.css
    assets/
      logo.svg
      hero.png
    01_dashboard.html
    02_workspace.html
    03_settings.html
  mobile/
    styles.css
    assets/
      logo.svg
    01_home.html
    02_profile.html
  admin/
    styles.css
    01_user-management.html
    02_analytics.html
```

### Assets

Each set can have an optional `assets/` folder for images (logos, icons, illustrations, etc.). Reference them with relative paths from the HTML files:

```html
<img src="assets/logo.svg" alt="Logo">
```

When wireframes need custom visuals, use the available MCP tools:

- **Image generation** (`imagegen-mcp`) — generate illustrations, hero images, backgrounds, or any visual asset. Save the output to `assets/`.
- **Noun Project** (`nounproject-mcp`) — search and fetch icons for UI elements (e.g., navigation icons, feature icons, category icons). Save to `assets/`.

Use these when Font Awesome doesn't cover the need or when the wireframe benefits from richer visuals (e.g., onboarding illustrations, product screenshots, custom iconography).

### Naming

| Type | Pattern | Example |
|------|---------|---------|
| Set folder | `{kebab-case-id}/` | `desktop/`, `mobile-ios/`, `admin-panel/` |
| Screen | `{NN}_{kebab-case}.html` | `01_dashboard.html`, `02_workspace-persona.html` |
| Per-set styles | `styles.css` | One per set folder |

Prefix each wireframe with a zero-padded index (`01_`, `02_`, …) to control display order in the app. Use kebab-case after the prefix. Each wireframe is a standalone screen — the app handles navigation between wireframes, so no inter-wireframe links or navigation menus are needed inside the HTML files.

Set folder IDs should be short, descriptive, and kebab-case. The folder name is used as the set label in the viewer (prettified automatically: `admin-panel` becomes "Admin Panel").

### HTML boilerplate

Every wireframe file starts with this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Screen Name} — {Project Name} Wireframes</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <!-- Screen content -->

</body>
</html>
```

> No inline `<style>` blocks. No embedded CSS. Everything goes in `styles.css`. The only exception is one-off `style` attributes for dynamic values (e.g., progress bar widths, theme colors that vary per screen).

### Icons

Use **Font Awesome 6** icons (loaded via CDN in the boilerplate) for UI elements like navigation, status indicators, actions, and empty states:

```html
<i class="fa-solid fa-check"></i>
<i class="fa-regular fa-folder"></i>
<i class="fa-solid fa-arrow-right"></i>
```

Prefer semantic icon choices that match the project's domain. Use `fa-solid` for filled icons and `fa-regular` for outlined variants.

---

## Per-Set Stylesheet

Each wireframe set has its own `styles.css` in its subfolder.

### Structure

Organize `styles.css` in this order:

1. **Reset** — box-sizing, margin/padding reset, link reset (`a { color: inherit; text-decoration: none; }`)
2. **Design tokens** — CSS custom properties sourced from the project's design system (`01_technical_design/design_system/styles.css`)
3. **Base styles** — body, typography defaults
4. **Layout styles** — page grids, panel structures
5. **Component styles** — reusable UI patterns (cards, badges, buttons, etc.)
6. **Screen-specific styles** — styles unique to individual screens, under section comments: `/* ========== SCREEN: {SCREEN NAME} ========== */`

### Token sourcing

Wireframe tokens must come from the project's design system. Copy the `:root` block from `01_technical_design/design_system/styles.css` so tokens stay in sync. Sets targeting different viewports or products may customize tokens (e.g., different breakpoints, spacing scales, or touch target sizes) while keeping the same token names.

### Cross-set consistency

When the same component appears in multiple sets (e.g., a `ProjectCard` in both desktop and mobile), use the same class names. This makes it easy to compare implementations and trace components across the Design System.

---

## Content Approach

### Populate with real data

Use content from the project's earlier steps. If wireframing a persona screen, pull actual goals and frustrations from the research steps. If wireframing a goal statement, reference the problem hypothesis. **Never use lorem ipsum or placeholder text.**

### Visual hierarchy

- **Screen header** — title, status indicator, description
- **Primary content** — the main visualization (cards, grids, tables, timelines)
- **Section headers** — use heading elements, uppercase labels, or visual separators
- **Empty states** — dashed-border pattern with icon, heading, description, and hint text

---

## Do / Don't

| Do | Don't |
|----|-------|
| Link to the set's `styles.css` | Embed `<style>` blocks in wireframe HTML |
| Use CSS custom properties for colors/spacing | Hardcode hex values or pixel spacing |
| Source tokens from the project's design system | Invent new color values outside the design system |
| Populate with realistic content from earlier steps | Use lorem ipsum or generic placeholder text |
| Add new CSS to `styles.css` with section comments | Add inline `style` attributes for things that should be classes |
| Use `style` attributes only for dynamic values | Use `style` for static layout or typography |
| Keep HTML clean and flat — minimal nesting | Over-nest divs or add unnecessary wrapper elements |
| Use same class names for shared components across sets | Invent different class names for the same component in different sets |

---

## Visual QA

Use **Playwright** (via MCP or Bash) to visually verify wireframes after creating or updating them. Open the HTML file in a headless browser, take a screenshot, and inspect the result to catch layout issues, missing styles, or broken assets:

```bash
npx playwright screenshot {set-id}/01_dashboard.html screenshot.png
```

This is especially useful for catching problems that are hard to spot from HTML alone — overlapping elements, incorrect spacing, broken icon references, or missing images.

---

## Workflow Summary

When creating or updating a wireframe:

1. **Read prior step data** for realistic content
2. **Read the project's design system** (`01_technical_design/design_system/`) for tokens and component patterns
3. **Read the set's `styles.css`** to check for reusable classes
4. **Create the HTML file** using the boilerplate
5. **Add new CSS classes** to `styles.css` if needed (using design system tokens)
6. **Visually verify** with Playwright to catch layout or styling issues
