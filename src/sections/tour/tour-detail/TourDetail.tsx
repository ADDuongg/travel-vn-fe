import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import type { Tour } from '@/features/tours/types';

type TourDetailProps = {
  tour: Tour;
};

const TourDetail: React.FC<TourDetailProps> = ({ tour }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const tr =
    tour.translations?.[language] ??
    tour.translations?.vi ??
    tour.translations?.en;
  const description = tr?.description;
  const exclusions = tr?.exclusions ?? [];

  return (
    <section id="detail" className="scroll-mt-40">
      <Card className="border border-[rgba(28,26,20,0.1)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <h2
          className="mb-4 font-['Playfair_Display',serif] text-2xl font-bold tracking-[-0.02em] text-[#1c1a14] sm:text-[1.75rem]"
          style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
        >
          {t('tour.detail.overview', 'Overview')}
        </h2>
        {description && (
          <div className="prose-tour text-base leading-[1.65] text-[rgba(28,26,20,0.75)]">
            <p className="whitespace-pre-line">{description}</p>
          </div>
        )}

        {exclusions.length > 0 && (
          <div className="mt-8 rounded-xl border border-[#f2d5d9] bg-[#faf7f2] p-4 sm:p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#a50d25]">
              {t('tour.detail.not_included', "What's not included")}
            </h3>
            <ul className="space-y-2.5 text-sm text-[rgba(28,26,20,0.7)]">
              {exclusions.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <X
                    className="mt-0.5 size-4 shrink-0 text-[#c8102e]"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </section>
  );
};

export default TourDetail;

