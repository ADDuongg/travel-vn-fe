import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { PageHero } from '@components/PageHero';
import { Button } from '@components/ui/button';
import { ResponsiveH2, ResponsiveH3, ResponsiveH4 } from '@components/ui/typography';
import { ROUTES } from '@/constants/router';
import { galleryCollections, vietnamRegions } from '@/mock';
import { SectionReveal } from '@/sections/home/SectionReveal';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Map, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&auto=format&fit=crop';

const GalleryPage = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <PageHero
        id="gallery-hero-heading"
        backgroundImage={HERO_IMAGE}
        badge={t('gallery.badge')}
        title={t('gallery.hero_title')}
        subtitle={t('gallery.hero_subtitle')}
      />

      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <SectionReveal>
          <Container>
            <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5 lg:items-start">
              <div className="text-center lg:col-span-3 lg:text-left">
                <ResponsiveH2 className="mb-4 text-balance text-foreground">
                  {t('gallery.context_title')}
                </ResponsiveH2>
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {t('gallery.context_desc')}
                </p>
              </div>
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Camera className="size-6" aria-hidden />
                  </div>
                  <ResponsiveH4 className="mb-2 text-foreground">{t('gallery.trust_title')}</ResponsiveH4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t('gallery.trust_desc')}
                  </p>
                  <div className="mt-5 border-t border-border/50 pt-5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MapPin className="size-5" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-sm font-medium text-foreground">
                          {t('gallery.local_title')}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                          {t('gallery.local_desc')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </SectionReveal>
      </section>

      {galleryCollections.map((collection, colIndex) => (
        <section
          key={collection.id}
          className={cn(
            'border-b border-border/40 py-20 md:py-28',
            colIndex % 2 === 0 ? 'bg-surface-300' : 'bg-background',
          )}
        >
          <SectionReveal>
            <Container>
              <div className="mb-8 text-center md:mb-10">
                <ResponsiveH3 className="font-dm-serif-display text-2xl text-foreground md:text-3xl">
                  {t(collection.titleKey)}
                </ResponsiveH3>
                <p className="mt-2 text-sm text-muted-foreground md:text-base">{t(collection.descKey)}</p>
              </div>
              <div className="grid min-h-0 grid-cols-1 gap-4 md:min-h-[480px] md:grid-cols-2 md:grid-rows-3">
                {collection.images.map((img, i) => (
                  <div
                    key={`${collection.id}-${i}`}
                    className={cn(
                      'group relative min-h-[200px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm',
                      // Masonry: first image tall left; 2–4 stack on the right (md+)
                      i === 0 && 'md:row-span-2 md:min-h-0',
                      i === 1 && 'md:col-start-2 md:row-start-1',
                      i === 2 && 'md:col-start-2 md:row-start-2',
                      i === 3 && 'md:col-start-2 md:row-start-3',
                    )}
                  >
                    <img
                      src={img.src}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#1c1a14]/80 via-[#1c1a14]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <p className="absolute inset-x-0 bottom-0 z-10 translate-y-2 p-3 text-left text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {t(img.captionKey)}
                    </p>
                  </div>
                ))}
              </div>
            </Container>
          </SectionReveal>
        </section>
      ))}

      <section className="border-b border-border/40 bg-surface-300 py-20 md:py-28">
        <SectionReveal>
          <Container>
            <div className="mb-8 text-center">
              <ResponsiveH3 className="text-foreground">{t('gallery.regions_cta')}</ResponsiveH3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {t('gallery.regions_cta_sub')}
              </p>
            </div>
            <div className="mx-auto max-w-5xl rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
              <p className="mb-6 text-center text-sm text-muted-foreground sm:text-left">
                {t('gallery.featured_title')}
              </p>
              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                {vietnamRegions.map((region) => (
                  <Link
                    key={region.id}
                    to={region.href}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-background px-4 py-4 shadow-sm transition-colors hover:border-primary/40 hover:bg-surface-100"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Map className="size-5" aria-hidden />
                    </div>
                    <div className="min-w-0 text-left">
                      <span className="block text-sm font-semibold text-foreground">
                        {t(region.nameKey)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t('home_page.region_spots', { count: region.destinationCount })}
                      </span>
                    </div>
                    <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </SectionReveal>
      </section>

      <section className="bg-background py-20 md:py-28">
        <SectionReveal>
          <Container>
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground shadow-md sm:px-10 sm:py-12 md:py-14">
              <ResponsiveH2 className="mb-3 text-balance text-primary-foreground">
                {t('gallery.cta_title')}
              </ResponsiveH2>
              <p className="mb-8 text-base text-primary-foreground/90 sm:text-lg">
                {t('gallery.cta_subtitle')}
              </p>
              <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-12 min-h-12 cursor-pointer rounded-xl bg-primary-foreground text-primary"
                >
                  <Link to={ROUTES.TOUR.INDEX} className="inline-flex items-center justify-center gap-2">
                    {t('gallery.cta_tours')}
                    <ArrowRight className="size-4 opacity-80" aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 min-h-12 cursor-pointer rounded-xl border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to={ROUTES.LIST_ROOMS} className="inline-flex items-center justify-center gap-2">
                    {t('gallery.cta_rooms')}
                    <ArrowRight className="size-4 opacity-80" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </SectionReveal>
      </section>
    </MainLayout>
  );
};

export default GalleryPage;
