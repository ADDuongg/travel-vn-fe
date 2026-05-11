import type { Hotel } from '@/features/hotels/types';

export type GalleryItem = { url: string; alt: string };

/** Ordered gallery: thumbnail first, then gallery by `order`. */
export function buildOrderedGallery(hotel: Hotel): GalleryItem[] {
  const out: GalleryItem[] = [];
  const thumb = hotel.thumbnail;
  if (thumb?.url) {
    out.push({ url: thumb.url, alt: thumb.alt ?? '' });
  }
  const rest = [...(hotel.gallery ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  for (const g of rest) {
    if (!g.url) continue;
    if (thumb?.url && g.url === thumb.url) continue;
    out.push({ url: g.url, alt: g.alt ?? '' });
  }
  return out;
}

/** Split hotel HTML description into plain paragraphs for editorial layout. */
export function paragraphsFromHotelDescription(html?: string): string[] {
  if (!html?.trim()) return [];
  const normalized = html.replace(/\r\n/g, '\n');
  const byClosingP = normalized
    .split(/<\/p\s*>/i)
    .map((chunk) => chunk.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  if (byClosingP.length > 1) return byClosingP;
  const single = normalized.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return single ? [single] : [];
}

export function hasHotelEditorialStory(hotel: Hotel, lang: string): boolean {
  const descRaw =
    hotel.translations?.[lang]?.description ??
    hotel.translations?.vi?.description ??
    hotel.translations?.en?.description;
  const desc = typeof descRaw === 'string' ? descRaw : undefined;
  const paras = paragraphsFromHotelDescription(desc);
  const imgs = buildOrderedGallery(hotel);
  return paras.length > 0 || imgs.length > 0;
}

export function hasHotelEditorialPolicies(hotel: Hotel, lang: string): boolean {
  type Tr = { policies?: string[] };
  const tr = hotel.translations?.[lang] as Tr | undefined;
  const trVi = hotel.translations?.vi as Tr | undefined;
  const trEn = hotel.translations?.en as Tr | undefined;
  const policies = tr?.policies ?? trVi?.policies ?? trEn?.policies;
  const hasPolicies = Boolean(policies && policies.length > 0);
  const hasAmenities = (hotel.amenities ?? []).length > 0;
  return hasPolicies || hasAmenities;
}

export function formatVndAmount(n: number, locale: string): string {
  const loc = locale === 'vi' ? 'vi-VN' : 'en-US';
  try {
    return new Intl.NumberFormat(loc, {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n} ₫`;
  }
}
