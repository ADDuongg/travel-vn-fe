import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Card } from '@/components/ui/card';
import { useTourDetail } from './TourDetailContext';
import { useLanguage } from '@/hooks/useLanguage';

const TourDetail: React.FC = () => {
  const tour = useTourDetail();
  const { language } = useLanguage();

  if (!tour) return null;

  const t = tour.translations?.[language] ?? tour.translations?.vi ?? tour.translations?.en;
  const description = t?.description;
  const exclusions = t?.exclusions ?? [];

  return (
    <section id="detail" className="mt-10">
      <Card className="p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">Overview</h2>
        {description && (
          <div className="space-y-4 text-paleGray leading-relaxed">
            <p>{description}</p>
          </div>
        )}

        {exclusions.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-base mb-3">What&apos;s Not Included</h4>
            <ul className="space-y-2 text-paleGray">
              {exclusions.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <AiOutlineClose className="text-red-500 shrink-0" size={18} /> {item}
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
