import React from 'react';
import { CardCarousel } from '@components/CardsCarousel';
import CardWithRating from '@components/CardWithRating';
import { freshlyTours } from '@/mock';
import { ButtonNavigate } from '@components/ui/button';
import { ResponsiveH2 } from '@components/ui/typography';

const TourRelated: React.FC = () => {
  return (
    <CardCarousel<any>
      classNameContainer="w-full flex flex-col"
      title={
        <ResponsiveH2 className="text-sm font-bold my-10">
          Related Tours
        </ResponsiveH2>
      }
      items={freshlyTours}
      renderItem={(item) => <CardWithRating key={item.id} item={item} />}
      seeMoreButton={<ButtonNavigate label="See More" />}
    />
  );
};

export default TourRelated;
