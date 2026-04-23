# Vietnam Travel Platform — Design System

### Inspired by Cursor Design Language · Adapted for Modern Vietnam Travel

---

## 1. Visual Theme & Atmosphere

This design system channels the soul of Vietnam through a premium, modern lens. The visual language draws from three iconic Vietnamese environments: the **crimson energy of Hanoi's Old Quarter lanterns**, the **lush emerald of Sapa's rice terraces**, and the **warm gold of Hội An's ancient lantern light**. These are not tourist clichés — they are distilled into a refined, minimal palette that feels both deeply Vietnamese and internationally premium.

The foundation is a warm ivory canvas (`#F8F8F6`) — the color of handmade rice paper, aged silk, and fresh bánh mì bread. Against this, text is rendered in a deep warm near-black (`#1C1A14`) with a subtle brown undertone, echoing traditional Vietnamese ink and lacquerware. The two accent voices are:

- **Vietnam Red** (`#C8102E`): The red of the national flag, lanterns, and lacquerware — bold, warm, and proud. Used for primary CTAs and brand moments.
- **Sapa Green** (`#2D6A4F`): The deep green of rice terraces and bamboo forests — natural, premium, and grounding. Used for success states, highlights, and secondary accents.
- **Hội An Gold** (`#C9922A`): The gold of ancient lanterns and temple gilding — luxury, warmth, and heritage. Used as a tertiary accent for premium moments.

Typography uses a three-voice system: a compressed gothic sans for display impact, a refined serif for editorial warmth, and a clean system UI for functional clarity — replacing code-specific mono since this is a travel platform, not a dev tool.

**Key Characteristics:**

- Warm ivory background (`#F8F8F6`) — paper, silk, rice — not clinical white
- Primary text `#1C1A14` (warm near-black, ink-like)
- Vietnam Red `#C8102E` as primary accent — flag, lanterns, energy
- Sapa Green `#2D6A4F` as secondary accent — nature, calm, premium
- Hội An Gold `#C9922A` as tertiary accent — heritage, luxury
- Aggressive negative letter-spacing on display headings for compressed premium feel
- Pill-shaped tags for destinations, categories, and filters
- oklab-space borders for perceptually warm edge treatment
- 8px base spacing with fine-grained sub-8px increments

---

## 2. Color Palette & Roles

### Primary Colors

| Name                  | Hex       | Role                                                                                                |
| --------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| **Vietnam Dark**      | `#1C1A14` | Primary text, headings, dark UI surfaces. Warm near-black with brown undertone — ink on rice paper. |
| **Vietnam Ivory**     | `#F8F8F6` | Page background. The warmth of handmade paper — not white, never cold.                              |
| **Vietnam Cream**     | `#EDE7D9` | Secondary surface, card fills, button backgrounds.                                                  |
| **Vietnam Parchment** | `#E5DED0` | Tertiary surface, input backgrounds, subtle fills.                                                  |
| **Pure White**        | `#FFFFFF` | Used sparingly for maximum contrast, photo overlays.                                                |

### Accent Colors

| Name            | Hex       | Role                                                                                                |
| --------------- | --------- | --------------------------------------------------------------------------------------------------- |
| **Vietnam Red** | `#C8102E` | Primary brand accent. Flag red — CTAs, active links, hero highlights, hover states. Warm and proud. |
| **Red Deep**    | `#A50D25` | Pressed/active state of Vietnam Red. Darker, richer.                                                |
| **Red Soft**    | `#F2D5D9` | Red tint for backgrounds, badges, alert fills.                                                      |
| **Sapa Green**  | `#2D6A4F` | Secondary accent. Rice terrace green — nature, success, calm premium.                               |
| **Green Deep**  | `#1E4D38` | Pressed/active state of Sapa Green. Forest depth.                                                   |
| **Green Soft**  | `#D4EAE0` | Green tint for backgrounds, success fills, highlights.                                              |
| **Hội An Gold** | `#C9922A` | Tertiary accent. Lantern gold — premium, heritage, featured.                                        |
| **Gold Soft**   | `#F5E9D0` | Gold tint for premium card backgrounds, featured states.                                            |

### Semantic Colors

