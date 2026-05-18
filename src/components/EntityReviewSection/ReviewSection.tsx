import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import {
  ReviewEntityType,
  ReviewStatus,
  type Review,
} from '@/features/review/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslation } from 'react-i18next';
import { Info, AlertCircle, EyeOff } from 'lucide-react';
import { StarRow, REVIEW_OD_SELECT } from './reviewVisualPrimitives';

export interface RatingSummary {
  average: number;
  total: number;
}

interface Props {
  reviews: Review[];

  myReview: Review | null;
  canReview: boolean;
  entityId: string;
  entityType: ReviewEntityType;

  ratingSummary?: RatingSummary | null;
}

export default function ReviewSection({
  reviews,
  myReview,
  canReview,
  entityId,
  entityType,
  ratingSummary,
}: Props) {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.authUser?._id);

  const approvedReviews = React.useMemo(
    () => reviews.filter((r) => r.status === ReviewStatus.APPROVED),
    [reviews],
  );

  const displayRating =
    ratingSummary?.average ??
    (approvedReviews.length
      ? approvedReviews.reduce((s, r) => s + (r.rating ?? 0), 0) /
        approvedReviews.length
      : 0);
  const displayCount = ratingSummary?.total ?? approvedReviews.length;

  const showCreateForm = canReview && !myReview;

  const methods = useForm({
    defaultValues: {
      sortBy: 'date_desc',
      filterBy: 'all',
    },
  });

  const { watch, register } = methods;
  const sortBy = watch('sortBy');
  const filterBy = watch('filterBy');

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
      default:
        break;
    }

    return data;
  }, [reviews, sortBy, filterBy]);

  const sortOptions = React.useMemo(
    () => [
      { label: t('entityReview.sort_rating_desc'), value: 'rating_desc' },
      { label: t('entityReview.sort_rating_asc'), value: 'rating_asc' },
      { label: t('entityReview.sort_date_desc'), value: 'date_desc' },
      { label: t('entityReview.sort_date_asc'), value: 'date_asc' },
    ],
    [t],
  );

  const filterOptions = React.useMemo(
    () => [
      { label: t('entityReview.filter_all'), value: 'all' },
      { label: t('entityReview.filter_star', { n: 5 }), value: '5' },
      { label: t('entityReview.filter_star', { n: 4 }), value: '4' },
      { label: t('entityReview.filter_star', { n: 3 }), value: '3' },
      { label: t('entityReview.filter_star', { n: 2 }), value: '2' },
      { label: t('entityReview.filter_star', { n: 1 }), value: '1' },
    ],
    [t],
  );

  const starsAria = t('entityReview.stars_avg_aria', {
    rating: Math.round(displayRating),
  });

  return (
    <section className="space-y-10">
      <FormProvider {...methods}>
        <div className="flex flex-col gap-8 rounded-[2rem] border border-charcoal/10 bg-sand-50/90 p-6 shadow-[var(--shadow-soft)] md:flex-row md:items-center md:justify-between md:gap-12 md:p-10">
          <div className="space-y-3">
            <p className="font-display text-5xl leading-none text-charcoal md:text-6xl">
              {displayRating > 0 ? displayRating.toFixed(1) : '—'}
            </p>
            <StarRow
              rating={Math.round(displayRating)}
              ariaLabel={starsAria}
            />
            <p className="text-sm text-mist">
              {t(
                displayCount === 1
                  ? 'entityReview.reviews_count_one'
                  : 'entityReview.reviews_count_other',
                { count: displayCount },
              )}
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end md:w-auto md:min-w-0 md:justify-end">
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:min-w-[200px]">
              <label
                htmlFor="entity-review-sort"
                className="text-[11px] uppercase tracking-[0.22em] text-charcoal/45"
              >
                {t('entityReview.sort_by')}
              </label>
              <select
                id="entity-review-sort"
                {...register('sortBy')}
                className={REVIEW_OD_SELECT}
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:min-w-[140px]">
              <label
                htmlFor="entity-review-filter"
                className="text-[11px] uppercase tracking-[0.22em] text-charcoal/45"
              >
                {t('entityReview.filter_by')}
              </label>
              <select
                id="entity-review-filter"
                {...register('filterBy')}
                className={REVIEW_OD_SELECT}
              >
                {filterOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {myReview?.status === ReviewStatus.PENDING && (
          <Alert className="rounded-[1.25rem] border border-amber-200/80 bg-amber-50/90 shadow-inner">
            <Info className="size-4 text-amber-800" aria-hidden />
            <AlertTitle className="text-amber-950">
              {t('entityReview.banner_pending_title')}
            </AlertTitle>
            <AlertDescription className="text-amber-950/90">
              {t('entityReview.banner_pending_body')}
            </AlertDescription>
          </Alert>
        )}

        {myReview?.status === ReviewStatus.REJECTED && (
          <Alert
            variant="destructive"
            className="rounded-[1.25rem] border border-sunset-deep/30 bg-[var(--red-soft)]"
          >
            <AlertCircle className="size-4" aria-hidden />
            <AlertTitle>{t('entityReview.banner_rejected_title')}</AlertTitle>
            <AlertDescription>
              {myReview.rejectReason?.trim()
                ? t('entityReview.banner_rejected_reason', {
                    reason: myReview.rejectReason.trim(),
                  })
                : t('entityReview.banner_rejected_body')}
            </AlertDescription>
          </Alert>
        )}

        {myReview?.status === ReviewStatus.HIDDEN && (
          <Alert className="rounded-[1.25rem] border border-charcoal/15 bg-sand-100/90 shadow-inner">
            <EyeOff className="size-4 text-charcoal/60" aria-hidden />
            <AlertTitle className="text-charcoal">
              {t('entityReview.banner_hidden_title')}
            </AlertTitle>
            <AlertDescription className="text-mist">
              {myReview.hiddenReason?.trim()
                ? t('entityReview.banner_hidden_reason', {
                    reason: myReview.hiddenReason.trim(),
                  })
                : t('entityReview.banner_hidden_body')}
            </AlertDescription>
          </Alert>
        )}

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

        {showCreateForm ? (
          <ReviewForm entityId={entityId} entityType={entityType} />
        ) : null}
      </FormProvider>
    </section>
  );
}

