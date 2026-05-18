import React from 'react';
import { useTranslation } from 'react-i18next';
import { MagazineSectionHeading } from '@/components/home-editorial/MagazineSectionHeading';
import EntityReviewSection from '@/components/EntityReviewSection/EntityReviewSection';
import { ReviewEntityType } from '@/features/review/types';
import type { TourGuide } from '@/features/tour-guide/types';

interface GuideReviewsProps {
  guide: TourGuide | null | undefined;

  embedded?: boolean;
}

const GuideReviews: React.FC<GuideReviewsProps> = ({
  guide,
  embedded = false,
}) => {
  const { t } = useTranslation();
  if (!guide?._id) return null;

  const inner = (
    <div className="rounded-[1.35rem] border border-charcoal/10 bg-sand-50/95 p-4 shadow-[var(--shadow-soft)] sm:p-6 md:p-8">
      <EntityReviewSection
        entityType={ReviewEntityType.GUIDE}
        entityId={guide._id}
        ratingSummary={guide.ratingSummary ?? undefined}
      />
    </div>
  );

  if (embedded) {
    return inner;
  }

  return (
    <div className="rounded-[2rem] border border-charcoal/12 bg-charcoal/[0.025] px-4 py-12 sm:px-8 sm:py-14 md:px-10 md:py-16">
      <MagazineSectionHeading
        kicker={t('tour_guide.reviews_chapter_kicker', 'Voices')}
        title={t('tour_guide.reviews_section_title')}
        className="mb-8 space-y-4 sm:mb-10"
        titleClassName="text-charcoal"
      >
        <p className="max-w-[52ch] text-sm leading-relaxed text-mist">
          {t(
            'tour_guide.reviews_chapter_lead',
            'Travelers who walked with this guide — honest notes, not slogans.',
          )}
        </p>
      </MagazineSectionHeading>
      {inner}
    </div>
  );
};

export default GuideReviews;