| Name        | Hex       | Role                                                    |
| ----------- | --------- | ------------------------------------------------------- |
| **Error**   | `#C8102E` | Same as Vietnam Red — errors feel urgent, not clinical. |
| **Success** | `#2D6A4F` | Same as Sapa Green — success feels natural, grounded.   |
| **Warning** | `#C9922A` | Same as Hội An Gold — warnings feel considered, warm.   |
| **Info**    | `#2A6B9C` | Halong Bay blue — calm, informational.                  |

### Surface Scale

| Level           | Hex       | Use                                                 |
| --------------- | --------- | --------------------------------------------------- |
| **Surface 100** | `#FAF7F2` | Lightest surface, barely tinted — hover backgrounds |
| **Surface 200** | `#F8F8F6` | Primary page background                             |
| **Surface 300** | `#EDE7D9` | Button default background, card fills               |
| **Surface 400** | `#E5DED0` | Secondary card backgrounds, input fills             |
| **Surface 500** | `#DDD6C7` | Tertiary surfaces, deep emphasis                    |

### Border Colors

| Name               | Value                     | Use                                 |
| ------------------ | ------------------------- | ----------------------------------- |
| **Border Primary** | `rgba(28, 26, 20, 0.10)`  | Standard border — warm brown at 10% |
| **Border Medium**  | `rgba(28, 26, 20, 0.20)`  | Emphasized border, card edges       |
| **Border Strong**  | `rgba(28, 26, 20, 0.50)`  | Table rules, dividers               |
| **Border Solid**   | `#1C1A14`                 | Maximum contrast borders            |
| **Border Red**     | `rgba(200, 16, 46, 0.25)` | Active/selected state borders       |
| **Border Green**   | `rgba(45, 106, 79, 0.25)` | Success/highlighted state borders   |

### Shadows & Depth

| Name               | Value                                                                                                 | Use                                |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Card Shadow**    | `rgba(0,0,0,0.12) 0px 24px 60px, rgba(0,0,0,0.08) 0px 12px 28px, rgba(28,26,20,0.10) 0px 0px 0px 1px` | Elevated cards, modals             |
| **Ambient Shadow** | `rgba(0,0,0,0.03) 0px 0px 16px, rgba(0,0,0,0.01) 0px 0px 8px`                                         | Subtle floating elements           |
| **Red Glow**       | `rgba(200, 16, 46, 0.15) 0px 8px 32px`                                                                | CTA button hover, red accent depth |
| **Green Glow**     | `rgba(45, 106, 79, 0.15) 0px 8px 32px`                                                                | Success states, green card hover   |

---

## 3. Typography Rules

### Font Family

This platform uses a **three-voice system** suited for travel content:

- **Display / Headlines**: `'Playfair Display'` — an elegant serif with strong character, evoking both editorial luxury and Vietnamese calligraphic tradition. Fallbacks: `'Georgia', 'Times New Roman', ui-serif`
- **Body / UI**: `'Inter'` — a clean, modern sans-serif for maximum readability across all UI elements, cards, navigation, and body copy. Fallbacks: `system-ui, -apple-system, 'Segoe UI', Arial`
- **Labels / Captions**: `'Inter'` with tight tracking and uppercase transform — functional, precise, minimal

> **Why Playfair Display?** Its high contrast strokes echo Vietnamese brush calligraphy and traditional woodblock printing. At display sizes it commands attention; at smaller sizes it provides warmth. It pairs beautifully with Inter's clean rationality.

### Type Hierarchy

