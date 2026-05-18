import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubmitReview } from '@/features/review/hooks';
import { ReviewEntityType } from '@/features/review/types';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  StarPicker,
  REVIEW_OD_FIELD,
} from './reviewVisualPrimitives';

interface Props {
  entityType: ReviewEntityType;
  entityId: string;
}

export default function ReviewForm({ entityType, entityId }: Props) {
  const { t } = useTranslation();
  const {
    submitReview,
    isPending,
    isError,
    error,
    reset: resetMutation,
  } = useSubmitReview();

  const {
    handleSubmit,
    register,
    reset: resetForm,
    control,
  } = useForm({
    defaultValues: { rating: 5, comment: '' },
  });

  const errStatus = (error as { response?: { status?: number } } | null)
    ?.response?.status;
  const submitErrorMessage =
    isError && errStatus === 403
      ? t('entityReview.error_submit_forbidden')
      : isError
        ? (error?.message ?? t('entityReview.error_submit_generic'))
        : null;

  const formId = `entity-review-new-${entityId}`;

  return (
    <div className="rounded-[1.85rem] border border-charcoal/10 bg-sand-100/80 px-6 py-8 shadow-inner md:px-10 md:py-10">
      <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
        {t('entityReview.composer_kicker')}
      </p>
      <h3 className="mt-2 font-display text-2xl text-charcoal md:text-3xl">
        {t('entityReview.title_new')}
      </h3>

      <form
        onSubmit={handleSubmit((data) => {
          submitReview(
            { ...data, entityType, entityId },
            {
              onSuccess: () => {
                resetMutation();
                resetForm();
              },
            },
          );
        })}
        className="mt-8 space-y-6"
      >
        {submitErrorMessage ? (
          <Alert
            variant="destructive"
            className="rounded-[1.25rem] border border-sunset-deep/30 bg-[var(--red-soft)]"
          >
            <AlertDescription>{submitErrorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarPicker
              idPrefix={formId}
              value={field.value ?? 5}
              onChange={(v) => field.onChange(v)}
              label={t('entityReview.your_rating')}
            />
          )}
        />

        <label className="block space-y-2">
          <span className="text-[11px] uppercase tracking-[0.22em] text-charcoal/40">
            {t('entityReview.label_comment')}
          </span>
          <textarea
            {...register('comment', { required: true })}
            rows={4}
            className={cn(REVIEW_OD_FIELD, 'resize-y')}
            placeholder={t('entityReview.placeholder_comment')}
          />
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            loading={isPending}
            type="submit"
            className="rounded-full bg-charcoal px-8 py-3 text-sm font-semibold text-sand-50 shadow-[var(--shadow-soft)] hover:bg-charcoal/90"
          >
            {t('entityReview.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
}

