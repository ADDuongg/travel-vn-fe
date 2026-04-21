import { useMemo } from 'react';
import { useReviewsQuery, useMyReviewQuery } from '@/features/review/hooks';
import { ReviewEntityType, ReviewStatus } from '@/features/review/types';
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
    if (!authUser || authUser._id !== myReview.userId) return reviews;
    if (myReview.status === ReviewStatus.APPROVED) {
      return reviews;
    }
    return [myReview, ...reviews];
  }, [reviews, myReview, authUser]);

  if (isLoading) return null;

  return (
    <ReviewSection
      reviews={mergedReviews}
      myReview={myReview ?? null}
      canReview={!!authUser}
      entityId={entityId}
      entityType={entityType}
      ratingSummary={ratingSummary}
    />
  );
}
