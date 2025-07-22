import React, { useMemo } from 'react';
import CardWithRating from '@components/CardWithRating';
import type { FreshlyTourItem } from '@components/CardWithRating';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ButtonNavigate } from '@components/ui/button';
import { freshlyTours } from '@/mock';
import Container from '@/layout/Container';
import { Title } from '@components/ui/typography';

const renderCarouselItems = (items: FreshlyTourItem[]) => {
  return items.map((item, index) => (
    <CarouselItem className="max-w-xs flex-shrink-0" key={index}>
      <CardWithRating key={item.id} item={item} />
    </CarouselItem>
  ));
};

export const FreshlyAdded: React.FC = () => {
  const carouselItems = useMemo(() => renderCarouselItems(freshlyTours), []);

  return (
    <Container>
      <Title className="text-center text-4xl font-dm-serif-display font-bold mb-12">
        Freshly <span className="text-blue-500">Added</span>
      </Title>
      <Carousel opts={{ align: 'start' }} showIndicators isChunk>
        <CarouselContent>{carouselItems}</CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
      <div className="flex justify-center mt-10 md:mt-20">
        <ButtonNavigate label="See More" />
      </div>
    </Container>
  );
};
