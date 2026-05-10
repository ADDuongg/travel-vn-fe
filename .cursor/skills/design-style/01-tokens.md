# Design tokens (from this repo)

## Tailwind `tailwind.config`

> **`tailwind.config.ts` / `tailwind.config.js` — not defined.** Theme extensions live in `src/index.css` inside `@theme { ... }` (Tailwind v4).

## Colors (`src/index.css` → `@theme`)

| Token (Tailwind class prefix) | CSS variable | Value (as in file) |
|-------------------------------|--------------|---------------------|
| `sand-50` | `--color-sand-50` | `oklch(98% 0.012 85)` |
| `sand-100` | `--color-sand-100` | `oklch(96% 0.025 82)` |
| `sand-200` | `--color-sand-200` | `oklch(92% 0.035 78)` |
| `forest` | `--color-forest` | `oklch(28% 0.045 165)` |
| `forest-soft` | `--color-forest-soft` | `oklch(38% 0.055 165)` |
| `sunset` | `--color-sunset` | `oklch(62% 0.17 45)` |
| `sunset-deep` | `--color-sunset-deep` | `oklch(52% 0.14 38)` |
| `charcoal` | `--color-charcoal` | `oklch(22% 0.015 75)` |
| `mist` | `--color-mist` | `oklch(55% 0.02 75)` |

**Usage in markup:** e.g. `bg-sand-50`, `text-charcoal`, `border-charcoal/10`, `hover:text-sunset-deep`, `text-forest` (active nav).

## Fonts (`@theme`)

| Role | Variable | Value |
|------|----------|--------|
| Display | `--font-display` | `"Cormorant Garamond", "Iowan Old Style", Georgia, serif` |
| Body | `--font-body` | `Inter, system-ui, sans-serif` |

**Classes:** `font-display` (utility in `index.css`); body uses `font-family` from CSS below.

## Shadow (`@theme`)

| Name | Variable | Value |
|------|----------|--------|
| Soft | `--shadow-soft` | `0 24px 80px -32px oklch(22% 0.02 75 / 0.35)` |

**Class:** `shadow-soft`.

## Body + design-system bridge (`src/index.css`)

`body` uses (with fallbacks to `@theme`):

- `font-family: var(--ds-font-body, var(--font-body))`
- `background-color: var(--ds-color-bg, var(--color-sand-50))`
- `color: var(--ds-color-text, var(--color-charcoal))`

`.font-display` uses `var(--ds-font-display, var(--font-display))`.

## Design-system CSS variables (`ThemeProvider`)

Injected on `document.documentElement` from `src/design-system/theme/cssVars.ts` + `theme/theme.config.ts`. Primitive examples (see `src/design-system/tokens.ts` for full maps):

- Spacing: `--ds-space-{0,1,2,…,24}` (rem values, 4px-based scale in source).
- Typography: `--ds-font-size-*`, `--ds-font-weight-*`, `--ds-line-height-*`, `--ds-font-display`, `--ds-font-body`, `--ds-font-mono`.
- Layout tokens: `--ds-max-width-*`, `--ds-sidebar-width-*`.
- Radius, shadow, z-index, breakpoints, motion: `--ds-radius-*`, `--ds-shadow-*`, `--ds-z-*`, `--ds-bp-*`, `--ds-duration-*`, `--ds-ease-*`.
- Semantic colors: `--ds-color-bg`, `--ds-color-text`, `--ds-color-primary`, `--ds-color-secondary`, … (full semantic set in `theme.config.ts` for `light` / `dark`).

## Other globals in `index.css`

- **`.glass-panel`:** translucent panel + blur + border (used by `Navbar`).  
- **`.city-hanoi` … `.city-dalat`:** set `--city-accent` and `--city-glow` per city mood (used with card classes from data).

## Spacing / breakpoints (Tailwind)

No custom spacing or `screens` block appears in `src/index.css` `@theme`. Pages use **Tailwind spacing utilities** as-is (e.g. `gap-6`, `px-4`, `py-20`, `max-w-6xl`, `md:px-10`). Default section width pattern: **`max-w-6xl`** + horizontal padding **`px-4 md:px-10`** (seen across multiple pages).

## Border radius

No dedicated radius scale in `@theme`. Radius comes from **Tailwind utilities** (`rounded-2xl`, `rounded-3xl`, `rounded-full`) and **arbitrary values** (e.g. `rounded-[1.75rem]`, `rounded-[2rem]`).

## Typography scale in pages

Headings often use `font-display` with sizes like `text-4xl`, `text-[clamp(...)]`, or arbitrary `text-[11px]` for uppercase labels — **not** a single shared typography component in `src/components/` (design-system typography lives under `src/design-system/typography/` if adopted).
