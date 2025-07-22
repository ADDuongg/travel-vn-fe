import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import useMediaQuery from '@/hooks/useMediaQuery';
import Container from '@/layout/Container';
import { ToursItem } from '@/mock';
import TourCard from '@components/TourCard';
import { ButtonNavigate } from '@components/ui/button';
import { chunkArray } from '@utils/index';
import { Title } from '@components/ui/typography';
export const PopularTour = () => {
  const isPC = useMediaQuery('(min-width: 1280px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1279px)');

  const chunkSize = isPC ? 3 : isTablet ? 2 : 1;
  const carouselGroups = chunkArray(ToursItem, chunkSize);

  return (
    <Container>
      <div className="flex flex-col gap-10 items-center relative z-[2] w-full text-center">
        <Title>
          Popular <span className="text-primary">Tours</span>
        </Title>
        <Carousel
          className="h-[400px] md:h-[500px]"
          opts={{ align: 'start' }}
          showIndicators
        >
          <CarouselContent className="h-full">
            {carouselGroups.map((group, index) => (
              <CarouselItem key={index} className="w-full h-full">
                <div
                  className={`grid h-full justify-items-center gap-4 w-full ${
                    isPC
                      ? 'grid-cols-3'
                      : isTablet
                      ? 'grid-cols-2'
                      : 'grid-cols-1'
                  }`}
                >
                  {group.map((item) => (
                    <TourCard key={item.id} item={item} />
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <ButtonNavigate label="All Destinations" />
      </div>
    </Container>
  );
};
