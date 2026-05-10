# New page checklist (this project)

## Layout

- [ ] **Do not** create a second root layout — pages render through **`AppShell`** (`Navbar` + `Outlet` + `Footer`).
- [ ] Use the same **content width** pattern as other pages unless there is a strong reason not to: outer sections often use **`mx-auto max-w-6xl`** with **`px-4 md:px-10`** (and section `py-*` as needed).
- [ ] For hero strips, reuse **`ParallaxHero`** + inner flex column with bottom-aligned content (see `HomePage` / `TourListPage`).

## Styling

- [ ] Colors: use **Tailwind classes** mapped to `@theme` tokens in `src/index.css` (`sand-*`, `forest`, `sunset*`, `charcoal`, `mist`, opacity modifiers like `charcoal/10`).
- [ ] Optional: `ThemeProvider` exposes **`--ds-*`** variables; body already falls back to `@theme` colors.
- [ ] Motion: **`framer-motion`** is used on pages (`motion.div`, `ParallaxHero`, `Reveal`); match existing easing arrays where copying patterns (e.g. `[0.22, 1, 0.36, 1]`).
