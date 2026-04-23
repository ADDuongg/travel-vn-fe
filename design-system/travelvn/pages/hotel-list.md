# Hotel List Page Overrides

> **PROJECT:** TravelVN
> **Page type:** List / discovery (stays)
> **Implements:** [`src/pages/list/HotelListPage.tsx`](../../../src/pages/list/HotelListPage.tsx), [`HotelListHeroSearch`](../../../src/sections/hotel/components/HotelListHeroSearch.tsx), [`HotelFilter`](../../../src/sections/hotel/components/HotelFilter.tsx)

> Rules here **complement** [`../MASTER.md`](../MASTER.md). The live app uses the Vietnam palette in [`src/index.css`](../../../src/index.css) (e.g. primary `#C8102E`).

## Layout

- **Shell:** `MainLayout` (no `ListLayout`); matches [`Tour`](../../../src/pages/tour/Tour.tsx) pattern.
- **Hero:** `PageHero` + glass hero search (province + keyword).
- **Filters:** Sticky bar below hero (`top-[136px]`) with province, star presets (0 / 3+ / 4+ / 5+), sort.
- **Grid:** 3 columns desktop; `DisplayContainer` grid / list toggle.
- **Pagination:** Client-side (API list has no `pagination` in hooks).

## Color & type

- Headings: Playfair (`--font-dm-serif-display`).
- Stars / accents: Hội An Gold `#C9922A`; location / nature cues: Sapa Green `#2D6A4F`.
- Page background: `#F8F8F6` for results.

## Notes

- List items follow `HotelOption` (+ optional `starRating` / `thumbnail` from API). Filtering by stars excludes hotels without a rating when a minimum is selected.

## Anti-patterns

- Do not reintroduce double layout heroes (`ListLayout` + `PageHero`).
