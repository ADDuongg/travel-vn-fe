import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useFeaturedToursQuery } from '@/features/tours/hooks';
import TourCard, { TourCardSkeleton } from '@/sections/tour/components/TourCard';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES } from '@/constants/router';
import { ChevronRight } from 'lucide-react';
import type { Tour } from '@/features/tours/types';

type TourRelatedProps = {
  tour: Tour;
  /** Parent wraps scroll target + headings (journey layout). */
  embedded?: boolean;
  /** Hide title row when parent supplies section heading (journey). */
  omitHeading?: boolean;
};

const TourRelated: React.FC<TourRelatedProps> = ({
  tour: currentTour,
  embedded,
  omitHeading,
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: relatedTours, isLoading } = useFeaturedToursQuery(6);

  const tours = (relatedTours ?? [])
    .filter((t) => t._id !== currentTour?._id)
    .slice(0, 8);

  if (tours.length === 0 && !isLoading) return null;

  const inner = (
    <>
      {!omitHeading ? (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <h2
            className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14] sm:text-3xl"
            style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
          >
            {t('tour.detail.related_title', 'You may also like')}
          </h2>
          <Link
            to={ROUTES.TOUR.INDEX}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#2d6a4f] transition hover:text-[#1e4d38]"
          >
            {t('tour.detail.see_all_tours', 'See all tours')}
            <ChevronRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="mb-6 flex justify-end">
          <Link
            to={ROUTES.TOUR.INDEX}
            className="inline-flex items-center gap-1 text-sm font-medium text-forest transition hover:text-forest-soft"
          >
            {t('tour.detail.see_all_tours', 'See all tours')}
            <ChevronRight className="size-4" />
          </Link>
        </div>
      )}
      <div className="-mx-1 flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-gutter:stable] sm:-mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[min(100%,320px)] shrink-0 snap-center sm:w-auto">
                <TourCardSkeleton />
              </div>
            ))
          : tours.map((tour) => (
              <div
                key={tour._id}
                className="w-[min(100%,320px)] shrink-0 snap-center sm:w-auto"
              >
                <TourCard item={tour} lang={language} />
              </div>
            ))}
      </div>
    </>
  );

  if (embedded) {
    return inner;
  }

  return <section>{inner}</section>;
};

export default TourRelated;
