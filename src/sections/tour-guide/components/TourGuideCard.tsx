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
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { FavoriteEntityType } from '@/features/favorites/types';

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
  return provinces.flatMap((p) => {
    if (typeof p === 'string') return p ? [p] : [];
    const names = (p as ProvinceRef).name as
      | { vi?: string; en?: string }
      | undefined;
    const label = names?.[lang as 'vi' | 'en'] ?? names?.vi ?? names?.en ?? '';
    return label ? [label] : [];
  });
}

export function TourGuideCardSkeleton() {
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
    <Link to={detailLink} className="block h-full min-w-0 cursor-pointer">
      <Card className="tour-card-premium group flex h-full min-h-0 flex-col overflow-hidden rounded-[0.75rem] border border-[rgba(28,26,20,0.1)] bg-white shadow-[var(--shadow-card)] transition-[box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[rgba(28,26,20,0.2)] hover:shadow-[var(--shadow-elevated)]">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <img
            src={avatar}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a14]/50 via-[#1c1a14]/0 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          <div className="absolute top-3 left-3 z-[1]">
            <FavoriteButton
              entityType={FavoriteEntityType.GUIDE}
              entityId={item._id}
              initialIsFavorited={item.isFavorited}
              stopNavigation
              className="h-9 w-9 rounded-full"
            />
          </div>
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

        <div className="flex flex-1 flex-col p-5">
          <h3
            className="font-['Playfair_Display',Georgia,serif] text-[1.38rem] font-semibold leading-[1.3] tracking-[-0.01em] text-[#1c1a14] line-clamp-2 transition-colors duration-200 group-hover:text-[#c8102e]"
            style={{ fontFamily: 'var(--font-dm-serif-display, Playfair Display, Georgia, serif)' }}
          >
            {name}
          </h3>
          {shortBio && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[rgba(28,26,20,0.6)]">
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
          <div className="mt-auto border-t border-[rgba(28,26,20,0.08)] pt-4">
            {dailyRate > 0 ? (
              <span className="font-semibold text-[#c8102e]">
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
