import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { fmtMoney } from '@/utils';
import { caculateSalePrice } from '@/utils';
import type { TourListItem } from '@/features/tours/types';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';
import { MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

function getTourName(tour: TourListItem, lang: string): string {
  return (
    tour.translations?.[lang]?.name ??
    tour.translations?.vi?.name ??
    tour.translations?.en?.name ??
    tour.slug
  );
}

function getShortDescription(tour: TourListItem, lang: string): string | null {
  return (
    tour.translations?.[lang]?.shortDescription ??
    tour.translations?.vi?.shortDescription ??
    tour.translations?.en?.shortDescription ??
    null
  );
}

function getMainDestinationName(
  tour: TourListItem,
  lang: string,
): string | null {
  const main = tour.destinations?.find((d) => d.isMainDestination);
  const province = main?.provinceId;
  if (!province || typeof province === 'string') return null;
  const names = province.name as { vi?: string; en?: string } | undefined;
  return names?.[lang as 'vi' | 'en'] ?? names?.vi ?? names?.en ?? null;
}

function durationLabel(
  d: { days: number; nights: number },
  t: (k: string, opts?: Record<string, unknown>) => string,
) {
  if (d.days <= 0 && d.nights <= 0) return null;
  return t('tour.card.duration', {
    days: d.days,
    nights: d.nights,
  });
}

export function TourCardSkeleton() {
  return (
    <Card className="tour-card-premium border border-[rgba(28,26,20,0.1)] bg-white">
      <Skeleton className="relative aspect-[4/3] w-full rounded-t-[0.75rem] rounded-b-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-7 w-full max-w-[90%] rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="mt-auto h-8 w-28 rounded" />
      </div>
    </Card>
  );
}

interface TourCardProps {
  item: TourListItem;
  lang?: string;
  /** Wider image ratio for horizontal strips */
  variant?: 'default' | 'wide';
}

const TourCard: React.FC<TourCardProps> = ({ item, lang = 'vi', variant = 'default' }) => {
  const { t } = useTranslation();
  const name = getTourName(item, lang);
  const shortDesc = getShortDescription(item, lang);
  const destinationName = getMainDestinationName(item, lang);
  const thumbnail =
    item.thumbnail?.url ??
    'https://images.unsplash.com/photo-1506905925346-21bfe4e5667a?w=800';
  const rating = item.ratingSummary?.average ?? 0;
  const reviewCount = item.ratingSummary?.total ?? 0;
  const basePrice = item.pricing?.basePrice ?? 0;
  const salePercent =
    item.sale?.isActive && item.sale.type === 'PERCENT' ? item.sale.value : 0;
  const salePrice = salePercent
    ? caculateSalePrice(basePrice, salePercent)
    : null;
  const { days, nights } = item.duration ?? { days: 0, nights: 0 };
  const linkTo = ROUTES.TOUR.DETAIL.replace(':id', item._id);
  const dur = durationLabel({ days, nights }, t);
  const pillText = destinationName
    ? destinationName
    : item.sale?.isActive
      ? t('tour.card.badge_featured', 'Featured')
      : t('tour.card.badge_vietnam', 'Vietnam');
  const pillClass =
    item.sale?.isActive && !destinationName
      ? 'bg-[#f5e9d0] text-[#8a5a0f] border border-[rgba(201,146,42,0.35)]'
      : 'bg-[#d4eae0] text-[#1e4d38] border border-[rgba(45,106,79,0.25)]';

  return (
    <Link to={linkTo} className="block h-full min-w-0 cursor-pointer">
      <Card
        className={cn(
          'tour-card-premium group flex h-full min-h-0 flex-col overflow-hidden border border-[rgba(28,26,20,0.1)] bg-white transition-[box-shadow,border-color] duration-200 motion-reduce:transition-none',
          'rounded-[0.75rem] shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:border-[rgba(28,26,20,0.2)] hover:shadow-[var(--shadow-elevated)]',
          variant === 'wide' && 'min-w-[280px] max-w-[320px] shrink-0',
        )}
      >
        <div
          className={cn(
            'relative w-full overflow-hidden',
            variant === 'wide' ? 'aspect-[16/9]' : 'aspect-[4/3]',
          )}
        >
          <img
            src={thumbnail}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transform-none group-hover:scale-[1.03]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#1c1a14]/50 via-[#1c1a14]/0 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:opacity-0"
            aria-hidden
          />
          <div className="absolute left-3 top-3 z-[1] max-w-[min(100%,14rem)]">
            <span
              className={cn(
                'inline-flex max-w-full items-center truncate rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider',
                destinationName
                  ? 'bg-[#d4eae0] text-[#1e4d38] border-[rgba(45,106,79,0.25)]'
                  : pillClass,
              )}
            >
              {pillText}
            </span>
          </div>
          <div className="absolute right-3 top-3 z-[1]">
            <FavoriteButton
              entityType={FavoriteEntityType.TOUR}
              entityId={item._id}
              initialIsFavorited={item.isFavorited}
              stopNavigation
              className="h-9 w-9 cursor-pointer rounded-full border border-white/30 bg-white/90 shadow-sm backdrop-blur-sm"
            />
          </div>
          {(salePercent > 0 || item.sale?.isActive) && (
            <div className="absolute right-3 top-14 z-[1] sm:top-14">
              <Badge className="cursor-default border-0 bg-[#c8102e] text-[10px] font-bold uppercase text-white">
                {salePercent > 0
                  ? t('tour.card.off_percent', { percent: salePercent })
                  : t('tour.card.special_offer', 'Special')}
              </Badge>
            </div>
          )}
          {rating > 0 && (
            <div className="absolute bottom-3 left-3 z-[1]">
              <span className="inline-flex items-center gap-0.5 rounded-full border border-white/15 bg-white/80 px-1.5 py-0.5 text-[10px] font-medium text-charcoal/80 backdrop-blur-sm">
                <Star className="size-3 fill-[#c9922a]/90 text-[#c9922a]/90" aria-hidden />
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3
            className="font-['Playfair_Display',Georgia,serif] text-[1.38rem] font-semibold leading-[1.3] tracking-[-0.01em] text-[#1c1a14] line-clamp-2 transition-colors duration-200 group-hover:text-[#c8102e]"
            style={{ fontFamily: 'var(--font-dm-serif-display, Playfair Display, Georgia, serif)' }}
          >
            {name}
          </h3>
          {shortDesc && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[rgba(28,26,20,0.6)]">
              {shortDesc}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[rgba(28,26,20,0.55)]">
            {dur && (
              <span className="rounded-full bg-[#ede7d9] px-2.5 py-0.5 text-xs font-medium text-[#1c1a14]">
                {dur}
              </span>
            )}
            {destinationName ? (
              <span className="inline-flex max-w-full items-center gap-1.5 text-xs sm:text-sm">
                <MapPin
                  className="size-3.5 shrink-0 text-[#2d6a4f]"
                  strokeWidth={2.25}
                  aria-hidden
                />
                <span className="truncate">{destinationName}</span>
              </span>
            ) : null}
          </div>
          {reviewCount > 0 && (
            <div className="mt-2 flex items-center gap-1 text-[11px] text-charcoal/45">
              <span className="text-[#c9922a]/80">★</span>
              <span>
                {rating.toFixed(1)} · {t('tour.card.reviews_count', { count: reviewCount })}
              </span>
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-end justify-between gap-2 border-t border-charcoal/10 pt-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-mist">
                {t('tour.card.price_from', 'From')}
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                {salePrice != null && (
                  <span className="text-xs text-charcoal/35 line-through">
                    {fmtMoney(basePrice)}
                  </span>
                )}
                <span className="text-lg font-semibold tabular-nums leading-none text-charcoal/75">
                  {fmtMoney(salePrice ?? basePrice)}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-mist">
              {t('tour.card.per_person', '/ guest')}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TourCard;
