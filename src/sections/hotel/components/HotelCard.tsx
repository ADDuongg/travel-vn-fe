import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Star } from 'lucide-react';
import type { Hotel } from '@/features/hotels/types';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { useTranslation } from 'react-i18next';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';
import { cn } from '@/lib/utils';

export function HotelCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-2xl border-0 shadow-[var(--shadow-card)]">
      <Skeleton className="relative aspect-[4/3] w-full min-h-[12rem] rounded-none sm:min-h-[14rem]" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-5 w-10 rounded-full" />
        <Skeleton className="h-6 w-full max-w-[90%] rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="mt-auto h-4 w-28 pt-2" />
      </div>
    </Card>
  );
}

function getHotelName(hotel: { translations?: Hotel['translations']; slug: string }, lang: string): string {
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

interface HotelCardProps {
  item: Hotel;
  lang?: string;
}

const HotelCard: React.FC<HotelCardProps> = ({
  item,
  lang = 'vi',
}) => {
  const { t } = useTranslation();
  const name = getHotelName(item, lang);
  const provinceName = getProvinceName(item, lang);
  const stars = item.starRating;

  const thumbnail =
    item.thumbnail?.url ??
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

  return (
    <Link
      to={ROUTES.HOTEL.DETAIL.replace(':id', item._id)}
      className="block h-full"
    >
      <Card
        className={cn(
          'group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.08)] bg-white shadow-[var(--shadow-card)] transition-all duration-300',
          'hover:shadow-[var(--shadow-elevated)]',
        )}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={thumbnail}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.04]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#1c1a14]/70 via-[#1c1a14]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
          <div className="absolute right-3 top-3 z-[1]">
            <FavoriteButton
              entityType={FavoriteEntityType.HOTEL}
              entityId={item._id}
              initialIsFavorited={item.isFavorited}
              stopNavigation
              className="h-9 w-9 rounded-full"
            />
          </div>
          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
            {stars != null && stars > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#9a6b1a] shadow-sm ring-1 ring-[rgba(201,146,42,0.35)]">
                <Star
                  className="size-3.5 fill-[#c9922a] text-[#c9922a]"
                  aria-hidden
                />
                {stars}
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-[#d4eae0] px-2.5 py-1 text-xs font-semibold text-[#1e4d38]">
              {t('hotel.card.open', 'Open')}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3
            className="line-clamp-2 text-lg font-bold tracking-tight text-[#1c1a14] transition-colors duration-200 group-hover:text-[#c8102e]"
            style={{
              fontFamily: 'var(--font-dm-serif-display, Georgia, serif)',
            }}
          >
            {name}
          </h3>
          {provinceName && (
            <div className="mb-3 mt-2 flex items-center gap-1.5 text-sm text-[rgba(28,26,20,0.6)]">
              <MapPin
                className="size-4 shrink-0 text-[#2d6a4f]"
                strokeWidth={2.25}
                aria-hidden
              />
              <span className="line-clamp-1">{provinceName}</span>
            </div>
          )}
          <span className="mt-auto flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#c8102e] transition-all duration-200 group-hover:gap-3">
            {t('hotel.view_details', 'View Details')}
            <span aria-hidden>→</span>
          </span>
        </div>
      </Card>
    </Link>
  );
};

export default HotelCard;

