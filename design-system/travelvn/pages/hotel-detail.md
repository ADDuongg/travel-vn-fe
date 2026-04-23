# Hotel Detail Page Overrides

> **PROJECT:** TravelVN
> **Page type:** Product detail (hotel)
> **Implements:** [`src/pages/hotel/HotelDetail.tsx`](../../../src/pages/hotel/HotelDetail.tsx) and sections in [`src/sections/hotel/hotel-detail/`](../../../src/sections/hotel/hotel-detail/)

> Complement [`../MASTER.md`](../MASTER.md). **Source of truth for tokens:** [`src/index.css`](../../../src/index.css), [`DESIGN.md`](../../../DESIGN.md) (hotel card, search, surface).

## Structure

1. **Gallery** (bento) first — `HotelHeader` — tap opens `Dialog` photo grid; share + favorite in title row.
2. **In-page nav** — `HotelDetailNav` — anchors: `#overview`, `#rooms`, `#reviews`, `#location` (if coordinates exist).
3. **Overview** — `HotelInfo` — about HTML, amenity list (resolve labels via `useAmenitiesQuery`), optional policies, desktop/tablet **contact** card (`lg:sticky`). Mobile: contact via `HotelFloatingContactBar`.
4. **Rooms** — `HotelRooms` — `useRoomsQuery` grid.
5. **Reviews** — `EntityReviewSection` with warm surface.
6. **Map** — `HotelMapSection` — embed + copy address + Google Maps link (requires `location.lat` / `lng`).

## Components

- **Mobile bar:** `md:hidden` fixed bottom; call / email (if present) + share + favorite; `pb-20` on main content container for safe clearance.

## Data (`Hotel` type)

- `ratingSummary`, `starRating`, `gallery`, `thumbnail`, `amenities[]`, `contact`, `location`, translations (name, description, address, optional `policies`).

## Motion

- Prefer `duration-200`–`300ms` transitions; `prefers-reduced-motion` respected via existing globals.

## Anti-patterns

- No emoji as UI icons; use Lucide / SVG.
- No layout-shift hovers (avoid large scale on layout-holding elements).
