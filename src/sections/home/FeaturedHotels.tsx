import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import useMediaQuery from '@/hooks/useMediaQuery';
import { chunkArray } from '@utils/index';
import { featuredHotels, type HotelCategory } from '@/mock';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { Ratings } from '@/components/ui/rating';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { cn } from '@/lib/utils';
import { SectionReveal } from './SectionReveal';

const formatVnd = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(
    n,
  );

export const FeaturedHotels = () => {
  const { t } = useTranslation();
  const [cat, setCat] = useState<HotelCategory | 'all'>('all');
  const isPC = useMediaQuery('(min-width: 1280px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1279px)');

  const filtered = useMemo(
    () =>
      cat === 'all' ? featuredHotels : featuredHotels.filter((h) => h.category === cat),
    [cat],
  );

  const chunkSize = isPC ? 3 : isTablet ? 2 : 1;
  const carouselGroups = chunkArray(filtered, chunkSize);

  const categories: (HotelCategory | 'all')[] = ['all', 'luxury', 'boutique', 'city', 'homestay'];

  return (
    <SectionReveal>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 text-center md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {t('home_page.hotels_badge')}
          </p>
          <h2 className="mt-2 font-dm-serif-display text-3xl font-bold text-foreground md:text-4xl">
            {t('home_page.featured_hotels_title')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
            {t('home_page.featured_hotels_subtitle')}
          </p>
        </div>

        <div
          className="mb-6 flex flex-wrap items-center justify-center gap-2"
          role="group"
          aria-label={t('home_page.hotel_filter_aria')}
        >
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                'cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-200',
                cat === c
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border/80 bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground',
              )}
            >
              {c === 'all' ? t('home_page.filter_all') : t(`home_page.filter_${c}`)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground">{t('home_page.hotels_empty')}</p>
        ) : (
          <Carousel
            className="min-h-[400px] md:min-h-[420px]"
            opts={{ align: 'start' }}
            showIndicators
          >
            <CarouselContent className="min-h-[360px]">
              {carouselGroups.map((group, index) => (
                <CarouselItem key={index} className="w-full">
                  <div
                    className={cn(
                      'grid w-full justify-items-stretch gap-4',
                      isPC && 'grid-cols-3',
                      isTablet && 'grid-cols-2',
                      !isPC && !isTablet && 'grid-cols-1',
                    )}
                  >
                    {group.map((item) => (
                      <Link
                        key={item.id}
                        to={`${ROUTES.LIST_HOTELS}?highlight=${item.id}`}
                        className={cn(
                          'group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/60 bg-card',
                          'shadow-[var(--shadow-card)] transition-all duration-300',
                          'hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]',
                        )}
                      >
                        <div className="relative aspect-[3/2] w-full overflow-hidden">
                          <img
                            src={item.image}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex flex-1 flex-col p-4 md:p-5">
                          <h3 className="font-dm-serif-display text-lg font-bold leading-snug text-foreground md:text-xl">
                            {item.name}
                          </h3>
                          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="size-3.5 shrink-0" aria-hidden />
                            {item.location}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Ratings
                              rating={item.stars}
                              variant="yellow"
                              totalStars={5}
                              readOnly
                              size={16}
                            />
                            <span className="text-xs text-muted-foreground">({item.reviewCount})</span>
                          </div>
                          <div className="mt-4 flex items-baseline gap-1 border-t border-border/60 pt-3">
                            <span className="font-dm-serif-display text-2xl font-bold text-primary">
                              {formatVnd(item.priceVnd)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {t('home_page.per_night')}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-border/60" />
            <CarouselNext className="border-border/60" />
          </Carousel>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            to={ROUTES.LIST_HOTELS}
            className="cursor-pointer text-sm font-semibold text-primary underline-offset-4 transition-colors hover:underline"
          >
            {t('home_page.see_all_hotels')}
          </Link>
        </div>
      </div>
    </SectionReveal>
  );
};

