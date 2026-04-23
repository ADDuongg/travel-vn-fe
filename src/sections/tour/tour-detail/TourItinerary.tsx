import React from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@components/ui/accordion';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import type { Tour } from '@/features/tours/types';

type TourItineraryProps = {
  tour: Tour;
};

const TourItinerary: React.FC<TourItineraryProps> = ({ tour }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  if (!tour?.itinerary?.length) return null;

  const items = tour.itinerary
    .slice()
    .sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <section id="itinerary" className="scroll-mt-40">
      <Card className="border border-[rgba(28,26,20,0.1)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <h2
          className="mb-6 font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14]"
          style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
        >
          {t('tour.detail.itinerary_title', 'Itinerary')}
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={`day-${items[0]?.dayNumber ?? 1}`}
        >
          {items.map((day) => {
            const tday =
              day.translations?.[language] ??
              day.translations?.vi ??
              day.translations?.en;
            const title = tday?.title ?? t('tour.detail.day', 'Day') + ' ' + day.dayNumber;
            const description = tday?.description ?? '';
            const meals = tday?.meals ?? [];
            const accommodation = tday?.accommodation;

            return (
              <AccordionItem
                key={day.dayNumber}
                value={`day-${day.dayNumber}`}
                className="border-b border-[rgba(28,26,20,0.08)] first:pt-0 last:border-0"
              >
                <AccordionTrigger
                  className="py-4 text-left hover:no-underline"
                  iconOpen={<Minus className="size-4 text-[#2d6a4f]" aria-hidden />}
                  iconClosed={<Plus className="size-4 text-[#2d6a4f]" aria-hidden />}
                >
                  <div className="flex items-center gap-3 pr-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#2d6a4f] bg-[#d4eae0] text-sm font-bold text-[#1e4d38]">
                      {day.dayNumber}
                    </span>
                    <span
                      className="font-['Playfair_Display',serif] text-base font-semibold text-[#1c1a14]"
                      style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
                    >
                      {title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-4 pl-0 text-sm leading-relaxed text-[rgba(28,26,20,0.75)] sm:pl-12">
                  {description}
                  {(meals.length > 0 || accommodation) && (
                    <p className="mt-3 text-xs text-[rgba(28,26,20,0.55)]">
                      {meals.length > 0 && (
                        <>
                          {t('tour.detail.meals_prefix', 'Meals')}: {meals.join(', ')}
                          {accommodation ? '. ' : ''}
                        </>
                      )}
                      {accommodation && (
                        <>
                          {t('tour.detail.stay_prefix', 'Stay')}: {accommodation}
                        </>
                      )}
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Card>
    </section>
  );
};

export default TourItinerary;
