import type { Hotel } from '@/features/hotels/types';
import { ReviewEntityType } from '@/features/review/types';
import EntityReviewSection from '@/components/EntityReviewSection/EntityReviewSection';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const HotelReviews = ({
  hotel,
  paramId,
  variant = 'default',
}: {
  hotel: Hotel;
  paramId?: string;
  variant?: 'default' | 'editorial';
}) => {
  const { t } = useTranslation();
  const entityId = hotel._id || (hotel as { id?: string }).id || paramId || '';
  const total = hotel.ratingSummary?.total;

  if (!entityId) return null;

  const inner = (
    <div
      className={cn(
        variant === 'editorial'
          ? 'rounded-[1.35rem] border border-charcoal/10 bg-sand-50 p-4 shadow-soft sm:p-6 md:p-8'
          : 'rounded-2xl border border-[rgba(28,26,20,0.1)] p-4 shadow-sm sm:p-6 md:p-8',
      )}
    >
      <EntityReviewSection
        entityType={ReviewEntityType.HOTEL}
        entityId={entityId}
        ratingSummary={hotel.ratingSummary ?? undefined}
      />
    </div>
  );

  if (variant === 'editorial') {
    return inner;
  }

  return (
    <section id="reviews" className="scroll-mt-36 py-12 lg:py-16">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            className="text-2xl font-semibold text-[#1c1a14] sm:text-3xl"
            style={{
              fontFamily: 'var(--font-dm-serif-display, Georgia, serif)',
            }}
          >
            {t('hotel.detail.reviews_block_title', 'Guest reviews')}
          </h2>
          {total != null && total > 0 && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[rgba(28,26,20,0.6)]">
              <Star
                className="size-4 fill-[#c9922a] text-[#c9922a]"
                aria-hidden
              />
              {t('hotel.detail.reviews_count', {
                count: total,
                defaultValue: '{{count}} verified reviews',
              })}
            </p>
          )}
        </div>
      </div>
      {inner}
    </section>
  );
};

export default HotelReviews;

