import React from 'react';
import EntityReviewSection from '@/components/EntityReviewSection/EntityReviewSection';
import { ReviewEntityType } from '@/features/review/types';
import { useTourDetail } from './TourDetailContext';

/**
 * Reviews & rating for tour – reuses shared EntityReviewSection.
 * API: GET /reviews?entityType=TOUR&entityId=<tourId>, GET/POST /reviews/me, POST /reviews
 * @see docs/FE-API-TOUR-CLIENT.md, FE-API-TOUR.md
 */
const TourReviews: React.FC = () => {
  const tour = useTourDetail();

  if (!tour?._id) return null;

  return (
    <section id="reviews">
      <EntityReviewSection
        entityType={ReviewEntityType.TOUR}
        entityId={tour._id}
        ratingSummary={tour.ratingSummary ?? undefined}
      />
    </section>
  );
};

export default TourReviews;
