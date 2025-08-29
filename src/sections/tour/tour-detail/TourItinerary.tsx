import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@components/ui/accordion';

const TourItinerary: React.FC = () => {
  return (
    <section id="itinerary" className="mt-10">
      <h2 className="text-xl font-bold mb-4">Itinerary</h2>

      <Accordion
        type="single"
        collapsible
        className="w-full rounded-md space-y-4"
        defaultValue="day-1"
      >
        {/* Day 1 */}
        <AccordionItem value="day-1">
          <AccordionTrigger className="font-semibold">
            Day 1 - Arrive in Zürich, Switzerland
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 leading-relaxed p-2">
            We’ll meet at 4 p.m. at our hotel in Luzern (Lucerne) for a “Welcome
            to Switzerland” meeting. Then we’ll take a meandering evening walk
            through Switzerland’s most charming lakeside town, and get
            acquainted with one another over dinner together.
            <br />
            <span className="block mt-1 text-sm text-gray-500">
              Sleep in Luzern (2 nights). No bus. Walking: light.
            </span>
          </AccordionContent>
        </AccordionItem>

        {/* Day 2 */}
        <AccordionItem value="day-2">
          <AccordionTrigger className="font-semibold">
            Day 2 - Zürich–Biel/Bienne–Neuchâtel–Geneva
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 leading-relaxed p-2">
            Description for day 2...
          </AccordionContent>
        </AccordionItem>

        {/* Day 3 */}
        <AccordionItem value="day-3">
          <AccordionTrigger className="font-semibold">
            Day 3 - Enchanting Engelberg
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 leading-relaxed p-2">
            Description for day 3...
          </AccordionContent>
        </AccordionItem>

        {/* Day 4 */}
        <AccordionItem value="day-4">
          <AccordionTrigger className="font-semibold">
            Day 4 - Interlaken Area. Excursion to The Jungfrau Massif
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 leading-relaxed p-2">
            Description for day 4...
          </AccordionContent>
        </AccordionItem>

        {/* Day 5 */}
        <AccordionItem value="day-5">
          <AccordionTrigger className="font-semibold">
            Day 5 - Lake Geneva and Château de Chillon
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 leading-relaxed p-2">
            Description for day 5...
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default TourItinerary;
