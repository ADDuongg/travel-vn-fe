import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CustomInput from '@components/CustomInput';
import { Ratings } from '@components/ui/rating';
import { Button } from '@components/ui/button';
import {
  useDeleteReview,
  useEditReview,
  useSubmitReview,
} from '@/features/review/hooks';
import { ReviewEntityType } from '@/features/review/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

/* ================= TYPES ================= */

interface UIReview {
  id: string;
  userId: string;
  name: string;
  role?: string;
  avatarUrl?: string;
  rating: number;
  date: string;
  comment: string;
}

interface ReviewSectionProps {
  reviews: UIReview[];
  canReview?: boolean;
  entityId: string;
  entityType: ReviewEntityType;
}

interface ReviewFormValues {
  entityType: ReviewEntityType;
  entityId: string;

  rating?: number;
  comment?: string;

  isAnonymous?: boolean;
}

/* ================= OPTIONS ================= */

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

/* ================= COMPONENT ================= */

const ReviewSection11: React.FC<ReviewSectionProps> = ({
  reviews,
  canReview = false,
  entityId,
  entityType,
}) => {
  /* ===== SORT / FILTER FORM ===== */
  const methods = useForm({
    defaultValues: {
      sortBy: 'date_desc',
      filterBy: 'all',
    },
  });
  const { submitReview, isPending } = useSubmitReview();
  const { editReview, isPending: isEditPending } = useEditReview();
  const { deleteReview } = useDeleteReview();
  const { watch } = methods;
  const { sortBy, filterBy } = watch();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState<{
    rating: number;
    comment: string;
  } | null>(null);
  const currentUserId = useAuthStore((s) => s.authUser?._id);
  /* ===== SUBMIT FORM ===== */
  const reviewForm = useForm<ReviewFormValues>({
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  const { handleSubmit, setValue, watch: watchReview } = reviewForm;
  const rating = watchReview('rating');

  /* ===== SORT LOGIC ===== */
  const sortedReviews = React.useMemo(() => {
    let data = [...reviews];

    if (filterBy !== 'all') {
      data = data.filter((r) => r.rating === Number(filterBy));
    }

    if (sortBy === 'rating_desc') data.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'rating_asc') data.sort((a, b) => a.rating - b.rating);
    if (sortBy === 'date_desc')
      data.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    if (sortBy === 'date_asc')
      data.sort((a, b) => +new Date(a.date) - +new Date(b.date));

    return data;
  }, [reviews, sortBy, filterBy]);

  /* ===== SUBMIT HANDLER ===== */
  const handleReviewSubmit = (data: ReviewFormValues) => {
    const payload = {
      ...data,
      entityType,
      entityId,
      isAnonymous: true,
    };
    submitReview(payload);
    reviewForm.reset({ rating: 5, comment: '' });
  };
  const onEditReview = (review: UIReview) => {
    setEditingId(review.id);
    setEditValue({
      rating: review.rating,
      comment: review.comment,
    });
  };

  const onDeleteReview = (id: string) => {
    deleteReview({ id, entityType, entityId });
  };

  return (
    <section className="mt-10">
      <FormProvider {...methods}>
        <div className="flex flex-wrap items-center justify-between border-b pb-3 mb-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Ratings rating={4.8} readOnly size={16} variant="yellow" />
            <span className="text-gray-500">{reviews.length} Reviews</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
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
        {sortedReviews.map((r) => {
          const isOwner = r.userId === currentUserId;
          const isEditing = editingId === r.id;

          return (
            <div key={r.id} className="border-b pb-6 relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={r.avatarUrl || '/images/avatar-placeholder.png'}
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="font-semibold">{r.name}</p>
                </div>

                {isOwner && !isEditing && (
                  <div className="flex gap-2 text-sm">
                    <AiFillEdit
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => onEditReview(r)}
                    />

                    <AiFillDelete
                      className="text-red-500 hover:underline cursor-pointer"
                      onClick={() => onDeleteReview(r.id)}
                    />
                  </div>
                )}
              </div>

              {isEditing ? (
                <Ratings
                  rating={editValue!.rating}
                  size={16}
                  variant="yellow"
                  onRate={(v) =>
                    setEditValue((prev) => prev && { ...prev, rating: v })
                  }
                />
              ) : (
                <Ratings
                  rating={r.rating}
                  readOnly
                  size={16}
                  variant="yellow"
                />
              )}

              {isEditing ? (
                <textarea
                  value={editValue!.comment}
                  onChange={(e) =>
                    setEditValue(
                      (prev) => prev && { ...prev, comment: e.target.value },
                    )
                  }
                  className="w-full border rounded-lg p-2 text-sm mt-2"
                />
              ) : (
                <p className="text-sm text-gray-700 mt-2">{r.comment}</p>
              )}

              {isEditing && (
                <div className="flex gap-3 mt-3">
                  <Button
                    size="sm"
                    loading={isEditPending}
                    onClick={() => {
                      editReview({
                        ...editValue!,
                        entityType,
                        entityId,
                      });
                      setEditingId(null);
                    }}
                  >
                    Save
                  </Button>

                  <button
                    className="text-sm text-gray-500"
                    onClick={() => {
                      setEditingId(null);
                      setEditValue(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {canReview ? (
        <FormProvider {...reviewForm}>
          <form
            onSubmit={handleSubmit(handleReviewSubmit)}
            className="mt-10 pt-6 space-y-4"
          >
            <h3 className="text-lg font-semibold">Leave a Review</h3>

            <div className="flex items-center gap-3">
              <Ratings
                rating={rating ?? 5}
                size={22}
                variant="yellow"
                onRate={(value) => setValue('rating', value)}
              />
              <span className="text-sm text-gray-500">{rating} Stars</span>
            </div>

            <textarea
              {...reviewForm.register('comment', { required: true })}
              placeholder="Write your review here..."
              className="w-full min-h-[120px] border rounded-lg p-3 text-sm"
            />

            <Button type="submit" loading={isPending} disabled={!!editingId}>
              Submit Review
            </Button>
          </form>
        </FormProvider>
      ) : (
        <p className="mt-8 text-sm text-gray-500">
          Please login to leave a review.
        </p>
      )}
    </section>
  );
};

export default ReviewSection11;
