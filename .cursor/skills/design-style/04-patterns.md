# UI patterns (found in codebase)

Patterns below are **copied from real files** — names are descriptive only.

---

## Pattern: Parallax hero + motion intro

**Found in:** `src/pages/HomePage.tsx`, `src/pages/TourListPage.tsx`

```tsx
<ParallaxHero image={heroImage}>
  <div className="flex flex-1 flex-col justify-end px-6 pb-14 pt-36 md:px-14 md:pb-20 md:pt-40">
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-3xl space-y-6 text-sand-50"
    >
      {/* eyebrow + h1 + paragraph + CTA row */}
    </motion.div>
  </div>
</ParallaxHero>
```

---

## Pattern: Section header + `max-w-6xl` grid

**Found in:** `src/pages/HomePage.tsx` (featured cities block)

```tsx
<section className="mx-auto max-w-6xl space-y-10 px-4 py-20 md:px-10 md:py-28">
  <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div className="space-y-3">
      <p className="text-[11px] uppercase tracking-[0.32em] text-forest">Featured cities</p>
      <h2 className="font-display text-4xl text-charcoal md:text-5xl">...</h2>
    </div>
    <Link to="/cities" className="text-sm font-semibold text-sunset-deep underline-offset-4 hover:underline">
      Open full atlas →
    </Link>
  </Reveal>
  <Stagger className="grid gap-6 md:grid-cols-3">
    {/* RevealItem + cards */}
  </Stagger>
</section>
```

---

## Pattern: Sand band (border + background strip)

**Found in:** `src/pages/HomePage.tsx` (food section wrapper)

```tsx
<section className="border-y border-charcoal/10 bg-sand-100 py-20 md:py-28">
  <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-10">{/* content */}</div>
</section>
```

---

## Pattern: City preview card

**Found in:** `src/components/cards/CityPreviewCard.tsx` (used from `HomePage`)

- `motion.article` + `layout` + `whileHover={{ y: -6 }}`
- Container: `rounded-3xl bg-sand-100 shadow-soft` + `city.moodClass`
- Image gradient overlay and bottom text stack with `font-display` title and pill tags

---

## Pattern: Tour list — filter state + collection toggle

**Found in:** `src/pages/TourListPage.tsx`

- `useState` for `filter` (`TourCategory | "all"`) and `collectionId`
- `useMemo` builds `visible` list from `tours` + filters
- Collection cards use conditional classes: `border-forest/50 ring-2 ring-forest/20` vs `border-charcoal/10 hover:border-forest/30`

---

*More patterns will be added as the project grows.*
