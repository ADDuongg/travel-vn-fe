import { useState } from 'react';
import { Ratings } from '@components/ui/rating';
import { Button } from '@components/ui/button';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { useEditReview, useDeleteReview } from '@/features/review/hooks';
import { ReviewEntityType, type Review } from '@/features/review/types';

interface Props {
  review: Review;
  isOwner: boolean;
  entityId: string;
  entityType: ReviewEntityType;
}

export default function ReviewItem({
  review,
  isOwner,
  entityId,
  entityType,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState({
    rating: review.rating,
    comment: review.comment,
  });

  const { editReview, isPending } = useEditReview();
  const { deleteReview } = useDeleteReview();
  console.log('review', review?._id);

  return (
    <div className="border-b pb-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <img
            src={review.user?.avatar || '/images/avatar-placeholder.png'}
            className="w-10 h-10 rounded-full"
          />
          <p className="font-semibold">{review.user?.name}</p>
        </div>

        {isOwner && !isEditing && (
          <div className="flex gap-2 text-sm">
            <AiFillEdit
              className="cursor-pointer text-blue-600"
              onClick={() => setIsEditing(true)}
            />
            <AiFillDelete
              className="cursor-pointer text-red-500"
              onClick={() =>
                deleteReview({
                  id: review._id,
                  entityId,
                  entityType,
                })
              }
            />
          </div>
        )}
      </div>

      {/* Rating */}
      <Ratings
        rating={value.rating ?? 5}
        readOnly={!isEditing}
        onRate={(v) => setValue((p) => ({ ...p, rating: v }))}
      />

      {/* Comment */}
      {isEditing ? (
        <textarea
          value={value.comment}
          onChange={(e) => setValue((p) => ({ ...p, comment: e.target.value }))}
          className="w-full border rounded-lg p-2 text-sm mt-2"
        />
      ) : (
        <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
      )}

      {/* Actions */}
      {isEditing && (
        <div className="flex gap-3 mt-3">
          <Button
            size="sm"
            loading={isPending}
            onClick={() => {
              editReview({
                ...value!,
                entityType,
                entityId,
              });
              setIsEditing(false);
            }}
          >
            Save
          </Button>

          <button
            className="text-sm text-gray-500"
            onClick={() => {
              setIsEditing(false);
              setValue({
                rating: review.rating,
                comment: review.comment,
              });
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
