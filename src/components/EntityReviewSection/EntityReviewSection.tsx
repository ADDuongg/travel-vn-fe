import { useMemo } from 'react';
import { useReviewsQuery, useMyReviewQuery } from '@/features/review/hooks';
import { ReviewEntityType } from '@/features/review/types';
import { useAuthStore } from '@/stores/useAuthStore';
import ReviewSection from './ReviewSection';

interface Props {
  entityType: ReviewEntityType;
  entityId: string;
}

export default function EntityReviewSection({ entityType, entityId }: Props) {
  const authUser = useAuthStore((s) => s.authUser);

  const { data: reviews = [], isLoading } = useReviewsQuery({
    entityType,
    entityId,
  });

  const { data: myReview } = useMyReviewQuery({
    entityType,
    entityId,
  });
  console.log('reviews', reviews);

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
    />
  );
}
