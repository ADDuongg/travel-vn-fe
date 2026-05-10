# Layout system (from actual code)

## Root shell — not `app/layout.tsx`

This project is **Vite + React**. The root is `src/main.tsx`:

1. `StrictMode`
2. **`ThemeProvider`** from `@/design-system` (`defaultTheme="light"`)
3. **`BrowserRouter`**
4. **`App`**

Imports: `@/design-system/theme/tokens.css`, `./index.css`.

There is **no** Next.js `app/layout.tsx`.

## App route shell (`src/components/layout/AppShell.tsx`)

```tsx
<div className="flex min-h-screen flex-col bg-sand-50 text-charcoal">
  <Navbar />
  <main className="flex-1">
    <Outlet />
  </main>
  <Footer />
</div>
```

All routed pages render inside `<Outlet />` (see `src/App.tsx`).

## Layout components available (`src/components/layout/`)

| Component | Role |
|-----------|------|
| `AppShell` | Full-page column: nav + main + footer |
| `Navbar` | Fixed top bar, glass panel, `NavLink`s, `max-w-6xl` inner container |
| `Footer` | Three-column grid on `md`, `max-w-6xl`, border-top |

Props: **`Navbar` and `Footer` take no props** in their current definitions.

## Navbar structure (real classes)

- Outer: `pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4 md:px-10 md:pt-8`
- Inner: `pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-6 rounded-2xl px-5 py-3 shadow-soft glass-panel`
- Brand: `font-display text-xl tracking-[0.04em] text-charcoal md:text-2xl`
- Nav links: `flex items-center gap-6 text-sm font-medium text-charcoal/80` + active `text-forest`, hover `hover:text-sunset-deep`

## Footer structure (real classes)

- `border-t border-charcoal/10 bg-sand-100 px-4 py-16 md:px-10`
- Grid: `mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]`

## Patterns on pages (max-width + padding)

Repeated across `HomePage`, `TourListPage`, etc.:

- Section wrapper: `mx-auto max-w-6xl … px-4 md:px-10` with vertical spacing `py-20 md:py-28` or similar.
- Bordered bands: `border-y border-charcoal/10 bg-sand-100 py-20 md:py-28`.
- Hero bottom padding often: `px-6 pb-14 pt-36 md:px-14 md:pb-20 md:pt-40` (inside `ParallaxHero` children).

## Full-screen hero

`ParallaxHero` default `heightClass = "min-h-[92vh]"` unless overridden.
