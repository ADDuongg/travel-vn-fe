import type { Hotel } from '@/features/hotels/types';
import { ReviewEntityType } from '@/features/review/types';
import EntityReviewSection from '@/components/EntityReviewSection/EntityReviewSection';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

const HotelReviews = ({
  hotel,
  paramId,
}: {
  hotel: Hotel;
  paramId?: string;
}) => {
  const { t } = useTranslation();
  const entityId = hotel._id || (hotel as { id?: string }).id || paramId || '';
  const total = hotel.ratingSummary?.total;

  if (!entityId) return null;

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
      <div className="rounded-2xl border border-[rgba(28,26,20,0.1)] p-4 shadow-sm sm:p-6 md:p-8">
        <EntityReviewSection
          entityType={ReviewEntityType.HOTEL}
          entityId={entityId}
          ratingSummary={hotel.ratingSummary ?? undefined}
        />
      </div>
    </section>
  );
};

export default HotelReviews;
