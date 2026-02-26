import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/router';
import type {
  ProvinceRef,
  TourGuideListItem,
} from '@/features/tour-guide/types';
import { fmtMoney } from '@/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCircleCheck, FaStar } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

function getShortBio(item: TourGuideListItem, lang: string): string | null {
  const t =
    item.translations?.[lang] ?? item.translations?.vi ?? item.translations?.en;
  return t?.shortBio ?? t?.bio ?? null;
}

function getProvinceNames(
  provinces: TourGuideListItem['specializedProvinces'],
  lang: string,
): string[] {
  if (!provinces?.length) return [];
  return provinces
    .map((p) => {
      if (typeof p === 'string') return p;
      const names = (p as ProvinceRef).name as
        | { vi?: string; en?: string }
        | undefined;
      return names?.[lang as 'vi' | 'en'] ?? names?.vi ?? names?.en ?? '';
    })
    .filter(Boolean);
}

export function TourGuideCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-md flex flex-col h-full border-0">
      <Skeleton className="relative w-full aspect-[3/4] min-h-[14rem] rounded-none" />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-full max-w-[90%] rounded" />
        <Skeleton className="h-4 w-[75%] rounded" />
        <Skeleton className="h-4 w-28 rounded mt-auto pt-2" />
      </div>
    </Card>
  );
}

interface TourGuideCardProps {
  item: TourGuideListItem;
  lang?: string;
}

const TourGuideCard: React.FC<TourGuideCardProps> = ({ item, lang = 'vi' }) => {
  const { t } = useTranslation();
  const name = item.user?.fullName ?? t('tour_guide.defaultName');
  const shortBio = getShortBio(item, lang);
  const avatar =
    item.user?.avatar?.url ??
    item.gallery?.[0]?.url ??
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400';
  const rating = item.ratingSummary?.average ?? 0;
  const reviewCount = item.ratingSummary?.total ?? 0;
  const dailyRate = item.dailyRate ?? 0;
  const provinceNames = getProvinceNames(item.specializedProvinces, lang);
  const detailLink = ROUTES.TOUR_GUIDE.DETAIL.replace(':id', item._id);

  return (
    <Link to={detailLink}>
      <Card className="group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border-0 bg-white">
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {item.isVerified && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                <FaCircleCheck className="w-3.5 h-3.5" />
                {t('tour_guide.verified')}
              </span>
            </div>
          )}
          {rating > 0 && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white">
              <span className="inline-flex items-center gap-1 bg-black/50 rounded-full px-2 py-1 text-sm font-medium">
                <FaStar className="w-4 h-4 fill-amber-400" />
                {rating.toFixed(1)}
              </span>
              {reviewCount > 0 && (
                <span className="text-sm opacity-90">
                  ({reviewCount} {t('tour_guide.reviews_count')})
                </span>
              )}
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors mb-2">
            {name}
          </h3>
          {shortBio && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {shortBio}
            </p>
          )}
          {item.languages?.length > 0 && (
            <p className="text-xs text-gray-400 mb-2">
              {t('tour_guide.language_label')}: {item.languages.join(', ')}
            </p>
          )}
          {provinceNames.length > 0 && (
            <p className="text-xs text-gray-500 line-clamp-1 mb-3">
              {t('tour_guide.area_label')}:{' '}
              {provinceNames.slice(0, 3).join(', ')}
              {provinceNames.length > 3 ? '...' : ''}
            </p>
          )}
          {item.yearsOfExperience != null && item.yearsOfExperience > 0 && (
            <p className="text-sm text-gray-600 mb-2">
              {item.yearsOfExperience} {t('tour_guide.years_experience')}
            </p>
          )}
          <div className="mt-auto pt-2">
            {dailyRate > 0 ? (
              <span className="font-semibold text-primary">
                {fmtMoney(dailyRate, item.currency)}/{t('tour_guide.per_day')}
              </span>
            ) : (
              <span className="text-sm text-gray-500">
                {t('tour_guide.contact_for_price')}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TourGuideCard;
