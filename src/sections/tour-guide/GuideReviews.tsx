import React from 'react';
import EntityReviewSection from '@/components/EntityReviewSection/EntityReviewSection';
import { ReviewEntityType } from '@/features/review/types';
import type { TourGuide } from '@/features/tour-guide/types';

interface GuideReviewsProps {
  guide: TourGuide | null | undefined;
}

/**
 * Reviews cho hướng dẫn viên – dùng chung EntityReviewSection.
 * API: GET /reviews?entityType=GUIDE&entityId=<guideId>, GET/POST /reviews/me, POST /reviews
 */
const GuideReviews: React.FC<GuideReviewsProps> = ({ guide }) => {
  if (!guide?._id) return null;

  return (
    <section id="reviews" className="mt-10">
      <EntityReviewSection
        entityType={ReviewEntityType.GUIDE}
        entityId={guide._id}
        ratingSummary={guide.ratingSummary ?? undefined}
      />
    </section>
  );
};

export default GuideReviews;
