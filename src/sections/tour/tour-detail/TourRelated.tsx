import React from 'react';
import { useFeaturedToursQuery } from '@/features/tours/catalog-hooks';
import TourCard, { TourCardSkeleton } from '@/sections/tour/components/TourCard';
import { useTourDetail } from './TourDetailContext';
import { useLanguage } from '@/hooks/useLanguage';
const TourRelated: React.FC = () => {
  const currentTour = useTourDetail();
  const { language } = useLanguage();
  const { data: relatedTours, isLoading } = useFeaturedToursQuery(6);

  const tours = (relatedTours ?? []).filter((t) => t._id !== currentTour?._id).slice(0, 4);

  if (tours.length === 0 && !isLoading) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-6">Related Tours</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <TourCardSkeleton key={i} />)
          : tours.map((tour) => (
              <TourCard key={tour._id} item={tour} lang={language} />
            ))}
      </div>
    </section>
  );
};

export default TourRelated;
