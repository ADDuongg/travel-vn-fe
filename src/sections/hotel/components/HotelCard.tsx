import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FaLocationDot, FaStar } from 'react-icons/fa6';
import type { HotelOption } from '@/features/hotels/types';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { useTranslation } from 'react-i18next';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';

/** Skeleton placeholder đồng bộ layout với HotelCard (shadcn Skeleton) */
export function HotelCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-md flex flex-col h-full border-0 gap-0">
      <Skeleton className="relative w-full aspect-[4/3] min-h-[12rem] sm:min-h-[14rem] rounded-none" />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <Skeleton className="h-5 w-10 rounded-full" />
        <Skeleton className="h-6 w-full max-w-[90%] rounded" />
        <Skeleton className="h-4 w-[75%] rounded" />
        <Skeleton className="h-4 w-28 rounded mt-auto pt-2" />
      </div>
    </Card>
  );
}

function getHotelName(hotel: HotelOption, lang: string): string {
  return (
    hotel.translations?.[lang]?.name ??
    hotel.translations?.vi?.name ??
    hotel.translations?.en?.name ??
    hotel.slug
  );
}

function getProvinceName(hotel: HotelOption, lang: string): string | null {
  const province = hotel.provinceId;
  if (!province || typeof province === 'string') return null;
  const names = province.name as { vi?: string; en?: string } | undefined;
  return names?.[lang as 'vi' | 'en'] ?? names?.vi ?? names?.en ?? null;
}

interface HotelCardProps {
  item: HotelOption;
  lang?: string;
  /** Khi true hiển thị skeleton thay vì nội dung */
  loading?: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({ item, lang = 'vi', loading = false }) => {
  const { t } = useTranslation();
  if (loading) {
    return <HotelCardSkeleton />;
  }
  const name = getHotelName(item, lang);
  const provinceName = getProvinceName(item, lang);

  const thumbnail =
    (item as { thumbnail?: { url?: string } }).thumbnail?.url ??
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

  return (
    <Link to={ROUTES.HOTEL.DETAIL.replace(':id', item._id)}>
      <Card className="group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border-0 bg-white">
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <img
            src={thumbnail}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 z-[1]">
            <FavoriteButton
              entityType={FavoriteEntityType.HOTEL}
              entityId={item._id}
              initialIsFavorited={item.isFavorited}
              stopNavigation
              className="h-9 w-9 rounded-full"
            />
          </div>
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1 bg-amber-400/95 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
              <FaStar className="w-3 h-3 fill-current" />
              {(item as { starRating?: number }).starRating ?? 4}
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {name}
          </h3>
          {provinceName && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <FaLocationDot size={14} className="text-blue-600 shrink-0" />
              <span>{provinceName}</span>
            </div>
          )}
          <span className="mt-auto text-sm font-semibold text-blue-600 uppercase tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all">
            {t('hotel.view_details', 'View Details')}
            <span>→</span>
          </span>
        </div>
      </Card>
    </Link>
  );
};

export default HotelCard;