| Role            | Font             | Size           | Weight | Line Height | Letter Spacing | Notes                                         |
| --------------- | ---------------- | -------------- | ------ | ----------- | -------------- | --------------------------------------------- |
| Display Hero    | Playfair Display | 72px (4.50rem) | 700    | 1.10        | -1.5px         | Hero headlines, city names at full bleed      |
| Section Heading | Playfair Display | 42px (2.63rem) | 700    | 1.15        | -0.8px         | Section titles, feature headings              |
| Sub-heading     | Playfair Display | 28px (1.75rem) | 600    | 1.25        | -0.3px         | Card headings, destination titles             |
| Title Small     | Playfair Display | 22px (1.38rem) | 600    | 1.30        | -0.1px         | Smaller titles, hotel/food names              |
| Body Large      | Inter            | 18px (1.13rem) | 400    | 1.60        | normal         | Editorial descriptions, intro paragraphs      |
| Body Standard   | Inter            | 16px (1.00rem) | 400    | 1.55        | normal         | Standard UI copy, card descriptions           |
| Body Small      | Inter            | 14px (0.88rem) | 400    | 1.50        | normal         | Secondary descriptions, metadata              |
| Button Label    | Inter            | 15px (0.94rem) | 500    | 1.00        | 0.1px          | Primary button text                           |
| Caption         | Inter            | 12px (0.75rem) | 500    | 1.40        | 0.5px          | Labels, micro-copy, breadcrumbs               |
| Tag / Badge     | Inter            | 11px (0.69rem) | 600    | 1.00        | 0.8px          | Uppercase pill tags for city/category filters |
| Price           | Playfair Display | 24px (1.50rem) | 700    | 1.00        | -0.2px         | Hotel rates, tour prices — commanding         |
| Navigation      | Inter            | 14px (0.88rem) | 500    | 1.00        | normal         | Nav links                                     |

### Principles

- **Playfair for soul, Inter for clarity**: Playfair Display headings evoke Vietnam's rich cultural and natural beauty; Inter handles all functional UI with clean precision.
- **Size-proportional tracking**: Display headings compress at large sizes (`-1.5px at 72px`), relax as size decreases (`normal at 16px and below`).
- **Weight restraint on body**: Inter uses 400 for body, 500 for emphasis, 600 for strong UI labels. Reserve 700+ for Playfair Display headings only.
- **All caps for micro-labels**: Category tags (ẨM THỰC, KHÁCH SẠN, KHÁM PHÁ), breadcrumbs, and filter chips use Inter at 11px / 600 / uppercase / 0.8px tracking.

---

## 4. Component Stylings

### Buttons

**Primary — Vietnam Red**

- Background: `#C8102E`
- Text: `#FFFFFF`
- Padding: `12px 24px`
- Radius: `8px`
- Font: Inter 15px / 500 / 0.1px tracking
- Hover: background `#A50D25`, box-shadow `rgba(200,16,46,0.25) 0px 8px 24px`
- Active: background `#8A0B1F`, scale `0.98`
- Use: Primary CTAs — "Đặt ngay", "Khám phá", "Tìm kiếm"

**Primary — Sapa Green**

- Background: `#2D6A4F`
- Text: `#FFFFFF`
- Padding: `12px 24px`
- Radius: `8px`
- Hover: background `#1E4D38`, box-shadow `rgba(45,106,79,0.25) 0px 8px 24px`
- Use: Booking confirmations, success actions, "Xác nhận đặt phòng"

**Secondary — Outlined**

- Background: `transparent`
- Border: `1.5px solid rgba(28,26,20,0.25)`
- Text: `#1C1A14`
- Padding: `11px 23px`
- Radius: `8px`
- Hover: background `#EDE7D9`, border-color `rgba(28,26,20,0.40)`
- Use: Secondary actions — "Xem thêm", "Bộ lọc"

**Ghost — Transparent**

- Background: `rgba(28, 26, 20, 0.06)`
- Text: `rgba(28, 26, 20, 0.60)`
- Padding: `8px 16px`
- Radius: `8px`
- Hover: background `rgba(28,26,20,0.10)`
- Use: Tertiary actions, dismiss, back navigation

**Pill Tag — Default**

- Background: `#EDE7D9`
- Text: `rgba(28, 26, 20, 0.70)`
- Padding: `4px 12px`
- Radius: `9999px` (full pill)
- Font: Inter 11px / 600 / uppercase / 0.8px tracking
- Hover: background `#E5DED0`, text `#1C1A14`
- Use: City filters, category tags (HÀ NỘI, HỘI AN, ẨM THỰC)

**Pill Tag — Active Red**

- Background: `#C8102E`
- Text: `#FFFFFF`
- Use: Active/selected filter state

**Pill Tag — Active Green**

- Background: `#2D6A4F`
- Text: `#FFFFFF`
- Use: Selected nature/outdoor category

### Cards & Containers

**Destination Card**

