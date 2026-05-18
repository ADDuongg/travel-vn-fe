import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FaBed, FaUserGroup } from 'react-icons/fa6';
import { FaLocationDot, FaStar } from 'react-icons/fa6';
import type { Room, HotelRef } from '@/features/rooms/types';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { useTranslation } from 'react-i18next';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';

function getHotelDisplay(hotel: string | HotelRef | undefined, lang: string): string | null {
  if (!hotel || typeof hotel === 'string') return null;
  const name =
    hotel.translations?.[lang]?.name ??
    hotel.translations?.vi?.name ??
    hotel.translations?.en?.name;
  return name ?? null;
}

function getProvinceDisplay(hotel: string | HotelRef | undefined, lang: string): string | null {
  if (!hotel || typeof hotel === 'string') return null;
  const province = hotel.provinceId;
  if (!province || typeof province === 'string') return null;
  const names = province.name as { vi?: string; en?: string } | undefined;
  const name = names?.[lang as 'vi' | 'en'] ?? names?.vi ?? names?.en;
  return name ?? null;
}

export function RoomCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.1)] bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <Skeleton className="relative w-full aspect-[4/3] min-h-[10rem] sm:min-h-[12rem] lg:min-h-[14rem] rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <Skeleton className="h-3 w-14 rounded-full" />
        <Skeleton className="h-5 sm:h-6 w-full max-w-[90%] rounded-md" />
        <Skeleton className="h-4 w-[80%] rounded" />
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <Skeleton className="h-4 w-28 rounded mt-1" />
        <Skeleton className="h-4 w-24 rounded mt-auto pt-2" />
      </div>
    </Card>
  );
}

interface RoomCardProps {
  item: Room;
  lang?: string;

  loading?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ item, lang = 'vi', loading = false }) => {
  const { t } = useTranslation();
  if (loading) {
    return <RoomCardSkeleton />;
  }
  const translation = item.translations?.[lang];
  const hotelName = getHotelDisplay(item.hotelId, lang);
  const provinceName = getProvinceDisplay(item.hotelId, lang);

  const imageUrl = item.thumbnail?.url ?? 'https://via.placeholder.com/600x400';

  const basePrice = item.pricing?.basePrice || 0;
  const currency = item.pricing?.currency ?? 'VND';

  let finalPrice = basePrice;
  let oldPrice: number | undefined;
  let discountLabel: string | undefined;

  if (item.sale?.isActive) {
    oldPrice = basePrice;
    if (item.sale.type === 'PERCENT') {
      finalPrice = Math.round(basePrice * (1 - item.sale.value / 100));
      discountLabel = `-${item.sale.value}%`;
    }
    if (item.sale.type === 'FIXED') {
      finalPrice = Math.max(0, basePrice - item.sale.value);
      discountLabel = `-${item.sale.value}${currency}`;
    }
  }

  const totalGuests = item.adults + item.children;
  const hasRating = item.ratingSummary && item.ratingSummary.total > 0;

  return (
    <Link to={ROUTES.ROOM.DETAIL.replace(':id', item._id)}>
      <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.1)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-elevated)]">
                <div className="relative w-full aspect-[4/3] min-h-[10rem] sm:min-h-[12rem] lg:min-h-[14rem] overflow-hidden">
          <img
            src={imageUrl}
            alt={item.thumbnail?.alt ?? translation?.name ?? item.code}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="absolute top-3 right-3 z-[1]">
            <FavoriteButton
              entityType={FavoriteEntityType.ROOM}
              entityId={item._id}
              initialIsFavorited={item.isFavorited}
              stopNavigation
              className="h-9 w-9 rounded-full"
            />
          </div>

                    {discountLabel && (
            <span className="absolute right-14 top-3 inline-flex items-center rounded-full bg-[#c8102e] px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              {discountLabel}
            </span>
          )}

                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex flex-wrap items-baseline gap-1.5 rounded-lg bg-[#1c1a14]/82 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm sm:text-sm">
              <span className="text-white/70">{t('room.from')}</span>
              {oldPrice != null && (
                <span className="line-through text-muted-foreground/80 text-xs">
                  {oldPrice.toLocaleString()} {currency}
                </span>
              )}
              <span>
                {finalPrice.toLocaleString()} <span className="text-[0.65em] opacity-90">{currency}</span>
              </span>
            </span>
          </div>
        </div>

                <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                    <div className="mb-2">
            {item.roomType && (
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2d6a4f]">
                {item.roomType}
              </span>
            )}
            <h3
              className="mt-0.5 line-clamp-2 text-base font-bold text-[#1c1a14] sm:text-lg"
              style={{
                fontFamily: 'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
              }}
            >
              {translation?.name ?? item.code}
            </h3>
          </div>

                    {(hotelName || provinceName) && (
            <div className="mb-2 flex min-w-0 items-center gap-2 text-sm text-[rgba(28,26,20,0.62)]">
              <FaLocationDot className="size-3.5 shrink-0 text-[#2d6a4f]" />
              <span className="truncate">
                {[hotelName, provinceName].filter(Boolean).join(' • ')}
              </span>
            </div>
          )}

                    <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[rgba(28,26,20,0.62)]">
            <span className="inline-flex items-center gap-1.5">
              <FaBed className="size-4 shrink-0 text-[rgba(28,26,20,0.45)]" />
              {item.roomSize ? `${item.roomSize} m²` : t('input.field_label.room')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaUserGroup className="size-4 shrink-0 text-[rgba(28,26,20,0.45)]" />
              {totalGuests} / {item.maxGuests} {t('room.guests')}
            </span>
          </div>

                    {hasRating && (
            <div className="mb-3 inline-flex items-center gap-1.5 text-sm text-[rgba(28,26,20,0.62)]">
              <span className="inline-flex items-center gap-1 rounded bg-[#f5e9d0] px-2 py-0.5 text-xs font-medium text-[#8c5d10]">
                <FaStar className="size-3 fill-current" />
                {item.ratingSummary?.average?.toFixed(1)}
              </span>
              <span>
                ({item.ratingSummary?.total} {t('room.reviews')})
              </span>
            </div>
          )}

                    <span className="mt-auto inline-flex items-center gap-2 pt-1 text-sm font-semibold uppercase tracking-wide text-[#2d6a4f] transition-[gap] group-hover:gap-3">
            {t('room.view_details')}
            <span aria-hidden>→</span>
          </span>
        </div>
      </Card>
    </Link>
  );
};

export default RoomCard;

