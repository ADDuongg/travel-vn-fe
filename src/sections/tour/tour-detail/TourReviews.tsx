import React from 'react';
import { useTourDetail } from './TourDetailContext';
const TourReviews: React.FC = () => {
  const tour = useTourDetail();
  const total = tour?.ratingSummary?.total ?? 0;
  const average = tour?.ratingSummary?.average ?? 0;

  if (total === 0) return null;

  return (
    <section id="reviews">
      <h2 className="text-xl font-bold mb-4">Reviews ({total})</h2>
      <p className="text-gray-500">
        Average rating: {average.toFixed(1)} / 5
      </p>
      {/* Phase 3 will add TourReviewModule - placeholder for now */}
    </section>
  );
};

export default TourReviews;
