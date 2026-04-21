import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CustomInput from '@components/CustomInput';
import { Ratings } from '@components/ui/rating';
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

export interface RatingSummary {
  average: number;
  total: number;
}

interface Props {
  reviews: Review[];
  /** Current user's review for this entity, if any */
  myReview: Review | null;
  canReview: boolean;
  entityId: string;
  entityType: ReviewEntityType;
  /** Optional: from entity (tour/room) API – used for header display */
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

  return (
    <section className="mt-6">
      <FormProvider {...methods}>
        <div className="mb-6 flex flex-wrap items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Ratings
              rating={displayRating}
              readOnly
              size={16}
              variant="yellow"
            />
            <span className="text-gray-500">
              {t(
                displayCount === 1
                  ? 'entityReview.reviews_count_one'
                  : 'entityReview.reviews_count_other',
                { count: displayCount },
              )}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <span className="font-semibold">{t('entityReview.sort_by')}</span>
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

      {myReview?.status === ReviewStatus.PENDING && (
        <Alert className="mb-6 rounded-xl border-amber-200 bg-amber-50/90">
          <Info className="size-4 text-amber-700" aria-hidden />
          <AlertTitle className="text-amber-900">
            {t('entityReview.banner_pending_title')}
          </AlertTitle>
          <AlertDescription className="text-amber-900/90">
            {t('entityReview.banner_pending_body')}
          </AlertDescription>
        </Alert>
      )}

      {myReview?.status === ReviewStatus.REJECTED && (
        <Alert variant="destructive" className="mb-6 rounded-xl">
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
        <Alert className="mb-6 rounded-xl border-slate-200 bg-slate-50">
          <EyeOff className="size-4 text-slate-600" aria-hidden />
          <AlertTitle>{t('entityReview.banner_hidden_title')}</AlertTitle>
          <AlertDescription>
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

      {showCreateForm && (
        <ReviewForm entityId={entityId} entityType={entityType} />
      )}
    </section>
  );
}
