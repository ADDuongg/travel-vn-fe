import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useEditReview, useDeleteReview } from '@/features/review/hooks';
import {
  ReviewEntityType,
  ReviewStatus,
  type Review,
} from '@/features/review/types';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  StarPicker,
  StarRow,
  REVIEW_OD_FIELD,
  formatReviewDate,
  reviewDisplayInitials,
} from './reviewVisualPrimitives';

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
  const { t, i18n } = useTranslation();
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

  const displayName = review.isAnonymous
    ? t('entityReview.anonymous_display')
    : (review.user?.name?.trim() || t('entityReview.anonymous_display'));

  const dateLabel = formatReviewDate(review.createdAt, i18n.language);
  const ratingShown = isEditing
    ? (value.rating ?? 0)
    : (review.rating ?? 0);
  const starAria = t('entityReview.stars_row_aria', {
    rating: ratingShown,
  });

  const formPrefix = `review-edit-${review._id}`;

  return (
    <div
      className={cn(
        'rounded-[1.75rem] border p-6 shadow-[var(--shadow-soft)] md:p-8',
        isOwner
          ? 'border-forest/35 bg-sand-100/90'
          : 'border-charcoal/10 bg-sand-50',
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-full border border-charcoal/10 bg-sand-100 font-display text-lg text-charcoal"
          aria-hidden
        >
          {review.isAnonymous
            ? '?'
            : reviewDisplayInitials(
                review.user?.name?.trim() || displayName,
              )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-xl text-charcoal">{displayName}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45">
                {dateLabel}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isEditing ? (
                <StarPicker
                  idPrefix={formPrefix}
                  value={value.rating ?? 5}
                  onChange={(n) => setValue((p) => ({ ...p, rating: n }))}
                  label={t('entityReview.your_rating')}
                />
              ) : (
                <StarRow rating={ratingShown} ariaLabel={starAria} />
              )}

              {isOwner && !isEditing && review.deletedAt == null ? (
                <div className="flex flex-wrap gap-2">
                  {canEdit ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="rounded-full border border-charcoal/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-forest transition hover:border-forest/40"
                    >
                      {t('entityReview.edit')}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() =>
                      deleteReview({
                        id: review._id,
                        entityId,
                        entityType,
                      })
                    }
                    className="rounded-full border border-charcoal/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70 transition hover:border-sunset/40 hover:text-sunset-deep"
                  >
                    {t('entityReview.delete')}
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {isEditing ? (
            <textarea
              value={value.comment}
              onChange={(e) =>
                setValue((p) => ({ ...p, comment: e.target.value }))
              }
              className={cn(REVIEW_OD_FIELD, 'resize-y')}
              rows={4}
            />
          ) : (
            <p className="text-base leading-relaxed text-mist md:text-[1.05rem]">
              {review.comment}
            </p>
          )}

          {editErrorMessage ? (
            <p className="text-sm text-sunset-deep" role="alert">
              {editErrorMessage}
            </p>
          ) : null}

          {isEditing ? (
            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                type="button"
                size="sm"
                loading={isPending}
                className="rounded-full bg-charcoal px-6 text-sand-50 shadow-[var(--shadow-soft)] hover:bg-charcoal/90"
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
                className="rounded-full border border-charcoal/15 px-6 py-2.5 text-sm font-semibold text-charcoal/80 transition hover:border-charcoal/30"
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