- Background: `#FFFFFF`
- Border: `1px solid rgba(28, 26, 20, 0.10)`
- Radius: `12px`
- Shadow: `rgba(0,0,0,0.08) 0px 4px 24px, rgba(28,26,20,0.06) 0px 0px 0px 1px`
- Hover shadow: `rgba(0,0,0,0.14) 0px 16px 48px, rgba(28,26,20,0.10) 0px 0px 0px 1px`
- Image radius: `12px 12px 0 0`
- Padding: `16px`
- Use: City/destination browse cards

**Hotel Card**

- Same as Destination Card
- Star rating: Hội An Gold `#C9922A`
- Price: Playfair Display 24px / 700, color `#C8102E`
- Availability badge: Sapa Green background `#D4EAE0`, text `#1E4D38`

**Food / Experience Card**

- Background: `#FAF7F2` (Surface 100)
- Border: `1px solid rgba(28,26,20,0.08)`
- Radius: `12px`
- Category tag overlay on image: semi-transparent red pill

**Featured Card (Premium)**

- Background: `#F5E9D0` (Gold Soft)
- Border: `1px solid rgba(201, 146, 42, 0.30)`
- Radius: `16px`
- Shadow: `rgba(201,146,42,0.15) 0px 12px 40px`
- Use: Featured destinations, promoted tours, top-rated hotels

**Info Panel / Section Container**

- Background: `#EDE7D9` (Surface 300)
- Border: `1px solid rgba(28, 26, 20, 0.10)`
- Radius: `12px`
- Padding: `24px`

### Inputs & Search

**Search Bar (Hero)**

- Background: `#FFFFFF`
- Border: `1.5px solid rgba(28, 26, 20, 0.15)`
- Radius: `12px`
- Padding: `16px 20px`
- Font: Inter 16px / 400
- Placeholder: `rgba(28, 26, 20, 0.40)`
- Focus border: `1.5px solid #C8102E`
- Focus shadow: `rgba(200, 16, 46, 0.12) 0px 0px 0px 4px`
- Search button: Vietnam Red, attached right side, radius `0 10px 10px 0`

**Standard Input**

- Background: `#F8F8F6`
- Border: `1px solid rgba(28, 26, 20, 0.15)`
- Radius: `8px`
- Padding: `10px 14px`
- Focus border: `#C8102E`

**Dropdown / Select**

- Same as Standard Input
- Chevron icon: `rgba(28, 26, 20, 0.50)`
- Open state: border `#C8102E`, shadow `rgba(200,16,46,0.08) 0px 4px 12px`

### Navigation

- Background: `#F8F8F6` with `backdrop-filter: blur(12px)` when sticky
- Logo: Playfair Display or custom wordmark, `#1C1A14` + `#C8102E` accent
- Nav links: Inter 14px / 500, `rgba(28, 26, 20, 0.70)`, hover `#C8102E`
- Active link: `#C8102E` with `border-bottom: 2px solid #C8102E`
- Bottom border: `1px solid rgba(28, 26, 20, 0.10)`
- CTA button: Vietnam Red primary button, right-aligned
- Mobile: hamburger → slide-in drawer on ivory background

### Image Treatment

- Destination hero images: full-width, slight warm overlay `rgba(28, 26, 20, 0.15)` for text legibility
- Card images: `border-radius: 12px 12px 0 0`, `object-fit: cover`
- Aspect ratios: 16:9 for destination cards, 3:2 for food cards, 1:1 for city thumbnails
- Overlay gradient on cards: `linear-gradient(to top, rgba(28,26,20,0.6) 0%, transparent 50%)` for text over image

### Vietnam-Specific Components

**City Explorer Strip**

- Horizontal scrollable row of circular city thumbnails (80px diameter)
- Label: Inter 12px / 500, `#1C1A14`, centered below
- Active city: red ring border `2px solid #C8102E`
- Cities: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng, Hội An, Sapa, Nha Trang, Phú Quốc, Huế

**Travel Season Badge**

- Pill shaped, Hội An Gold background `#F5E9D0`, text `#C9922A`
- Label: "MÙA KHÔ", "MÙA MƯA", "THÍCH HỢP NHẤT"
- Font: Inter 10px / 700 / uppercase / 1px tracking

**Price Display**

