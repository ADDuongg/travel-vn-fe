import { useState } from 'react';
import { Ratings } from '@components/ui/rating';
import { Button } from '@components/ui/button';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { useEditReview, useDeleteReview } from '@/features/review/hooks';
import {
  ReviewEntityType,
  ReviewStatus,
  type Review,
} from '@/features/review/types';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState({
    rating: review.rating,
    comment: review.comment,
  });

  const { editReview, isPending, isError, error, reset } = useEditReview();
  const { deleteReview } = useDeleteReview();

  const canEdit =
    isOwner &&
    review.status !== ReviewStatus.HIDDEN &&
    review.deletedAt == null;

  const errStatus = (error as { response?: { status?: number } } | null)
    ?.response?.status;
  const editErrorMessage =
    isError && errStatus === 403
      ? t('entityReview.error_edit_forbidden')
      : isError
        ? (error?.message ?? t('entityReview.error_edit_generic'))
        : null;

  return (
    <div className="relative border-b pb-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={review.user?.avatar || '/images/avatar-placeholder.png'}
            alt=""
            className="size-10 rounded-full"
          />
          <p className="font-semibold">{review.user?.name}</p>
        </div>

        {isOwner && !isEditing && review.deletedAt == null && (
          <div className="flex gap-2 text-sm">
            {canEdit && (
              <AiFillEdit
                className="cursor-pointer text-blue-600"
                aria-label={t('entityReview.edit')}
                onClick={() => setIsEditing(true)}
              />
            )}
            <AiFillDelete
              className="cursor-pointer text-red-500"
              aria-label={t('entityReview.delete')}
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

      <Ratings
        rating={value.rating ?? 5}
        readOnly={!isEditing}
        onRate={(v) => setValue((p) => ({ ...p, rating: v }))}
      />

      {isEditing ? (
        <textarea
          value={value.comment}
          onChange={(e) =>
            setValue((p) => ({ ...p, comment: e.target.value }))
          }
          className="mt-2 w-full rounded-lg border p-2 text-sm"
        />
      ) : (
        <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
      )}

      {editErrorMessage && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {editErrorMessage}
        </p>
      )}

      {isEditing && (
        <div className="mt-3 flex gap-3">
          <Button
            size="sm"
            loading={isPending}
            onClick={() => {
              editReview(
                {
                  ...value,
                  entityType,
                  entityId,
                },
                {
                  onSuccess: () => {
                    setIsEditing(false);
                    reset();
                  },
                },
              );
            }}
          >
            {t('entityReview.save')}
          </Button>

          <button
            type="button"
            className="text-sm text-gray-500"
            onClick={() => {
              setIsEditing(false);
              setValue({
                rating: review.rating,
                comment: review.comment,
              });
              reset();
            }}
          >
            {t('entityReview.cancel')}
          </button>
        </div>
      )}
    </div>
  );
}
