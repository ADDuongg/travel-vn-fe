import { useForm } from 'react-hook-form';
import { Ratings } from '@components/ui/rating';
import { Button } from '@components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubmitReview } from '@/features/review/hooks';
import { ReviewEntityType } from '@/features/review/types';
import { useTranslation } from 'react-i18next';

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

  const { handleSubmit, setValue, watch, register, reset: resetForm } = useForm({
    defaultValues: { rating: 5, comment: '' },
  });

  const rating = watch('rating');

  const errStatus = (error as { response?: { status?: number } } | null)
    ?.response?.status;
  const submitErrorMessage =
    isError && errStatus === 403
      ? t('entityReview.error_submit_forbidden')
      : isError
        ? (error?.message ?? t('entityReview.error_submit_generic'))
        : null;

  return (
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
      className="mt-8 space-y-4"
    >
      <h3 className="text-lg font-semibold">{t('entityReview.title_new')}</h3>

      {submitErrorMessage && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>{submitErrorMessage}</AlertDescription>
        </Alert>
      )}

      <Ratings rating={rating} onRate={(v) => setValue('rating', v)} />

      <textarea
        {...register('comment', { required: true })}
        className="w-full rounded border p-3"
        placeholder={t('entityReview.placeholder_comment')}
      />

      <Button loading={isPending} type="submit">
        {t('entityReview.submit')}
      </Button>
    </form>
  );
}
