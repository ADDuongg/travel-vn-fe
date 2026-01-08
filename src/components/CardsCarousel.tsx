// components/CardCarousel.tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import React, { useMemo } from 'react';

interface CardCarouselProps<T> {
  title?: React.ReactNode;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  seeMoreButton?: React.ReactNode;
  classNameContainer?: string;
  itemsPerView?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function CardCarousel<T>({
  title,
  items,
  renderItem,
  seeMoreButton,
  classNameContainer,
  itemsPerView = { base: 3, sm: 2, lg: 3 },
}: CardCarouselProps<T>) {
  const getBasisClass = () => {
    const map: Record<number, string> = {
      1: 'basis-full',
      2: 'basis-1/2',
      3: 'basis-1/3',
      4: 'basis-1/4',
    };

    return [
      map[itemsPerView.base ?? 3],
      itemsPerView.sm ? `sm:${map[itemsPerView.sm]}` : '',
      itemsPerView.md ? `md:${map[itemsPerView.md]}` : '',
      itemsPerView.lg ? `lg:${map[itemsPerView.lg]}` : '',
      itemsPerView.xl ? `xl:${map[itemsPerView.xl]}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  };

  const basisClass = getBasisClass();

  const carouselItems = useMemo(
    () =>
      items.map((item, index) => (
        <CarouselItem key={index} className={`${basisClass} flex-shrink-0`}>
          {renderItem(item, index)}
        </CarouselItem>
      )),
    [items, renderItem, basisClass],
  );

  return (
    <div className={classNameContainer}>
      {title && <>{title}</>}
      <Carousel opts={{ align: 'start' }} showIndicators isChunk>
        <CarouselContent>{carouselItems}</CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
      {seeMoreButton && (
        <div className="flex justify-center mt-10 md:mt-20">
          {seeMoreButton}
        </div>
      )}
    </div>
  );
}
