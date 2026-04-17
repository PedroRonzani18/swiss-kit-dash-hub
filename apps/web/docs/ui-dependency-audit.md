# UI Dependency Audit

Date: 2026-04-17

## Snapshot

This audit checks UI-focused dependencies from `apps/web/package.json` against direct imports in `apps/web/src`.

## Findings

All UI dependencies are imported at least once. There is no immediate "safe delete" without verifying if the related component files are still part of the runtime routes.

| Dependency | Direct Import Hits |
| --- | ---: |
| `@radix-ui/react-accordion` | 1 |
| `@radix-ui/react-alert-dialog` | 1 |
| `@radix-ui/react-aspect-ratio` | 1 |
| `@radix-ui/react-avatar` | 1 |
| `@radix-ui/react-checkbox` | 1 |
| `@radix-ui/react-collapsible` | 1 |
| `@radix-ui/react-context-menu` | 1 |
| `@radix-ui/react-dialog` | 3 |
| `@radix-ui/react-dropdown-menu` | 1 |
| `@radix-ui/react-hover-card` | 1 |
| `@radix-ui/react-label` | 2 |
| `@radix-ui/react-menubar` | 1 |
| `@radix-ui/react-navigation-menu` | 1 |
| `@radix-ui/react-popover` | 1 |
| `@radix-ui/react-progress` | 1 |
| `@radix-ui/react-radio-group` | 1 |
| `@radix-ui/react-scroll-area` | 1 |
| `@radix-ui/react-select` | 1 |
| `@radix-ui/react-separator` | 1 |
| `@radix-ui/react-slider` | 1 |
| `@radix-ui/react-slot` | 4 |
| `@radix-ui/react-switch` | 1 |
| `@radix-ui/react-tabs` | 1 |
| `@radix-ui/react-toast` | 1 |
| `@radix-ui/react-toggle` | 1 |
| `@radix-ui/react-toggle-group` | 1 |
| `@radix-ui/react-tooltip` | 1 |
| `cmdk` | 1 |
| `embla-carousel-react` | 1 |
| `input-otp` | 1 |
| `next-themes` | 1 |
| `react-resizable-panels` | 1 |
| `recharts` | 2 |
| `sonner` | 7 |
| `vaul` | 1 |

## Recommended cleanup strategy

1. Route-aware pruning: map each UI component to active routes and remove components with no route usage.
2. Keep one toast system (`sonner` or Radix toast wrapper) after route-aware validation.
3. Replace low-usage one-off components with existing primitives where possible.
4. Add a CI check to detect new UI dependencies without corresponding route usage.
