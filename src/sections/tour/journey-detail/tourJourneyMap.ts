import type { TFunction } from 'i18next';
import type { Tour } from '@/features/tours/types';

export type TourJourneyNavItem = { id: string; labelKey: string };

export type TourScheduleWindowVm = { label: string; note: string };

export type TourItineraryStopVm = {
  label: string;
  title: string;
  detail: string;
};

export type TourContextCardVm = { body: string; index: number };

export type TourGalleryItemVm = { url: string; alt: string };

export function getTourName(tour: Tour, lang: string): string {
  return (
    tour.translations?.[lang]?.name ??
    tour.translations?.vi?.name ??
    tour.translations?.en?.name ??
    tour.slug
  );
}

function pickTranslation(tour: Tour, lang: string) {
  return (
    tour.translations?.[lang] ??
    tour.translations?.vi ??
    tour.translations?.en
  );
}

/** Merge thumbnail + gallery URLs like TourHeader (dedupe by url). */
export function getTourGalleryItems(tour: Tour): TourGalleryItemVm[] {
  const seen = new Set<string>();
  const out: TourGalleryItemVm[] = [];

  const push = (url: string | undefined, alt?: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    out.push({ url, alt: alt ?? '' });
  };

  if (tour.thumbnail?.url) push(tour.thumbnail.url, tour.thumbnail.alt);
  (tour.gallery ?? []).forEach((g, i) => {
    push(g.url, g.alt ?? `gallery-${i}`);
  });

  return out;
}

export function getHeroCoverUrl(tour: Tour): string {
  const items = getTourGalleryItems(tour);
  return (
    items[0]?.url ??
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=2400&q=85'
  );
}

/** Image beside story column — first gallery image after hero cover, if any. */
export function getSecondaryStoryImage(tour: Tour): string | undefined {
  const items = getTourGalleryItems(tour);
  return items.length > 1 ? items[1]?.url : undefined;
}

