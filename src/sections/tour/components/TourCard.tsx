import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FaLocationDot, FaStar } from 'react-icons/fa6';
import { Ratings } from '@/components/ui/rating';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { fmtMoney } from '@/utils';
import { caculateSalePrice } from '@/utils';
import type { TourListItem } from '@/features/tours/catalog-types';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';

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

function getMainDestinationName(tour: TourListItem, lang: string): string | null {
  const main = tour.destinations?.find((d) => d.isMainDestination);
  const province = main?.provinceId;
  if (!province || typeof province === 'string') return null;
  const names = province.name as { vi?: string; en?: string } | undefined;
  return names?.[lang as 'vi' | 'en'] ?? names?.vi ?? names?.en ?? null;
}

export function TourCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-md flex flex-col h-full border-0">
      <Skeleton className="relative w-full aspect-[4/3] min-h-[12rem] rounded-none" />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-6 w-full max-w-[90%] rounded" />
        <Skeleton className="h-4 w-[75%] rounded" />
        <Skeleton className="h-4 w-28 rounded mt-auto pt-2" />
      </div>
    </Card>
  );
}

interface TourCardProps {
  item: TourListItem;
  lang?: string;
}

const TourCard: React.FC<TourCardProps> = ({ item, lang = 'vi' }) => {
  const name = getTourName(item, lang);
  const shortDesc = getShortDescription(item, lang);
  const destinationName = getMainDestinationName(item, lang);
  const thumbnail =
    item.thumbnail?.url ??
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
  const rating = item.ratingSummary?.average ?? 0;
  const reviewCount = item.ratingSummary?.total ?? 0;
  const basePrice = item.pricing?.basePrice ?? 0;
  const salePercent =
    item.sale?.isActive && item.sale.type === 'PERCENT' ? item.sale.value : 0;
  const salePrice = salePercent ? caculateSalePrice(basePrice, salePercent) : null;
  const { days, nights } = item.duration ?? { days: 0, nights: 0 };

  const linkTo = ROUTES.TOUR.DETAIL.replace(':slug', item.slug);

  return (
    <Link to={linkTo}>
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
              entityType={FavoriteEntityType.TOUR}
              entityId={item._id}
              initialIsFavorited={item.isFavorited}
              stopNavigation
              className="h-9 w-9 rounded-full"
            />
          </div>
          {(salePercent > 0 || item.sale?.isActive) && (
            <div className="absolute top-4 right-14">
              <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                {salePercent > 0 ? `${salePercent}% Off` : 'Special Offer'}
              </span>
            </div>
          )}
          {rating > 0 && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1 bg-amber-400/95 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
                <FaStar className="w-3 h-3 fill-current" />
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {name}
          </h3>
          {shortDesc && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
              {shortDesc}
            </p>
          )}
          {(days > 0 || destinationName) && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
              {days > 0 && (
                <span>
                  {days}D/{nights}N
                </span>
              )}
              {destinationName && (
                <span className="flex items-center gap-1">
                  <FaLocationDot size={14} className="text-primary shrink-0" />
                  {destinationName}
                </span>
              )}
            </div>
          )}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
              <Ratings
                rating={rating}
                variant="yellow"
                totalStars={5}
                readOnly
                size={12}
              />
              <span>({reviewCount} reviews)</span>
            </div>
          )}
          <div className="mt-auto flex items-baseline gap-2">
            {salePrice != null && (
              <span className="text-sm text-gray-400 line-through">
                {fmtMoney(basePrice)}
              </span>
            )}
            <span className="font-semibold text-primary">
              {fmtMoney(salePrice ?? basePrice)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TourCard;
