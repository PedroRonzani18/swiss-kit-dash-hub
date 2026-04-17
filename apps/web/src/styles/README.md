# CSS Architecture (Tailwind v4)

This folder separates global styling concerns to keep maintenance predictable:

- `tailwind.css`: Tailwind entrypoint, plugins, custom variants, font import
- `theme.css`: semantic Tailwind tokens (`@theme`) consumed by utilities/classes
- `tokens.css`: CSS variables for light/dark themes (`:root` / `.dark`)
- `base.css`: global base rules and browser-level defaults
- `utilities.css`: shared custom utilities (`@utility`) used across the app shell

## Rules

1. Keep route/page-specific styling in components (`className`) instead of global files.
2. Add new colors/shadows/radii in `theme.css` + `tokens.css`, not as literal values in JSX.
3. Add a global utility only if reused by at least 3 separate features/components.
4. Prefer component variants (`cva`) for UI behavior instead of adding one-off global classes.
