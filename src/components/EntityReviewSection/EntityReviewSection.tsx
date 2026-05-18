import { useMemo } from 'react';
import { useReviewsQuery, useMyReviewQuery } from '@/features/review/hooks';
import { ReviewEntityType, ReviewStatus } from '@/features/review/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { Skeleton } from '@/components/ui/skeleton';
import ReviewSection from './ReviewSection';

import type { RatingSummary } from './ReviewSection';

interface Props {
  entityType: ReviewEntityType;
  entityId: string;

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

  if (isLoading) {
    return (
      <div className="space-y-10 py-1" aria-busy aria-label="Loading reviews">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-charcoal/10 bg-sand-50/90 p-6 shadow-[var(--shadow-soft)] md:flex-row md:items-center md:justify-between md:p-10">
          <div className="space-y-3">
            <Skeleton className="h-14 w-24 rounded-xl md:h-16 md:w-28" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48 max-w-full" />
          </div>
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-end md:w-auto">
            <Skeleton className="h-[52px] min-w-[200px] rounded-2xl" />
            <Skeleton className="h-[52px] min-w-[140px] rounded-2xl" />
          </div>
        </div>
        <Skeleton className="min-h-[200px] w-full rounded-[1.75rem]" />
        <Skeleton className="min-h-[200px] w-full rounded-[1.75rem]" />
      </div>
    );
  }

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

