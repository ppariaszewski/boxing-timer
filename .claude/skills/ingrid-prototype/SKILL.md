---
name: ingrid-prototype
description: Generate HTML/CSS prototypes using Ingrid design system components from https://design-system.ingrid.com/. Use when the user wants to build a UI prototype, mockup, or page layout using Ingrid's component library.
---

# Ingrid Design System Prototype Generator

Generate working HTML prototypes using the Ingrid design system (https://design-system.ingrid.com/).

## Workflow

Make a todo list for all tasks and work on them one by one.

### 1. Understand the Request

Parse the user's input to identify:
- **What to build**: page type, layout, or specific UI flow (e.g. "checkout screen", "delivery options page", "order confirmation")
- **Which components are needed**: buttons, forms, cards, modals, badges, etc.
- **Any specific states or variants**: loading, error, success, disabled

If the request is vague, ask one focused clarifying question before proceeding.

### 2. Fetch the Design System

Use the WebFetch tool to retrieve component documentation from the Ingrid design system.

Start with the overview page:
- `https://design-system.ingrid.com/`

Then fetch specific component pages relevant to the prototype. Common component paths to try:
- `https://design-system.ingrid.com/components/button`
- `https://design-system.ingrid.com/components/input`
- `https://design-system.ingrid.com/components/card`
- `https://design-system.ingrid.com/components/badge`
- `https://design-system.ingrid.com/components/typography`
- `https://design-system.ingrid.com/components/colors`
- `https://design-system.ingrid.com/components/spacing`
- `https://design-system.ingrid.com/components/icons`
- `https://design-system.ingrid.com/components/modal`
- `https://design-system.ingrid.com/components/form`
- `https://design-system.ingrid.com/components/table`
- `https://design-system.ingrid.com/components/list`
- `https://design-system.ingrid.com/components/alert`
- `https://design-system.ingrid.com/components/stepper`
- `https://design-system.ingrid.com/components/tabs`

For each fetched page, extract:
- Component HTML structure / markup patterns
- CSS class names used
- Color tokens and CSS variables
- Typography scale
- Spacing system
- Any CDN links for fonts, icons, or the design system CSS itself

If pages return 403 or fail, note what was unavailable and proceed with what was retrieved.

### 3. Build the Design System Reference

From the fetched pages, compile:

**Color tokens** (extract exact values from docs):
```
Primary, Secondary, Neutral, Success, Warning, Error palettes
Background and surface colors
Text colors
Border colors
```

**Typography**:
```
Font family, sizes, weights, line heights
Heading and body text classes
```

**Spacing scale**:
```
Base unit and scale (4px, 8px, 16px, etc.)
Padding/margin tokens
```

**Component class names** (use exactly as documented):
```
Button variants, sizes, states
Input fields, labels, validation
Card/panel containers
Badge/tag variants
Navigation elements
```

If the design system provides a CSS CDN link, use it in the prototype. If not, recreate the visual style faithfully using CSS variables based on the extracted tokens.

### 4. Generate the Prototype

Create an `index.html` file in the current working directory (or a filename the user specified) with:

**Structure requirements:**
- Valid HTML5 with proper `<meta>` viewport tag
- Link to Ingrid design system CSS if a CDN URL was found, otherwise embed extracted styles in `<style>` using CSS custom properties matching the token names from the docs
- Responsive layout (mobile-first if it's a delivery/checkout context)
- All relevant components from the request, using exact class names from the design system docs

**Quality requirements:**
- Use semantic HTML (`<nav>`, `<main>`, `<section>`, `<form>`, `<button>`, etc.)
- Include realistic placeholder content that fits the delivery/logistics context (Ingrid is a delivery experience platform)
- Show all relevant states visible at once (e.g. if showing a button, show primary + secondary + disabled variants)
- Do NOT use lorem ipsum — use realistic delivery/e-commerce copy

**If design system CSS is not available:**
- Recreate Ingrid's visual identity from what was extracted: clean, modern, minimal, Scandinavian-influenced
- Use the exact color values and font names found in the docs
- Match the spacing and component shapes as closely as possible from the documentation screenshots or code examples

### 5. Validate the Prototype

After writing the file:
- Read it back and verify it is valid, complete HTML
- Check all referenced CSS classes match what was extracted from the design system
- Confirm the file can be opened directly in a browser (no build step required)

### 6. Summarize

Report to the user:
- **File created**: path and filename
- **Components used**: list the Ingrid components included and their source (from docs vs. reconstructed)
- **Design system coverage**: what was successfully fetched vs. what had to be approximated
- **How to open**: `open index.html` or serve with `npx serve .`
- **Next steps**: suggest additional components or pages they could add

## Ingrid Context

Ingrid (ingrid.com) is a delivery experience platform used by e-commerce retailers. Their design system components are likely oriented around:
- Delivery options selection (carrier, speed, pickup point)
- Checkout flows
- Order tracking and status
- Address input and validation
- Shipping method cards
- Time slot pickers
- Confirmation screens

Use this context when writing placeholder content and choosing which component states to demonstrate.

## Example Invocations

- `/ingrid-prototype a delivery options selector with three shipping methods`
- `/ingrid-prototype a checkout address form with validation states`
- `/ingrid-prototype an order confirmation page`
- `/ingrid-prototype a pickup point map view with a list of nearby locations`
