import React from 'react';
import { BsArrowReturnRight } from 'react-icons/bs';
import { Card } from '@/components/ui/card';
import { useTourDetail } from './TourDetailContext';
import { useLanguage } from '@/hooks/useLanguage';

const TourExpect: React.FC = () => {
  const tour = useTourDetail();
  const { language } = useLanguage();

  if (!tour) return null;

  const t = tour.translations?.[language] ?? tour.translations?.vi ?? tour.translations?.en;
  const highlights = t?.highlights ?? [];

  if (highlights.length === 0) return null;

  return (
    <section id="expect" className="mt-10">
      <Card className="p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">What to Expect</h2>
        <ul className="space-y-3 text-paleGray">
          {highlights.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <BsArrowReturnRight size={18} className="text-blue-500 shrink-0" /> {item}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
};

export default TourExpect;
