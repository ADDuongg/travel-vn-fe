import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Hotel } from '@/features/hotels/types';
import { ROUTES } from '@/constants/router';
import { Reveal } from '@/components/home-editorial/Reveal';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';

function getHotelName(
  hotel: { translations?: Hotel['translations']; slug: string },
  lang: string,
): string {
  return (
    hotel.translations?.[lang]?.name ??
    hotel.translations?.vi?.name ??
    hotel.translations?.en?.name ??
    hotel.slug
  );
}

function getProvinceName(hotel: Hotel, lang: string): string | null {
  const province = hotel.provinceId;
  if (!province || typeof province === 'string') return null;
  const names = province.name as { vi?: string; en?: string } | undefined;
  return names?.[lang as 'vi' | 'en'] ?? names?.vi ?? names?.en ?? null;
}

function getDek(hotel: Hotel, lang: string): string | null {
  const tr = hotel.translations?.[lang];
  const short =
    (tr as { shortDescription?: string } | undefined)?.shortDescription;
  const desc = (tr as { description?: string } | undefined)?.description;
  if (short?.trim()) return short.trim();
  if (!desc?.trim()) return null;
  const plain = desc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plain.length <= 280) return plain;
  return `${plain.slice(0, 277)}…`;
}

type Props = { hotel: Hotel; index: number; lang: string };

export function HotelEditorialListCard({ hotel, index, lang }: Props) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const name = getHotelName(hotel, lang);
  const region = getProvinceName(hotel, lang);
  const dek = getDek(hotel, lang);
  const stars = hotel.starRating ?? 0;
  const thumbnail =
    hotel.thumbnail?.url ??
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
  const ratingAvg = hotel.ratingSummary?.average;
  const reviewCount = hotel.ratingSummary?.total;
  const to = ROUTES.HOTEL.DETAIL.replace(':id', hotel._id);

  return (
    <Reveal delay={(index % 3) * 0.04}>
      <motion.article
        initial={false}
        whileHover={{ y: reduceMotion ? 0 : -4 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16"
      >
        <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
          <Link
            to={to}
            className="group relative block overflow-hidden rounded-[2rem] border border-charcoal/10 shadow-soft"
          >
            <div className="relative aspect-[3/4] max-h-[min(92vh,720px)] w-full sm:aspect-[4/5]">
              <img
                src={thumbnail}
                alt=""
                className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-sand-50 md:p-9">
                <p className="text-[10px] uppercase tracking-[0.28em] text-sand-100/75">
                  {stars > 0 ? `${stars}★` : '—'} · {region ?? '—'}
                </p>
                <p className="mt-3 font-display text-3xl leading-[1.05] md:text-[2.35rem]">
                  {name}
                </p>
              </div>
            </div>
          </Link>
          <div className="pointer-events-none absolute right-4 top-4 z-10 md:right-6 md:top-6">
            <div className="pointer-events-auto">
              <FavoriteButton
                entityType={FavoriteEntityType.HOTEL}
                entityId={hotel._id}
                initialIsFavorited={hotel.isFavorited}
                size="icon"
                className="size-11 cursor-pointer rounded-full border border-charcoal/10 bg-sand-50/90 text-charcoal shadow-soft backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
        <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('hotel.editorial.card_mood', 'Curated stay')}
          </p>
          {dek ? (
            <p className="text-lg leading-relaxed text-mist md:text-xl">{dek}</p>
          ) : (
            <p className="text-lg leading-relaxed text-mist/80 md:text-xl">
              {t(
                'hotel.editorial.card_no_dek',
                'Details and correspondence on the property page.',
              )}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.18em] text-charcoal/50">
            {region ? <span>{region}</span> : null}
            {region ? (
              <span className="hidden h-1 w-1 rounded-full bg-charcoal/25 sm:inline" />
            ) : null}
            <span>
              {t('hotel.editorial.card_from_rates', 'Rates on detail page')}
            </span>
          </div>
          <p className="text-xs text-charcoal/45">
            {ratingAvg != null && reviewCount != null && reviewCount > 0
              ? t('hotel.editorial.card_rating_line', {
                  avg: ratingAvg.toFixed(2),
                  count: reviewCount,
                  defaultValue: '{{avg}} tone · {{count}} notes',
                })
              : t('hotel.editorial.card_rating_pending', 'Guest notes soon')}
          </p>
          <Link
            to={to}
            className="inline-flex items-center gap-2 border-b border-charcoal/25 pb-0.5 text-sm font-semibold text-charcoal transition hover:border-forest/50 hover:text-sunset-deep"
          >
            {t('hotel.editorial.card_cta', 'Enter this stay')}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </motion.article>
    </Reveal>
  );
}

export function HotelEditorialListCardSkeleton() {
  return (
    <div className="grid animate-pulse gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
      <div className="overflow-hidden rounded-[2rem] border border-charcoal/10 bg-sand-200/40 shadow-soft">
        <div className="aspect-[3/4] max-h-[min(92vh,720px)] w-full sm:aspect-[4/5]" />
      </div>
      <div className="space-y-4">
        <div className="h-3 w-24 rounded-full bg-charcoal/10" />
        <div className="h-4 w-full rounded bg-charcoal/10" />
        <div className="h-4 w-[90%] rounded bg-charcoal/10" />
        <div className="h-3 w-40 rounded bg-charcoal/10" />
      </div>
    </div>
  );
}