- Main price: Playfair Display 24px / 700 / `#C8102E`
- Per-night label: Inter 12px / 400 / `rgba(28,26,20,0.55)`, `/đêm`
- Original price (strikethrough): Inter 14px / 400 / `rgba(28,26,20,0.40)`, `text-decoration: line-through`
- Discount badge: Vietnam Red pill, white text, e.g. `-20%`

**Star Rating**

- Filled stars: `#C9922A` (Hội An Gold)
- Empty stars: `rgba(201, 146, 42, 0.25)`
- Review count: Inter 12px / `rgba(28,26,20,0.55)`

**Map Pin / Marker**

- Fill: `#C8102E`
- Inner dot: `#FFFFFF`
- Hover: scale `1.2`, drop-shadow `rgba(200,16,46,0.30) 0px 4px 12px`

---

## 5. Layout Principles

### Spacing System

- **Base unit**: 8px
- **Fine scale** (micro-alignment): `2px, 4px, 6px`
- **Standard scale**: `8px, 12px, 16px, 20px, 24px`
- **Extended scale**: `32px, 40px, 48px, 64px, 80px, 96px, 128px`
- **Section padding**: `80px` vertical on desktop, `48px` on tablet, `32px` on mobile

### Grid & Container

- **Max content width**: `1280px`
- **Page horizontal padding**: `48px` desktop, `24px` tablet, `16px` mobile
- **Column grids**:
  - Destination cards: 4-column desktop, 2-column tablet, 1-column mobile
  - Hotel cards: 3-column desktop, 2-column tablet, 1-column mobile
  - Food/Experience: 3-column desktop, 2-column tablet, 1-column mobile
  - Hero: single column, full-width background image
- **Gap**: `24px` standard card gap, `16px` compact, `32px` featured

### Whitespace Philosophy

- **Warm negative space**: The ivory background gives whitespace texture and warmth — emptiness feels intentional, like a minimalist Vietnamese art space.
- **Content breathing room**: Generous padding within cards (`16-24px`) gives destinations and hotels room to be appreciated, not crammed.
- **Section rhythm**: Alternate between `#F8F8F6` (ivory) and `#EDE7D9` (cream) section backgrounds for gentle visual sectioning without hard lines.

### Border Radius Scale

| Name        | Value    | Use                                 |
| ----------- | -------- | ----------------------------------- |
| Micro       | `2px`    | Fine detail, inline badges          |
| Small       | `4px`    | Compact elements                    |
| Standard    | `8px`    | Buttons, inputs, small cards        |
| Comfortable | `12px`   | Standard cards, containers          |
| Large       | `16px`   | Featured cards, modal dialogs       |
| Full Pill   | `9999px` | City tags, category filters, badges |

---

## 6. Depth & Elevation

| Level              | Treatment                                                             | Use                              |
| ------------------ | --------------------------------------------------------------------- | -------------------------------- |
| Flat (0)           | No shadow                                                             | Page background, text blocks     |
| Border Ring (1)    | `rgba(28,26,20,0.10) 0px 0px 0px 1px`                                 | Standard card border             |
| Border Medium (1b) | `rgba(28,26,20,0.20) 0px 0px 0px 1px`                                 | Active/hovered card border       |
| Ambient (2)        | `rgba(0,0,0,0.04) 0px 2px 12px`                                       | Subtle card lift                 |
| Card (3)           | `rgba(0,0,0,0.10) 0px 8px 32px, rgba(28,26,20,0.06) 0px 0px 0px 1px`  | Standard card elevation          |
| Elevated (4)       | `rgba(0,0,0,0.14) 0px 24px 60px, rgba(28,26,20,0.10) 0px 0px 0px 1px` | Modals, popovers, dropdown menus |
| Red Glow           | `rgba(200,16,46,0.20) 0px 8px 32px`                                   | Active CTA hover glow            |
| Gold Glow          | `rgba(201,146,42,0.20) 0px 8px 32px`                                  | Featured/premium card hover      |

---

## 7. Interaction & Motion

### Hover States

- **Red CTA buttons**: background darkens to `#A50D25`, red glow shadow appears
- **Cards**: shadow lifts from Level 3 → Level 4, border brightens to 20% warm brown
- **Nav links**: color transitions to `#C8102E` (200ms ease)
- **City thumbnails**: scale `1.05` with red ring border appearing
- **Map markers**: scale `1.20` with red drop-shadow

