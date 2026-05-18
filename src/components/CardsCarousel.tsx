import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import React, { useMemo } from 'react';

const BASIS_BASE = {
  1: 'basis-full',
  2: 'basis-1/2',
  3: 'basis-1/3',
  4: 'basis-1/4',
} as const;

const BASIS_BY_BP = {
  sm: {
    1: 'sm:basis-full',
    2: 'sm:basis-1/2',
    3: 'sm:basis-1/3',
    4: 'sm:basis-1/4',
  },
  md: {
    1: 'md:basis-full',
    2: 'md:basis-1/2',
    3: 'md:basis-1/3',
    4: 'md:basis-1/4',
  },
  lg: {
    1: 'lg:basis-full',
    2: 'lg:basis-1/2',
    3: 'lg:basis-1/3',
    4: 'lg:basis-1/4',
  },
  xl: {
    1: 'xl:basis-full',
    2: 'xl:basis-1/2',
    3: 'xl:basis-1/3',
    4: 'xl:basis-1/4',
  },
} as const;

type BasisCount = keyof typeof BASIS_BASE;

const toBasisCount = (n?: number): BasisCount => {
  if (n === 2 || n === 3 || n === 4) return n;
  return 1;
};

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

  itemsPerView = { base: 1, md: 2, lg: 3 },
}: CardCarouselProps<T>) {
  const getBasisClass = () => {

    const base = BASIS_BASE[toBasisCount(itemsPerView.base)];
    const sm = itemsPerView.sm ? BASIS_BY_BP.sm[toBasisCount(itemsPerView.sm)] : '';
    const md = itemsPerView.md ? BASIS_BY_BP.md[toBasisCount(itemsPerView.md)] : '';
    const lg = itemsPerView.lg ? BASIS_BY_BP.lg[toBasisCount(itemsPerView.lg)] : '';
    const xl = itemsPerView.xl ? BASIS_BY_BP.xl[toBasisCount(itemsPerView.xl)] : '';

    return [base, sm, md, lg, xl].filter(Boolean).join(' ');
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

