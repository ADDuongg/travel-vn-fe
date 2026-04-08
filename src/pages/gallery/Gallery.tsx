import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { Button } from '@components/ui/button';
import { ResponsiveH1, ResponsiveH2, ResponsiveH3, ResponsiveH4 } from '@components/ui/typography';
import { ROUTES } from '@/constants/router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Map, ArrowRight } from 'lucide-react';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop', alt: 'Vietnam landscape' },
  { src: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop', alt: 'Ha Long Bay' },
  { src: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop', alt: 'Hoi An' },
  { src: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop', alt: 'Vietnam travel' },
  { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', alt: 'Hotel' },
  { src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop', alt: 'Travel' },
];

const featuredRegions = [
  { key: 'featured_north', Icon: Map },
  { key: 'featured_central', Icon: Map },
  { key: 'featured_south', Icon: Map },
];

const GalleryPage = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      {/* Hero — same pattern as Contact / About */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-primary/90 to-slate-800 text-primary-foreground"
        aria-labelledby="gallery-hero-heading"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')] bg-cover bg-center opacity-20" />
        <Container className="relative py-24 text-center md:py-32">
          <ResponsiveH1
            id="gallery-hero-heading"
            className="font-dm-serif-display mb-5 text-white drop-shadow-sm"
          >
            {t('gallery.title')}
          </ResponsiveH1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            {t('gallery.subtitle')}
          </p>
        </Container>
      </section>

      {/* Context + trust — standard section (no overlap) */}
      <section className="border-b border-border/40 bg-background py-20 md:py-28">
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
              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Camera className="size-6" aria-hidden />
                </div>
                <ResponsiveH4 className="mb-2 text-foreground">
                  {t('gallery.trust_title')}
                </ResponsiveH4>
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
      </section>

      {/* Gallery grid — primary content, grouped */}
      <section className="border-b border-border/40 bg-background_paleGray py-20 md:py-28">
        <Container>
          <div className="mb-12 text-center md:mb-14">
            <ResponsiveH2 className="text-foreground">{t('gallery.title')}</ResponsiveH2>
            <p className="mt-3 text-sm text-muted-foreground">
              {t('gallery.context_desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm motion-safe:transition-all motion-safe:duration-200 hover:border-primary/30 hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured destinations — secondary, grouped */}
      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-5xl rounded-2xl border border-border/60 bg-card p-8 shadow-sm sm:p-10">
            <ResponsiveH3 className="mb-8 text-center text-foreground">
              {t('gallery.featured_title')}
            </ResponsiveH3>
            <div className="grid gap-4 sm:grid-cols-3">
              {featuredRegions.map(({ key, Icon }, i) => (
                <div
                  key={key}
                  className={`flex items-center gap-3 rounded-xl border border-border/60 bg-background px-5 py-5 shadow-sm motion-safe:transition-colors motion-safe:duration-200 hover:bg-accent/60 ${
                    i > 0 ? '' : ''
                  }`}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <span className="font-medium text-foreground">{t(`gallery.${key}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Conversion — CTA */}
      <section className="bg-muted/30 py-20 md:py-28">
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
                className="h-12 min-h-12 rounded-xl bg-primary-foreground text-primary shadow-sm motion-safe:transition-opacity motion-safe:duration-200 hover:bg-primary-foreground/90"
              >
                <Link to={ROUTES.TOUR.INDEX} className="inline-flex items-center justify-center gap-2">
                  {t('gallery.cta_tours')}
                  <ArrowRight className="size-4 shrink-0 opacity-80" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 min-h-12 rounded-xl border-primary-foreground/40 bg-transparent text-primary-foreground motion-safe:transition-colors motion-safe:duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to={ROUTES.LIST_ROOMS} className="inline-flex items-center justify-center gap-2">
                  {t('gallery.cta_rooms')}
                  <ArrowRight className="size-4 shrink-0 opacity-80" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default GalleryPage;
