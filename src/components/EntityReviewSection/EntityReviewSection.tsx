import { useMemo } from 'react';
import { useReviewsQuery, useMyReviewQuery } from '@/features/review/hooks';
import { ReviewEntityType } from '@/features/review/types';
import { useAuthStore } from '@/stores/useAuthStore';
import ReviewSection from './ReviewSection';

import type { RatingSummary } from './ReviewSection';

interface Props {
  entityType: ReviewEntityType;
  entityId: string;
  /** Optional: from entity API (e.g. tour.ratingSummary) for header */
  ratingSummary?: RatingSummary | null;
}

export default function EntityReviewSection({
  entityType,
  entityId,
  ratingSummary,
}: Props) {
  const authUser = useAuthStore((s) => s.authUser);

  const { data: reviews = [], isLoading } = useReviewsQuery({
    entityType,
    entityId,
  });

  const { data: myReview } = useMyReviewQuery({
    entityType,
    entityId,
  });

  const mergedReviews = useMemo(() => {
    if (!myReview) return reviews;

    return [myReview, ...reviews.filter((r) => r.userId !== myReview.userId)];
  }, [reviews, myReview]);

  if (isLoading) return null;

  return (
    <ReviewSection
      reviews={mergedReviews}
      canReview={!!authUser}
      entityId={entityId}
      entityType={entityType}
      ratingSummary={ratingSummary}
    />
  );
}
