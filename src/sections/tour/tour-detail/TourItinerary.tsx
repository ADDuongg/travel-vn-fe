import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@components/ui/accordion';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Card } from '@/components/ui/card';
import { useTourDetail } from './TourDetailContext';
import { useLanguage } from '@/hooks/useLanguage';

const TourItinerary: React.FC = () => {
  const tour = useTourDetail();
  const { language } = useLanguage();

  if (!tour?.itinerary?.length) return null;

  const items = tour.itinerary
    .slice()
    .sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <section id="itinerary" className="mt-10">
      <Card className="p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">Itinerary</h2>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={`day-${items[0]?.dayNumber ?? 1}`}
        >
          {items.map((day) => {
            const t = day.translations?.[language] ?? day.translations?.vi ?? day.translations?.en;
            const title = t?.title ?? `Day ${day.dayNumber}`;
            const description = t?.description ?? '';
            const meals = t?.meals ?? [];
            const accommodation = t?.accommodation;

            return (
              <AccordionItem key={day.dayNumber} value={`day-${day.dayNumber}`}>
                <AccordionTrigger
                  className="font-semibold text-base"
                  iconOpen={<AiOutlineMinus className="text-gray-700" />}
                  iconClosed={<AiOutlinePlus className="text-gray-700" />}
                >
                  Day {day.dayNumber} - {title}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed px-2 pb-4">
                  {description}
                  {(meals.length > 0 || accommodation) && (
                    <span className="block mt-1 text-sm text-gray-500">
                      {meals.length > 0 && `Meals: ${meals.join(', ')}. `}
                      {accommodation && `Accommodation: ${accommodation}`}
                    </span>
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