export function splitParagraphs(text: string | undefined): string[] {
  if (!text?.trim()) return [];
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function getTourStoryVm(tour: Tour, lang: string) {
  const tr = pickTranslation(tour, lang);
  const shortDesc = tr?.shortDescription?.trim() ?? '';
  const descParts = splitParagraphs(tr?.description);

  if (shortDesc) {
    return {
      lead: shortDesc,
      paragraphs: descParts.filter((p) => p !== shortDesc),
    };
  }

  if (descParts.length === 0) {
    return { lead: '', paragraphs: [] as string[] };
  }

  return {
    lead: descParts[0] ?? '',
    paragraphs: descParts.slice(1),
  };
}

export function hasJourneyStorySection(tour: Tour, lang: string): boolean {
  const vm = getTourStoryVm(tour, lang);
  if (vm.paragraphs.length > 0) return true;
  return Boolean(getSecondaryStoryImage(tour));
}

export function getIncludedExcludedLists(tour: Tour, lang: string) {
  const tr = pickTranslation(tour, lang);
  const included = tr?.inclusions ?? [];
  const excluded = tr?.exclusions ?? [];
  return { included, excluded };
}

/** Inclusions + amenities fallback (matches TourIncluded behaviour). */
export function buildEssentialsLines(tour: Tour, lang: string) {
  const tr = pickTranslation(tour, lang);
  const rawInclusions = tr?.inclusions ?? [];
  const excluded = tr?.exclusions ?? [];

  if (rawInclusions.length > 0) {
    return { included: rawInclusions, excluded };
  }

  const amenities = tour.amenities ?? [];
  const included = amenities.map((a) => {
    if (typeof a.name === 'object' && a.name) {
      return (
        a.name[lang as 'vi' | 'en'] ??
        a.name.vi ??
        a.name.en ??
        '—'
      );
    }
    return String(a.name ?? '—');
  });

  return { included, excluded };
}

export function buildRhythmFromSchedule(
  tour: Tour,
  t: TFunction,
  locale: string,
): {
  departureRhythm: string[];
  nextWindows: TourScheduleWindowVm[];
} {
  const departureRhythm: string[] = [];
  const days = tour.schedule?.departureDays?.filter(Boolean);
  if (days && days.length > 0) {
    departureRhythm.push(
      t('tour.journey.rhythm.departure_days_line', {
        days: days.join(', '),
      }),
    );
  }

  const fixed = tour.schedule?.fixedDepartures ?? [];
  const df = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const nextWindows: TourScheduleWindowVm[] = fixed.map((row) => ({
    label: df.format(new Date(row.date)),
    note: t('tour.journey.rhythm.window_note', {
      count: row.availableSlots,
      status: row.status,
    }),
  }));

  return { departureRhythm, nextWindows };
}

export function buildItineraryStops(
  tour: Tour,
  lang: string,
  t: TFunction,
): TourItineraryStopVm[] {
  const days = [...(tour.itinerary ?? [])].sort(
    (a, b) => a.dayNumber - b.dayNumber,
  );
  return days.map((day) => {
    const tday =
      day.translations?.[lang] ??
      day.translations?.vi ??
      day.translations?.en;
    const title =
      tday?.title ??
      `${t('tour.detail.day', 'Day')} ${day.dayNumber}`;
    let detail = tday?.description ?? '';
    const meals = tday?.meals ?? [];
    const accommodation = tday?.accommodation;
    const extras: string[] = [];
    if (meals.length > 0) {
      extras.push(
        `${t('tour.detail.meals_prefix', 'Meals')}: ${meals.join(', ')}`,
      );
    }
    if (accommodation) {
      extras.push(
        `${t('tour.detail.stay_prefix', 'Stay')}: ${accommodation}`,
      );
    }
    if (extras.length > 0) {
      detail = detail ? `${detail}\n\n${extras.join('\n')}` : extras.join('\n');
    }
    return {
      label: `${t('tour.detail.day', 'Day')} ${day.dayNumber}`,
      title,
      detail,
    };
  });
}

export function buildContextCards(tour: Tour, lang: string): TourContextCardVm[] {
  const tr = pickTranslation(tour, lang);
  const highlights = tr?.highlights ?? [];
  const notes = tr?.notes ?? [];
  const cards: TourContextCardVm[] = [];

  highlights.forEach((h, i) => {
    cards.push({ body: h, index: i + 1 });
  });

  notes.forEach((n, i) => {
    cards.push({ body: n, index: highlights.length + i + 1 });
  });

  return cards;
}

export function getMainRegionLabel(tour: Tour, lang: string): string {
  const main = tour.destinations?.find((d) => d.isMainDestination);
  const province = main?.provinceId;
  if (typeof province === 'object' && province && 'name' in province) {
    const name = province.name as { vi?: string; en?: string };
    return (
      name[lang as 'vi' | 'en'] ?? name.vi ?? name.en ?? '—'
    );
  }
  return '—';
}

export function getDurationLabel(
  tour: Tour,
  t: TFunction,
): { line: string; days: number; nights: number } {
  const days = tour.duration?.days ?? 0;
  const nights = tour.duration?.nights ?? 0;
  return {
    line: t('tour.detail.duration_short', { days, nights }),
    days,
    nights,
  };
}

export function buildTourJourneyNavItems(
  tour: Tour,
  lang: string,
  t: TFunction,
): TourJourneyNavItem[] {
  const items: TourJourneyNavItem[] = [];

  if (hasJourneyStorySection(tour, lang)) {
    items.push({ id: 'story', labelKey: 'tour.journey.nav.story' });
  }

  const ess = buildEssentialsLines(tour, lang);
  if (ess.included.length > 0 || ess.excluded.length > 0) {
    items.push({ id: 'essentials', labelKey: 'tour.journey.nav.essentials' });
  }

  const rhythm = buildRhythmFromSchedule(tour, t, lang === 'vi' ? 'vi-VN' : 'en-US');
  if (
    rhythm.departureRhythm.length > 0 ||
    rhythm.nextWindows.length > 0
  ) {
    items.push({ id: 'rhythm', labelKey: 'tour.journey.nav.rhythm' });
  }

  if ((tour.itinerary?.length ?? 0) > 0) {
    items.push({ id: 'itinerary', labelKey: 'tour.journey.nav.itinerary' });
  }

  if (getTourGalleryItems(tour).length > 0) {
    items.push({ id: 'gallery', labelKey: 'tour.journey.nav.gallery' });
  }

  if (buildContextCards(tour, lang).length > 0) {
    items.push({ id: 'context', labelKey: 'tour.journey.nav.context' });
  }

  items.push({ id: 'map', labelKey: 'tour.journey.nav.map' });
  items.push({ id: 'faq', labelKey: 'tour.journey.nav.faq' });

  items.push({ id: 'plan', labelKey: 'tour.journey.nav.plan' });
  items.push({ id: 'reviews', labelKey: 'tour.journey.nav.reviews' });
  items.push({ id: 'more', labelKey: 'tour.journey.nav.more' });

  return items;
}

export function getPlanLeadCopy(
  tour: Tour,
  lang: string,
  t: TFunction,
): string {
  const tr = pickTranslation(tour, lang);
  const note = tr?.notes?.[0]?.trim();
  if (note) return note;
  const cp = tr?.cancellationPolicy?.trim();
  if (cp) {
    return cp.length > 360 ? `${cp.slice(0, 357)}…` : cp;
  }
  return t(
    'tour.journey.plan.copy_default',
    'Tell us your pace, dietary notes, and celebration dates — we shape departures around real availability.',
  );
}
