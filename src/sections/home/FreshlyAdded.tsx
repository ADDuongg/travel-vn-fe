import React from 'react';
import CardWithRating, {
  type FreshlyTourItem,
} from '@components/CardWithRating';
import { ButtonNavigate } from '@components/ui/button';
import { freshlyTours } from '@/mock';
import { CardCarousel } from '@components/CardsCarousel';
import { Title } from '@components/ui/typography';
import Container from '@components/Container';

export const FreshlyAdded: React.FC = () => {
  return (
    <Container>
      <CardCarousel<FreshlyTourItem>
        title={
          <Title className="text-center text-4xl font-dm-serif-display font-bold mb-12">
            Freshly <span className="text-blue-500">Added</span>
          </Title>
        }
        items={freshlyTours}
        renderItem={(item) => <CardWithRating key={item.id} item={item} />}
        seeMoreButton={<ButtonNavigate label="See More" />}
      />
    </Container>
  );
};