### Focus States

- **Inputs**: border shifts to `#C8102E`, soft red focus ring `rgba(200,16,46,0.12) 0px 0px 0px 4px`
- **Buttons**: outline `2px solid rgba(200,16,46,0.40)` offset `2px`
- **No cold blue focus rings** — every focus state is warm red or warm brown

### Transitions

| Property           | Duration | Easing     |
| ------------------ | -------- | ---------- |
| Color / background | `150ms`  | `ease`     |
| Shadow             | `200ms`  | `ease`     |
| Transform (scale)  | `200ms`  | `ease-out` |
| Border             | `150ms`  | `ease`     |
| Opacity (fade in)  | `300ms`  | `ease-out` |

### Micro-interactions

- **Booking confirmation**: Sapa Green pulse animation on success state
- **Favorite/Heart**: Vietnam Red fill animation on toggle
- **Loading skeleton**: Ivory → Cream shimmer `rgba(237, 231, 217, 0.8)` → `rgba(229, 222, 208, 0.8)`
- **Image lazy load**: fade-in from 0 to 1 opacity over 300ms

---

## 8. Responsive Behavior

### Breakpoints

| Name         | Width         | Key Changes                                 |
| ------------ | ------------- | ------------------------------------------- |
| Mobile       | `< 600px`     | Single column, compact padding, stacked nav |
| Tablet Small | `600–768px`   | 2-column card grid                          |
| Tablet       | `768–1024px`  | 3-column grid, sidebar possible             |
| Desktop      | `1024–1280px` | Full layout                                 |
| Wide         | `> 1280px`    | Max-width container centered                |

### Collapsing Strategy

- Hero headline: `72px → 48px → 36px` maintaining proportional tracking
- 4-col grid → 2-col → 1-col on mobile
- Navigation: horizontal links → hamburger drawer
- City explorer strip: always horizontal scroll on mobile (no wrap)
- Section vertical padding: `80px → 48px → 32px`
- Search bar: full-width on mobile, compact field stacking

---

## 9. CSS Variables Reference

```css
:root {
  /* === BACKGROUNDS === */
  --color-bg: #f8f8f6; /* Primary page background — warm ivory */
  --color-surface-100: #faf7f2; /* Lightest surface */
  --color-surface-200: #f8f8f6; /* Page background */
  --color-surface-300: #ede7d9; /* Card fills, button bg */
  --color-surface-400: #e5ded0; /* Secondary surfaces */
  --color-surface-500: #ddd6c7; /* Deep surfaces */

  /* === TEXT === */
  --color-text: #1c1a14; /* Primary text — warm near-black */
  --color-text-60: rgba(28, 26, 20, 0.6); /* Secondary text */
  --color-text-40: rgba(28, 26, 20, 0.4); /* Placeholder, disabled */

  /* === BRAND ACCENTS === */
  --color-red: #c8102e; /* Vietnam Red — primary accent */
  --color-red-deep: #a50d25; /* Red hover/active */
  --color-red-soft: #f2d5d9; /* Red tint background */

  --color-green: #2d6a4f; /* Sapa Green — secondary accent */
  --color-green-deep: #1e4d38; /* Green hover/active */
  --color-green-soft: #d4eae0; /* Green tint background */

  --color-gold: #c9922a; /* Hội An Gold — tertiary/premium */
  --color-gold-soft: #f5e9d0; /* Gold tint background */

  /* === SEMANTIC === */
  --color-error: #c8102e;
  --color-success: #2d6a4f;
  --color-warning: #c9922a;
  --color-info: #2a6b9c;

  /* === BORDERS === */
  --border-primary: rgba(28, 26, 20, 0.1);
  --border-medium: rgba(28, 26, 20, 0.2);
  --border-strong: rgba(28, 26, 20, 0.5);
  --border-red: rgba(200, 16, 46, 0.25);
  --border-green: rgba(45, 106, 79, 0.25);

  /* === SHADOWS === */
  --shadow-card:
    rgba(0, 0, 0, 0.1) 0px 8px 32px, rgba(28, 26, 20, 0.06) 0px 0px 0px 1px;
  --shadow-elevated:
    rgba(0, 0, 0, 0.14) 0px 24px 60px, rgba(28, 26, 20, 0.1) 0px 0px 0px 1px;
  --shadow-red-glow: rgba(200, 16, 46, 0.2) 0px 8px 32px;
  --shadow-gold-glow: rgba(201, 146, 42, 0.2) 0px 8px 32px;

  /* === TYPOGRAPHY === */
  --font-display: 'Playfair Display', Georgia, 'Times New Roman', ui-serif;
  --font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', Arial;

  /* === RADIUS === */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 9999px;

  /* === SPACING === */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

---

## 10. Agent Prompt Guide

### Quick Color Reference

- Page background: `#F8F8F6` (warm ivory)
- Primary text: `#1C1A14` (warm near-black)
- Secondary text: `rgba(28, 26, 20, 0.60)`
- Primary CTA: `#C8102E` (Vietnam Red)
- Secondary accent: `#2D6A4F` (Sapa Green)
- Tertiary/premium: `#C9922A` (Hội An Gold)
- Border: `rgba(28, 26, 20, 0.10)`
- Card background: `#FFFFFF` or `#EDE7D9`

