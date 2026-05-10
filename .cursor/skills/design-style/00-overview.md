# Guideline docs — overview

## Purpose

These files describe **what already exists** in the Vietnam Discovery codebase (tokens, layout shell, components, page conventions, recurring UI patterns). They are meant to be read **before** adding or refactoring pages so new work stays consistent with current patterns.

## Reading order

1. `01-tokens.md` — colors, CSS variables, typography sources  
2. `02-layout.md` — root shell (`main.tsx`), `AppShell`, spacing/max-width patterns  
4. `04-new-page-checklist.md` — file locations, routing, styling conventions  
5. `05-patterns.md` — repeated compositions copied from real pages  

## Project context (one line)

**Stack:** Vite 7, React 18, TypeScript, React Router 7, Tailwind CSS 4 (`@import "tailwindcss"` + `@theme` in `src/index.css`), Framer Motion; **`tailwind.config.ts` is not present** — theme tokens live in `src/index.css` and in `src/design-system/` (`ThemeProvider`, `--ds-*` variables).
