import type { ProvinceTranslation, ProvinceHighlight } from './types';
import type { LangKey } from '@/utils/addressOptions';

/** Record<locale, string> — key chữ thường (docs/PROVINCE-FE.md) */
export function pickLocale(
  d: Record<string, string> | undefined,
  locale: string,
  fallback: string = 'vi',
): string | undefined {
  if (!d || typeof d !== 'object') return undefined;
  const short = locale.split?.('-')?.[0]?.toLowerCase() ?? locale;
  return (
    d[locale] ??
    d[short] ??
    d[fallback] ??
    (Object.values(d).find((v) => typeof v === 'string' && v.trim()) as string | undefined) ??
    undefined
  );
}

/**
 * bestTimeToVisit: nằm trong translations[locale] (string), không còn field root riêng.
 */
export function getProvinceBestTimeDisplay(
  province: {
    translations?: Record<string, ProvinceTranslation>;
  },
  lang: LangKey,
  language: string,
): string | undefined {
  const short = language.split('-')[0]?.toLowerCase() ?? language;
  return (
    province.translations?.[language]?.bestTimeToVisit ??
    province.translations?.[short]?.bestTimeToVisit ??
    province.translations?.[lang]?.bestTimeToVisit ??
    province.translations?.vi?.bestTimeToVisit ??
    province.translations?.en?.bestTimeToVisit
  );
}

export function getHighlightTitleAndDescription(
  highlight: ProvinceHighlight,
  lang: LangKey,
  language: string,
): { title: string; description: string } {
  const short = language.split('-')[0]?.toLowerCase() ?? language;
  const tr =
    highlight.translations?.[language] ??
    highlight.translations?.[short] ??
    highlight.translations?.[lang] ??
    highlight.translations?.vi ??
    highlight.translations?.en;
  if (tr?.name != null && String(tr.name).trim() !== '') {
    return { title: tr.name, description: tr.description ?? '' };
  }
  const title = pickLocale(highlight.name, language) ?? pickLocale(highlight.name, lang) ?? '—';
  const description =
    pickLocale(highlight.description, language) ?? pickLocale(highlight.description, lang) ?? '';
  return { title, description };
}
