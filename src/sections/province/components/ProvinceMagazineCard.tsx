import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/router';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';
import type { ProvinceListItem } from '@/features/provinces/types';
import { pickLocale } from '@/features/provinces/locale';
import { formatCount } from '@/utils/formatNumber';

const regionCardTone: Record<'NORTH' | 'CENTRAL' | 'SOUTH', string> = {
  NORTH: 'from-charcoal/60 via-charcoal/25 to-[oklch(35%_0.03_230)]/55',
  CENTRAL: 'from-charcoal/55 via-sunset-deep/35 to-charcoal/20',
  SOUTH: 'from-charcoal/60 via-charcoal/30 to-[oklch(42%_0.12_55)]/40',
};

function getShortDescription(item: ProvinceListItem, lang: 'vi' | 'en') {
  return (
    item.translations?.[lang]?.shortDescription ??
    item.translations?.vi?.shortDescription ??
    item.translations?.en?.shortDescription ??
    ''
  );
}

export function ProvinceMagazineCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[2rem] border border-charcoal/10 bg-sand-50 shadow-soft">
      <Skeleton className="aspect-[16/11] w-full rounded-none md:aspect-[16/10]" />
      <div className="flex flex-col gap-5 p-8 md:p-10">
        <Skeleton className="h-7 w-full max-w-[95%]" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export const ProvinceMagazineCard = memo(function ProvinceMagazineCard({
  item,
  className,
}: {
  item: ProvinceListItem;
  className?: string;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  const reduceMotion = useReducedMotion();

  const name = pickLocale(item.name, language) ?? item.slug;
  const fullName = pickLocale(item.fullName, language) ?? pickLocale(item.name, language) ?? '';
  const shortDescription = getShortDescription(item, lang);
  const region = item.region ?? 'CENTRAL';
  const tone = regionCardTone[region];

  const thumbnail =
    item.thumbnail?.url ??
    item.gallery?.[0]?.url ??
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80';

  const hotels = item.totalHotels;
  const tours = item.totalTours;
  const guides = item.totalTourGuides;

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -7 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[2rem] border border-charcoal/10 bg-sand-50 shadow-soft',
        className,
      )}
    >
      <Link
        to={ROUTES.PROVINCE.DETAIL.replace(':slug', item.slug)}
        className="relative block aspect-[16/11] overflow-hidden md:aspect-[16/10]"
      >
        <img
          src={thumbnail}
          alt=""
          className="size-full object-cover transition duration-[1s] group-hover:scale-[1.05]"
          loading="lazy"
        />
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t opacity-90 mix-blend-multiply',
            tone,
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-charcoal/25" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-sand-50">
          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-sand-100/70">
            <span>{fullName}</span>
            {item.isPopular ? (
              <span className="rounded-full bg-sand-50/15 px-2 py-1 text-sand-50">
                {t('province.popular_badge', 'Popular')}
              </span>
            ) : null}
          </div>
          <h3 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-[0.95]">{name}</h3>
        </div>
      </Link>
      <div className="flex flex-col gap-5 p-8 md:p-10">
        <p className="font-display text-xl italic leading-snug text-charcoal/92 md:text-[1.35rem]">
          {shortDescription ||
            t('province.magazine_fallback_lead', 'A destination worth exploring on your Vietnam route.')}
        </p>
        <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-charcoal/40">
          {t('province.magazine_stats_line', {
            guides: guides !== undefined ? formatCount(guides, locale) : '—',
            tours: tours !== undefined ? formatCount(tours, locale) : '—',
            hotels: hotels !== undefined ? formatCount(hotels, locale) : '—',
            defaultValue:
              '{{guides}} guides · {{tours}} tours · {{hotels}} hotels (when available)',
          })}
        </p>
        <Link
          to={ROUTES.PROVINCE.DETAIL.replace(':slug', item.slug)}
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-forest transition hover:text-sunset-deep"
        >
          {t('province.magazine_cta', 'Open dossier')}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.article>
  );
});
