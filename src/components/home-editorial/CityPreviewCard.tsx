import type { ProvinceListItem } from '@/features/provinces/types';
import { getHighlightTitleAndDescription, pickLocale } from '@/features/provinces/locale';
import { ROUTES } from '@/constants/router';
import { langKey } from '@/utils/addressOptions';
import { useLanguage } from '@/hooks/useLanguage';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80';

function regionToMoodClass(region?: ProvinceListItem['region']): string {
  switch (region) {
    case 'NORTH':
      return 'city-hanoi';
    case 'CENTRAL':
      return 'city-danang';
    case 'SOUTH':
      return 'city-hcmc';
    default:
      return '';
  }
}

function getShortDescription(item: ProvinceListItem, lang: 'vi' | 'en') {
  return (
    item.translations?.[lang]?.shortDescription ??
    item.translations?.vi?.shortDescription ??
    item.translations?.en?.shortDescription ??
    ''
  );
}

function regionEyebrow(
  region: ProvinceListItem['region'] | undefined,
  t: (k: string) => string,
): string {
  if (region === 'NORTH') return t('province.region_north');
  if (region === 'CENTRAL') return t('province.region_central');
  if (region === 'SOUTH') return t('province.region_south');
  return '';
}

export function CityPreviewCard({
  item,
  index,
}: {
  item: ProvinceListItem;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const name = pickLocale(item.name, language) ?? item.slug;
  const shortDescription = getShortDescription(item, lang);
  const moodClass = regionToMoodClass(item.region);
  const thumbnail =
    item.thumbnail?.url ?? item.gallery?.[0]?.url ?? FALLBACK_IMG;

  const chips = (item.highlights ?? [])
    .slice(0, 3)
    .map((h) => getHighlightTitleAndDescription(h, lang, language).title)
    .filter(Boolean);

  const to = ROUTES.PROVINCE.DETAIL.replace(':slug', item.slug);
  const eyebrow = regionEyebrow(item.region, t);

  return (
    <motion.article
      layout
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className={`group relative overflow-hidden rounded-3xl bg-sand-100 shadow-soft ${moodClass}`}
    >
      <Link to={to} className="block">
        <div className="relative aspect-[4/5] overflow-hidden md:aspect-[16/11]">
          <img
            src={thumbnail}
            alt={name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
            loading={index < 2 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/35 to-transparent opacity-90 transition duration-500 group-hover:opacity-95" />
          <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 md:p-8">
            {eyebrow ? (
              <p className="text-[11px] uppercase tracking-[0.28em] text-sand-50/75">
                {eyebrow}
              </p>
            ) : null}
            <h3 className="font-display text-3xl text-sand-50 md:text-4xl">{name}</h3>
            <p className="text-sm text-sand-100/85">{shortDescription}</p>
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {chips.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-sand-50/25 bg-sand-50/10 px-3 py-1 text-[11px] text-sand-50/90 backdrop-blur-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

