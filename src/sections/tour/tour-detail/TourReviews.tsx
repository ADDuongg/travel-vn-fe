import React from 'react';
import { useTranslation } from 'react-i18next';
import EntityReviewSection from '@/components/EntityReviewSection/EntityReviewSection';
import { ReviewEntityType } from '@/features/review/types';
import type { Tour } from '@/features/tours/types';

type TourReviewsProps = {
  tour: Tour;

  embedded?: boolean;
};

const TourReviews: React.FC<TourReviewsProps> = ({ tour, embedded }) => {
  const { t } = useTranslation();

  const block = (
    <>
      {!embedded ? (
        <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-charcoal sm:mb-6 sm:text-3xl md:text-4xl">
          {t('tour.detail.reviews_block_title', 'Traveler reviews')}
        </h2>
      ) : null}
      <div className="rounded-[2rem] border border-charcoal/10 bg-sand-50/90 p-4 shadow-[var(--shadow-soft)] sm:p-6 md:p-8">
        <EntityReviewSection
          entityType={ReviewEntityType.TOUR}
          entityId={tour._id}
          ratingSummary={tour.ratingSummary ?? undefined}
        />
      </div>
    </>
  );

  if (embedded) {
    return block;
  }

  return <section id="reviews" className="scroll-mt-40">{block}</section>;
};

export default TourReviews;

