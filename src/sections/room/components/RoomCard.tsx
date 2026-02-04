import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FaBed, FaUserGroup } from 'react-icons/fa6';
import { FaLocationDot, FaStar } from 'react-icons/fa6';
import type { Room, HotelRef } from '@/features/rooms/types';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { useTranslation } from 'react-i18next';

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

/** Skeleton placeholder đồng bộ layout với RoomCard (shadcn Skeleton) */
export function RoomCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col h-full border-0 bg-card">
      <Skeleton className="relative w-full aspect-[4/3] min-h-[10rem] sm:min-h-[12rem] lg:min-h-[14rem] rounded-none" />
      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
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
  /** Khi true hiển thị skeleton thay vì nội dung */
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
    <Link to={ROUTES.ROOM.DETAIL.replace(':id', item._id ?? item.slug)}>
      <Card className="group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border-0 bg-card">
        {/* Image */}
        <div className="relative w-full aspect-[4/3] min-h-[10rem] sm:min-h-[12rem] lg:min-h-[14rem] overflow-hidden">
          <img
            src={imageUrl}
            alt={item.thumbnail?.alt ?? translation?.name ?? item.code}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Discount badge */}
          {discountLabel && (
            <span className="absolute top-3 right-3 inline-flex items-center bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              {discountLabel}
            </span>
          )}

          {/* Price pill */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex flex-wrap items-baseline gap-1.5 bg-black/80 text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg backdrop-blur-sm">
              <span className="text-muted-foreground/90">{t('room.from')}</span>
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

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 min-w-0">
          {/* Type & Title */}
          <div className="mb-2">
            {item.roomType && (
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {item.roomType}
              </span>
            )}
            <h3 className="font-bold text-base sm:text-lg text-foreground line-clamp-2 mt-0.5">
              {translation?.name ?? item.code}
            </h3>
          </div>

          {/* Location */}
          {(hotelName || provinceName) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 min-w-0">
              <FaLocationDot className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">
                {[hotelName, provinceName].filter(Boolean).join(' • ')}
              </span>
            </div>
          )}

          {/* Meta: size & guests */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
            <span className="inline-flex items-center gap-1.5">
              <FaBed className="size-4 shrink-0 text-muted-foreground/80" />
              {item.roomSize ? `${item.roomSize} m²` : t('input.field_label.room')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaUserGroup className="size-4 shrink-0 text-muted-foreground/80" />
              {totalGuests} / {item.maxGuests} {t('room.guests')}
            </span>
          </div>

          {/* Rating */}
          {hasRating && (
            <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium px-2 py-0.5 rounded">
                <FaStar className="size-3 fill-current" />
                {item.ratingSummary!.average.toFixed(1)}
              </span>
              <span>
                ({item.ratingSummary!.total} {t('room.reviews')})
              </span>
            </div>
          )}

          {/* CTA */}
          <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wide group-hover:gap-3 transition-[gap] pt-1">
            {t('room.view_details')}
            <span aria-hidden>→</span>
          </span>
        </div>
      </Card>
    </Link>
  );
};

export default RoomCard;
