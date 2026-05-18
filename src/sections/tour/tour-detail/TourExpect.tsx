import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import type { Tour } from '@/features/tours/types';

type TourExpectProps = {
  tour: Tour;
};

const TourExpect: React.FC<TourExpectProps> = ({ tour }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const tr =
    tour.translations?.[language] ?? tour.translations?.vi ?? tour.translations?.en;
  const highlights = tr?.highlights ?? [];

  if (highlights.length === 0) return null;

  return (
    <section id="expect" className="scroll-mt-40">
      <Card className="border border-[rgba(201,146,42,0.25)] bg-[#f5e9d0]/40 p-6 shadow-sm sm:p-8">
        <h2
          className="mb-4 font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14]"
          style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
        >
          {t('tour.detail.expect_title', 'What to expect')}
        </h2>
        <ul className="space-y-3 text-[rgba(28,26,20,0.8)]">
          {highlights.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg border border-[rgba(201,146,42,0.2)] bg-white/60 px-4 py-3 text-sm leading-relaxed"
            >
              <Sparkles
                className="mt-0.5 size-4 shrink-0 text-[#c9922a]"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
};

export default TourExpect;

