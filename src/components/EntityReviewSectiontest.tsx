// components/review/EntityReviewSection.tsx

import { useMyReviewsQuery, useReviewsQuery } from '@/features/review/hooks';
import type { Review, ReviewEntityType } from '@/features/review/types';
import { useAuthStore } from '@/stores/useAuthStore';
import ReviewSection from './ReviewSectiontest';
interface Props {
  entityType: ReviewEntityType;
  entityId: string;
}

const mapReviewToUI = (reviews: Review[]) => {
  return reviews.map((r) => ({
    id: r._id,
    userId: r.userId,
    name: r.isAnonymous ? 'Anonymous' : r.user?.name ?? 'Unknown',
    avatarUrl: r.isAnonymous ? undefined : r.user?.avatar,
    rating: r.rating ?? 0,
    date: new Date(r.createdAt).toLocaleDateString(),
    comment: r.comment ?? '',
  }));
};

export const EntityReviewSection: React.FC<Props> = ({
  entityType,
  entityId,
}) => {
  const { data = [], isLoading } = useReviewsQuery({
    entityType,
    entityId,
  });
  const { data: myReviews = [], isLoading: isMyReviewsLoading } =
    useMyReviewsQuery({
      entityType,
      entityId,
    });

  const { authUser } = useAuthStore();
  if (isLoading) return null;

  return (
    <section id="reviews" className="mt-10">
      <h2 className="text-xl font-bold mb-6">Reviews</h2>
      <ReviewSection
        reviews={mapReviewToUI(data)}
        canReview={!!authUser}
        entityId={entityId}
        entityType={entityType}
      />
    </section>
  );
};
