import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { vietnamRegions } from '@/mock';
import { SectionReveal } from './SectionReveal';
import { cn } from '@/lib/utils';

export const ExploreByRegion = () => {
  const { t } = useTranslation();

  return (
    <SectionReveal>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 max-w-2xl md:mb-12">
          <h2 className="font-dm-serif-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.4rem]">
            {t('home_page.explore_region_title')}
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            {t('home_page.explore_region_subtitle')}
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
          {vietnamRegions.map((region) => (
            <li key={region.id}>
              <Link
                to={region.href}
                className={cn(
                  'group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl border border-border/60 p-6 md:min-h-[320px] md:p-8',
                  'cursor-pointer shadow-[var(--shadow-card)] transition-all duration-300',
                  'hover:-translate-y-0.5 hover:border-border hover:shadow-[var(--shadow-elevated)]',
                )}
              >
                <img
                  src={region.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#1c1a14]/90 via-[#1c1a14]/45 to-[#1c1a14]/20"
                  aria-hidden
                />
                <div className="relative z-10 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                    {t(region.shortKey)}
                  </p>
                  <h3 className="mt-1 font-dm-serif-display text-2xl font-bold md:text-3xl">
                    {t(region.nameKey)}
                  </h3>
                  <p className="mt-2 text-sm text-white/85">
                    {t('home_page.region_spots', { count: region.destinationCount })}
                  </p>
                  <span
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#f5e9d0] transition-colors group-hover:text-white"
                    aria-hidden
                  >
                    {t('home_page.explore_region_cta')}
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SectionReveal>
  );
};

