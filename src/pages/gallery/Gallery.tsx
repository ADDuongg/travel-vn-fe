import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { Button } from '@components/ui/button';
import { ResponsiveH1, ResponsiveH2, ResponsiveH3, ResponsiveH4 } from '@components/ui/typography';
import { ROUTES } from '@/constants/router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Map } from 'lucide-react';

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
      {/* Hero — primary focus */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary/90 to-slate-800 text-primary-foreground">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')" }}
        />
        <Container className="relative py-24 text-center md:py-32">
          <ResponsiveH1 className="font-dm-serif-display mb-5 text-white drop-shadow-sm">
            {t('gallery.title')}
          </ResponsiveH1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            {t('gallery.subtitle')}
          </p>
        </Container>
      </section>

      {/* Context — real moments */}
      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Camera className="size-6" aria-hidden />
            </div>
            <ResponsiveH2 className="mb-6 text-foreground">{t('gallery.context_title')}</ResponsiveH2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('gallery.context_desc')}
            </p>
          </div>
        </Container>
      </section>

      {/* Trust strip — from real trips */}
      <section className="border-y border-border/50 bg-muted/30 py-14 md:py-16">
        <Container>
          <div className="mx-auto max-w-xl rounded-xl border border-border/50 bg-card px-6 py-6 text-center shadow-sm sm:px-8 sm:py-8">
            <ResponsiveH4 className="mb-2 text-foreground">{t('gallery.trust_title')}</ResponsiveH4>
            <p className="text-sm text-muted-foreground">{t('gallery.trust_desc')}</p>
          </div>
        </Container>
      </section>

      {/* Gallery grid — primary content, grouped */}
      <section className="bg-muted/30 py-20 md:py-28">
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
                className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured destinations — secondary, grouped */}
      <section className="border-t border-border/50 bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl rounded-xl border border-border/50 bg-muted/30 p-8 sm:p-10">
            <ResponsiveH3 className="mb-8 text-center text-foreground">{t('gallery.featured_title')}</ResponsiveH3>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-16">
              {featuredRegions.map(({ key, Icon }, i) => (
                <div
                  key={key}
                  className={`flex items-center gap-3 ${i > 0 ? 'border-l border-border/40 pl-12 sm:pl-16' : ''}`}
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

      {/* North / Central / South — local flavor, grouped */}
      <section className="border-t border-border/40 bg-muted/40 py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="size-6" aria-hidden />
            </div>
            <ResponsiveH3 className="mb-3 text-foreground">{t('gallery.local_title')}</ResponsiveH3>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('gallery.local_desc')}
            </p>
          </div>
        </Container>
      </section>

      {/* Conversion — CTA */}
      <section className="border-t border-border/50 bg-muted/50 py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <ResponsiveH2 className="mb-3 text-foreground">{t('gallery.cta_title')}</ResponsiveH2>
            <p className="mb-8 text-base text-muted-foreground sm:text-lg">
              {t('gallery.cta_subtitle')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="min-w-[140px]">
                <Link to={ROUTES.TOUR.INDEX}>{t('gallery.cta_tours')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[140px]">
                <Link to={ROUTES.LIST_ROOMS}>{t('gallery.cta_rooms')}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default GalleryPage;
