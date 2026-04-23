import { Button } from '@components/ui/button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { cityExplorerStrip, DestinationItem } from '@/mock';
import { useTranslation } from 'react-i18next';
import { MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionReveal } from './SectionReveal';

export const TopDestination = () => {
  const { t } = useTranslation();

  return (
    <SectionReveal>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex flex-col gap-3 text-center md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {t('home_page.top_dest_badge')}
          </p>
          <h2 className="font-dm-serif-display text-3xl font-bold text-foreground md:text-4xl">
            {t('home_page.top_destinations_title')}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            {t('home_page.top_destinations_subtitle_vn')}
          </p>
        </div>

        {/* City strip */}
        <div
          className="mb-10 flex gap-3 overflow-x-auto pb-2 md:mb-12 md:justify-center md:overflow-visible md:pb-0"
          role="list"
          aria-label={t('home_page.cities_aria')}
        >
          {cityExplorerStrip.map((c) => (
            <Link
              key={c.id}
              to={`${ROUTES.DESTINATION.SEARCH}?city=${c.slug}`}
              role="listitem"
              className="group flex shrink-0 flex-col items-center gap-2 cursor-pointer"
            >
              <div
                className={cn(
                  'h-20 w-20 overflow-hidden rounded-full border-2 border-transparent ring-offset-2 ring-offset-[var(--background)] transition-all duration-200',
                  'md:h-[88px] md:w-[88px]',
                  'group-hover:scale-105 group-hover:border-primary group-hover:ring-2 group-hover:ring-primary/30',
                )}
              >
                <img
                  src={c.image}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="max-w-[5.5rem] text-center text-xs font-medium text-foreground">
                {t(c.nameKey)}
              </span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DestinationItem.map((item) => {
            const isTall = item.variant === 1;
            return (
              <Link
                key={item.id}
                to={`${ROUTES.DESTINATION.SEARCH}?city=${item.slug}`}
                className={cn(
                  'group relative col-span-1 flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/60',
                  'shadow-[var(--shadow-card)] transition-all duration-300',
                  'hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]',
                  isTall ? 'min-h-[300px] md:min-h-[340px]' : 'min-h-[260px] md:min-h-[280px]',
                )}
              >
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#1c1a14]/90 via-[#1c1a14]/35 to-transparent"
                  aria-hidden
                />
                <div className="absolute left-3 top-3">
                  <span
                    className="inline-flex items-center gap-1 rounded-full border border-[#c9922a]/50 bg-gold-soft/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6f1a]"
                    title={t(item.bestSeasonKey)}
                  >
                    <Sparkles className="size-3" aria-hidden />
                    {t(item.bestSeasonKey)}
                  </span>
                </div>
                <div className="relative z-10 mt-auto p-4 text-white sm:p-5">
                  <h3 className="font-dm-serif-display text-xl font-bold leading-tight sm:text-2xl">
                    {t(item.nameKey)}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-white/90">
                    {t(item.descriptionKey)}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-white/80">
                    <MapPin className="size-3.5" aria-hidden />
                    {t('home_page.tours_in_city', { count: item.tour_number })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="cursor-pointer rounded-full border-foreground/20 px-8"
          >
            <Link to={ROUTES.DESTINATION.SEARCH}>{t('home_page.see_all_destinations')}</Link>
          </Button>
        </div>
      </div>
    </SectionReveal>
  );
};
