import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CustomInput from '@components/CustomInput';
import { Ratings } from '@components/ui/rating';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { ReviewEntityType, type Review } from '@/features/review/types';
import { useAuthStore } from '@/stores/useAuthStore';

export interface RatingSummary {
  average: number;
  total: number;
}

interface Props {
  reviews: Review[];
  canReview: boolean;
  entityId: string;
  entityType: ReviewEntityType;
  /** Optional: from entity (tour/room) API – used for header display */
  ratingSummary?: RatingSummary | null;
}

const sortOptions = [
  { label: 'Rating (High → Low)', value: 'rating_desc' },
  { label: 'Rating (Low → High)', value: 'rating_asc' },
  { label: 'Date (Newest First)', value: 'date_desc' },
  { label: 'Date (Oldest First)', value: 'date_asc' },
];

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: '5 Stars', value: '5' },
  { label: '4 Stars', value: '4' },
  { label: '3 Stars', value: '3' },
  { label: '2 Stars', value: '2' },
  { label: '1 Star', value: '1' },
];

export default function ReviewSection({
  reviews,
  canReview,
  entityId,
  entityType,
  ratingSummary,
}: Props) {
  const currentUserId = useAuthStore((s) => s.authUser?._id);

  const displayRating = ratingSummary?.average ?? (reviews.length ? (reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length) : 0);
  const displayCount = ratingSummary?.total ?? reviews.length;

  const methods = useForm({
    defaultValues: {
      sortBy: 'date_desc',
      filterBy: 'all',
    },
  });

  const { watch } = methods;
  const { sortBy, filterBy } = watch();

  const sortedReviews = React.useMemo(() => {
    let data = [...reviews];

    if (filterBy !== 'all') {
      data = data.filter((r) => r.rating === Number(filterBy));
    }

    switch (sortBy) {
      case 'rating_desc':
        data.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'rating_asc':
        data.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
        break;
      case 'date_desc':
        data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      case 'date_asc':
        data.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
        break;
    }

    return data;
  }, [reviews, sortBy, filterBy]);

  return (
    <section className="mt-6">
      {/* ===== Header ===== */}
      <FormProvider {...methods}>
        <div className="flex flex-wrap items-center justify-between border-b pb-3 mb-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Ratings rating={displayRating} readOnly size={16} variant="yellow" />
            <span className="text-gray-500">
              {displayCount} Reviews
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <span className="font-semibold">Sort By:</span>
            <CustomInput
              name="sortBy"
              type="select"
              options={sortOptions}
              className="w-44"
            />
            <CustomInput
              name="filterBy"
              type="select"
              options={filterOptions}
              className="w-28"
            />
          </div>
        </div>
      </FormProvider>

      <div className="space-y-6">
        {sortedReviews.map((r) => (
          <ReviewItem
            key={r._id}
            review={r}
            isOwner={r.userId === currentUserId}
            entityId={entityId}
            entityType={entityType}
          />
        ))}
      </div>

      {canReview && <ReviewForm entityId={entityId} entityType={entityType} />}
    </section>
  );
}
