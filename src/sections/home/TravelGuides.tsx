import { travelGuides } from '@/mock';
import { Button } from '@components/ui/button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { useTranslation } from 'react-i18next';
import { BookOpen, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionReveal } from './SectionReveal';

export const TravelGuides = () => {
  const { t } = useTranslation();

  return (
    <SectionReveal>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 text-center md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-hoi-an-gold">
            {t('home_page.guides_badge')}
          </p>
          <h2 className="mt-2 font-dm-serif-display text-3xl font-bold text-foreground md:text-4xl">
            {t('home_page.guides_title')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
            {t('home_page.guides_subtitle')}
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {travelGuides.map((guide) => (
            <li key={guide.id}>
              <Link
                to={guide.href}
                className={cn(
                  'group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border',
                  'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]',
                  guide.featured
                    ? 'border-hoi-an-gold/40 bg-gold-soft/50'
                    : 'border-border/60 bg-card',
                )}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={guide.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {guide.featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-hoi-an-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1c1a14]">
                      {t('home_page.guide_featured')}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {t(guide.categoryKey)}
                  </p>
                  <h3 className="mt-1 font-dm-serif-display text-lg font-bold leading-snug text-foreground line-clamp-2">
                    {t(guide.titleKey)}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{t(guide.excerptKey)}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border/40 pt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" aria-hidden />
                      {t('home_page.guide_read_time', { count: guide.readMinutes })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="size-3.5" aria-hidden />
                      {guide.author}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="cursor-pointer gap-2 rounded-full border-foreground/20 px-6"
          >
            <Link to={ROUTES.TOUR_GUIDE.INDEX}>
              <BookOpen className="size-4" />
              {t('home_page.see_all_guides')}
            </Link>
          </Button>
        </div>
      </div>
    </SectionReveal>
  );
};

