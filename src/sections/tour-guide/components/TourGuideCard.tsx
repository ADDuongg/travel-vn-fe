import { motion, useReducedMotion } from 'framer-motion';
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
import { cn } from '@/lib/utils';

function getShortBio(item: TourGuideListItem, lang: string): string | null {
  const tr =
    item.translations?.[lang] ?? item.translations?.vi ?? item.translations?.en;
  return tr?.shortBio ?? tr?.bio ?? null;
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
    <div className="grid min-h-0 overflow-hidden rounded-[2rem] border border-charcoal/10 bg-sand-50 shadow-[var(--shadow-soft)] md:grid-cols-2 md:gap-0">
      <Skeleton className="aspect-[3/4] min-h-[280px] w-full rounded-none md:min-h-[380px]" />
      <div className="flex flex-col gap-5 p-8 md:p-10">
        <Skeleton className="h-7 w-full max-w-[95%]" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-auto h-px w-full" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}

interface TourGuideCardProps {
  item: TourGuideListItem;
  lang?: string;
  /** Grid position for alternating split layout on medium+ screens */
  index?: number;
}

const TourGuideCard: React.FC<TourGuideCardProps> = ({
  item,
  lang = 'vi',
  index = 0,
}) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
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
  const imageOnRight = index % 2 === 1;

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="h-full min-h-0"
    >
      <Link
        to={detailLink}
        className="block h-full min-w-0 cursor-pointer rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-sand-100"
      >
        <Card
          className={cn(
            'group flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] border border-charcoal/10 bg-sand-50 shadow-[var(--shadow-soft)]',
            'transition-[box-shadow,border-color] duration-300 hover:border-charcoal/18 hover:shadow-[var(--shadow-elevated)]',
            'md:grid md:grid-cols-2 md:gap-0 md:items-stretch',
          )}
        >
          <div
            className={cn(
              'relative min-h-[300px] flex-1 overflow-hidden md:min-h-[380px]',
              imageOnRight && 'md:order-2',
            )}
          >
            <img
              src={avatar}
              alt=""
              className="h-full w-full object-cover transition duration-[1.1s] group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/28 to-transparent opacity-95 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-charcoal/22" />
            <div className="absolute top-4 left-4 z-[1]">
              <FavoriteButton
                entityType={FavoriteEntityType.GUIDE}
                entityId={item._id}
                initialIsFavorited={item.isFavorited}
                stopNavigation
                className="h-9 w-9 rounded-full border border-sand-50/25 bg-charcoal/35 text-sand-50 hover:bg-charcoal/45"
              />
            </div>
            {item.isVerified && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 rounded-full border border-sand-100/20 bg-forest/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sand-50">
                  <FaCircleCheck className="h-3 w-3" aria-hidden />
                  {t('tour_guide.verified')}
                </span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-6 text-sand-50 md:p-8">
              <p className="text-[10px] uppercase tracking-[0.28em] text-sand-100/78">
                {provinceNames.length > 0
                  ? provinceNames.slice(0, 2).join(' · ')
                  : t('tour_guide.count_guides', 'tour guides')}
              </p>
              <h3 className="mt-3 font-display text-[clamp(1.6rem,3.2vw,2.2rem)] leading-[1.06]">
                {name}
              </h3>
              {rating > 0 && (
                <p className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-sand-100/95">
                  <span className="inline-flex items-center gap-1 rounded-full bg-sand-50/18 px-2 py-1">
                    <FaStar className="h-3 w-3 fill-amber-300 text-amber-300" aria-hidden />
                    {rating.toFixed(1)}
                  </span>
                  {reviewCount > 0 ? (
                    <span className="normal-case tracking-normal text-sand-100/88">
                      {reviewCount} {t('tour_guide.reviews_count')}
                    </span>
                  ) : null}
                </p>
              )}
            </div>
          </div>

          <div
            className={cn(
              'flex min-h-0 flex-1 flex-col gap-5 p-8 md:justify-center md:gap-6 md:p-10 lg:p-12',
              imageOnRight && 'md:order-1',
            )}
          >
            {shortBio ? (
              <p className="line-clamp-4 text-[15px] leading-[1.7] text-mist">
                {shortBio}
              </p>
            ) : (
              <p className="text-sm italic text-charcoal/40">
                {t('tour_guide.card_no_bio', 'Open the spread to read their story.')}
              </p>
            )}

            <div className="space-y-2 border-t border-charcoal/10 pt-5">
              {item.languages && item.languages.length > 0 ? (
                <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/42">
                  {t('tour_guide.language_label')} ·{' '}
                  <span className="font-medium text-charcoal/70">{item.languages.join(', ')}</span>
                </p>
              ) : null}
              {provinceNames.length > 2 ? (
                <p className="line-clamp-2 text-xs leading-relaxed text-mist">
                  {provinceNames.join(' · ')}
                </p>
              ) : null}
              {item.yearsOfExperience != null && item.yearsOfExperience > 0 ? (
                <p className="text-xs text-charcoal/55">
                  {item.yearsOfExperience} {t('tour_guide.years_experience')}
                </p>
              ) : null}
            </div>

            <div className="mt-auto border-t border-charcoal/10 pt-5">
              {dailyRate > 0 ? (
                <p className="font-display text-base font-semibold tracking-tight text-charcoal/85">
                  <span className="text-sunset-deep">{fmtMoney(dailyRate, item.currency)}</span>
                  <span className="ml-1 text-sm font-normal text-charcoal/45">
                    / {t('tour_guide.per_day')}
                  </span>
                </p>
              ) : (
                <span className="text-sm text-mist">{t('tour_guide.contact_for_price')}</span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.article>
  );
};

export default TourGuideCard;
