import React from 'react';
import { useTranslation } from 'react-i18next';
import EntityReviewSection from '@/components/EntityReviewSection/EntityReviewSection';
import { ReviewEntityType } from '@/features/review/types';
import type { Tour } from '@/features/tours/types';

type TourReviewsProps = {
  tour: Tour;
};

const TourReviews: React.FC<TourReviewsProps> = ({ tour }) => {
  const { t } = useTranslation();

  return (
    <section id="reviews" className="scroll-mt-40">
      <h2
        className="mb-4 font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14] sm:mb-6 sm:text-3xl"
        style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
      >
        {t('tour.detail.reviews_block_title', 'Traveler reviews')}
      </h2>
      <div className="rounded-2xl border border-[rgba(28,26,20,0.1)] bg-white p-4 shadow-[var(--shadow-card)] sm:p-6">
        <EntityReviewSection
          entityType={ReviewEntityType.TOUR}
          entityId={tour._id}
          ratingSummary={tour.ratingSummary ?? undefined}
        />
      </div>
    </section>
  );
};

export default TourReviews;
