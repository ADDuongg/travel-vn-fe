# Editorial list pages — rollout checklist

Shared pieces introduced with the provinces atlas refresh:

- **`ParallaxHero`** ([`src/components/home-editorial/ParallaxHero.tsx`](../src/components/home-editorial/ParallaxHero.tsx)) — full-bleed editorial hero.
- **`AtlasPagination`** ([`src/shared/pagination/AtlasPagination.tsx`](../src/shared/pagination/AtlasPagination.tsx)) — folio-style pagination (captions + padded page numbers + forest active state).
- **Sticky atlas toolbar pattern** — search (`rounded-full`), chip filters, sort pills, optional reset (see [`ProvinceListAtlasToolbar`](../src/sections/province/components/ProvinceListAtlasToolbar.tsx)).

## Per-entity checklist

Apply in suggested order: **Tour → Hotel → Tour guide → Blog → Room**.

For each list page:

1. **API mapping** — List `query` fields (search, filters, sort) and confirm they match existing hooks (`useToursQuery`, `useHotelsQuery`, etc.). Do not change backend contracts from the UI layer.
2. **URL sync** — Provinces and blog already sync filters to `URLSearchParams`. Align other lists if shareable links matter for that route.
3. **Layout** — Replace `PageHero` + disconnected filter bar with `ParallaxHero` + one sticky toolbar where it fits the IA; keep loading / empty / error states.
4. **Pagination** — Swap `ServerPagination` for `AtlasPagination` when editorial styling is desired; pass `labels` via `t(...)`.
5. **i18n** — Add keys under the entity namespace for toolbar, pagination (`atlas_showing`, `atlas_folio_prefix`, `prev_spread`, `next_spread`, `spread_nav`), and hero copy.

## Notes

- Prefer **immutable** query updates and existing TanStack Query keys.
- Respect **`prefers-reduced-motion`** for any new motion on these pages.
