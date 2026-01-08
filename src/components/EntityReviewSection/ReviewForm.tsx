// ReviewForm.tsx
import { useForm } from 'react-hook-form';
import { Ratings } from '@components/ui/rating';
import { Button } from '@components/ui/button';
import { useSubmitReview } from '@/features/review/hooks';
import { ReviewEntityType } from '@/features/review/types';

interface Props {
  entityType: ReviewEntityType;
  entityId: string;
}

export default function ReviewForm({ entityType, entityId }: Props) {
  const { submitReview, isPending } = useSubmitReview();

  const { handleSubmit, setValue, watch, register } = useForm({
    defaultValues: { rating: 5, comment: '' },
  });

  const rating = watch('rating');

  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log('data', data);

        submitReview({ ...data, entityType, entityId });
      })}
      className="mt-8 space-y-4"
    >
      <h3 className="font-semibold text-lg">Leave a Review</h3>

      <Ratings rating={rating} onRate={(v) => setValue('rating', v)} />

      <textarea
        {...register('comment', { required: true })}
        className="w-full border rounded p-3"
        placeholder="Write your review..."
      />

      <Button loading={isPending}>Submit Review</Button>
    </form>
  );
}