### Example Component Prompts

- **Hero section**: `#F8F8F6` ivory background. Full-width destination photograph with `rgba(28,26,20,0.20)` warm overlay. Headline Playfair Display 72px / 700 / line-height 1.10 / tracking -1.5px / `#1C1A14`. Subheadline Inter 18px / 400 / `rgba(28,26,20,0.60)`. Search bar white background, red focus ring. CTA button Vietnam Red `#C8102E` with red glow on hover.

- **Destination card**: White background, `1px solid rgba(28,26,20,0.10)` border, `12px` radius, card shadow. 16:9 image top with `12px 12px 0 0` radius. City name Playfair Display 22px / 600. Description Inter 14px / `rgba(28,26,20,0.60)`. Red pill tag (category). Price Playfair Display 24px / 700 / `#C8102E`.

- **Filter pills**: Inter 11px / 600 / uppercase / 0.8px tracking. Default: `#EDE7D9` bg / `rgba(28,26,20,0.70)` text / `9999px` radius / `4px 12px` padding. Active: `#C8102E` bg / white text.

- **Navigation**: Sticky `#F8F8F6` with `backdrop-filter: blur(12px)`. Logo left. Links Inter 14px / 500 / `rgba(28,26,20,0.70)`, hover `#C8102E`. Border bottom `1px solid rgba(28,26,20,0.10)`. Right CTA: Vietnam Red button.

- **Hotel card with price**: White card, 12px radius, gold star rating `#C9922A`, Playfair Display 24px / 700 price in `#C8102E`, `/đêm` suffix Inter 12px / `rgba(28,26,20,0.55)`. Availability green badge `#D4EAE0` bg / `#1E4D38` text.

### Iteration Principles

1. **Always warm** — `#F8F8F6` background, `#1C1A14` text, never pure white or cold gray for surfaces
2. **Red for energy, Green for nature, Gold for premium** — use accent colors with intent
3. **Playfair Display for all headings** — from hero to card titles; Inter for all UI and body
4. **Track headlines tighter at larger sizes** — `-1.5px at 72px`, `-0.8px at 42px`, `-0.3px at 28px`, `normal at 16px and below`
5. **Pill shapes for all tags and filters** — `9999px` radius always for category/city labels
6. **Red focus rings** — no cold blue anywhere; focus states use `#C8102E` with `rgba(200,16,46,0.12)` glow
7. **Vietnamese content** — default UI copy in Vietnamese: "Đặt ngay", "Khám phá", "Tìm kiếm", "Xem thêm"
8. **Shadow diffusion** — large blur values (`24px, 60px`) for atmospheric depth, not hard drop shadows
9. **Section alternation** — swap between `#F8F8F6` and `#EDE7D9` for visual rhythm without divider lines
10. **City-first thinking** — every destination feature should reference real Vietnamese cities: Hà Nội, TP. HCM, Đà Nẵng, Hội An, Sapa, Huế, Nha Trang, Phú Quốc

---

_Vietnam Travel Platform Design System — v1.0_
_Color vibe: Warm Reds + Lush Greens | Feel: Modern & Minimal (Premium)_
