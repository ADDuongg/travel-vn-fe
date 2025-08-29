import React from 'react';
import ReviewSection from '@components/ReviewSection';

const TourReviews: React.FC = () => {
  return (
    <section id="reviews" className="mt-10">
      <h2 className="text-xl font-bold mb-6">Reviews</h2>
      <ReviewSection
        reviews={[
          {
            id: 1,
            name: 'Liam Davis',
            role: 'Solo Traveller',
            rating: 5,
            date: 'April 6, 2022',
            comment:
              'I am so happy, my dear friend, so absorbed in the exquisite sense...',
          },
        ]}
      />
    </section>
  );
};

export default TourReviews;
