import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { ResponsiveH1, ResponsiveH2, ResponsiveH3, ResponsiveH4 } from '@components/ui/typography';
import { ROUTES } from '@/constants/router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Shield,
  MapPin,
  Star,
  Users,
  Map,
  Hotel,
  Quote,
  UtensilsCrossed,
  Heart,
  Lock,
  Headphones,
  CalendarCheck,
  ArrowRight,
} from 'lucide-react';

const AboutUsPage = () => {
  const { t } = useTranslation();

  const valueCards = [
    { key: 'trust' as const, Icon: Shield },
    { key: 'local' as const, Icon: MapPin },
    { key: 'quality' as const, Icon: Star },
  ];

  const stats = [
    { key: 'stats_travelers', value: '10,000+', Icon: Users },
    { key: 'stats_destinations', value: '63', Icon: Map },
    { key: 'stats_tours', value: '500+', Icon: Hotel },
  ];

  const localItems = [
    { key: 'local_regions', descKey: 'local_regions_desc', Icon: MapPin },
    { key: 'local_cuisine', descKey: 'local_cuisine_desc', Icon: UtensilsCrossed },
    { key: 'local_welcome', descKey: 'local_welcome_desc', Icon: Heart },
  ] as const;

  const trustBadges = [
    { key: 'trust_badge_secure', Icon: Lock },
    { key: 'trust_badge_support', Icon: Headphones },
    { key: 'trust_badge_flexible', Icon: CalendarCheck },
  ];

  return (
    <MainLayout>
      {/* Hero — same pattern as Contact / About variants */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-primary/90 to-slate-800 text-primary-foreground"
        aria-labelledby="about-us-hero-heading"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1528127269322-539801943592?w=1920')] bg-cover bg-center opacity-20" />
        <Container className="relative py-24 text-center md:py-32">
          <ResponsiveH1
            id="about-us-hero-heading"
            className="font-dm-serif-display mb-5 text-white drop-shadow-sm"
          >
            {t('about_us.title')}
          </ResponsiveH1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl">
            {t('about_us.subtitle')}
          </p>
        </Container>
      </section>

      {/* Stats — elevated strip overlapping hero (scan + trust) */}
      <section className="relative z-20 -mt-14 md:-mt-20">
        <Container>
          <div className="grid gap-0 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md sm:grid-cols-3 motion-safe:transition-shadow motion-safe:duration-300 hover:shadow-lg">
            {stats.map(({ key, value, Icon }, i) => (
              <div
                key={key}
                className={`flex items-center gap-4 px-6 py-8 sm:py-10 md:px-8 ${
                  i > 0 ? 'border-t border-border/60 sm:border-l sm:border-t-0' : ''
                }`}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" aria-hidden />
                </div>
                <div className="min-w-0 text-left">
                  <span className="block text-2xl font-semibold tracking-tight text-foreground">
                    {value}
                  </span>
                  <span className="text-sm text-muted-foreground">{t(`about_us.${key}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Story + Mission — clearer hierarchy (no new i18n keys) */}
      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5 lg:items-start">
            <div className="lg:col-span-3">
              <ResponsiveH2 className="mb-6 text-foreground">{t('about_us.story_title')}</ResponsiveH2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('about_us.story_desc')}
              </p>
            </div>
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Shield className="size-6" aria-hidden />
                </div>
                <ResponsiveH4 className="mb-2 text-foreground">{t('about_us.mission_title')}</ResponsiveH4>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t('about_us.mission_desc')}
                </p>
                <div className="mt-6 border-t border-border/50 pt-6 text-sm text-muted-foreground">
                  {trustBadges.map(({ key, Icon }) => (
                    <div key={key} className="flex items-center gap-2 py-1.5">
                      <Icon className="size-4 shrink-0 text-primary/70" aria-hidden />
                      <span>{t(`about_us.${key}`)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values — grouped cards with hierarchy */}
      <section className="border-b border-border/40 bg-background_paleGray py-20 md:py-28">
        <Container>
          <div className="mb-12 text-center md:mb-14">
            <ResponsiveH2 className="text-foreground">{t('about_us.values_title')}</ResponsiveH2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {valueCards.map(({ key, Icon }) => (
              <Card
                key={key}
                className="group overflow-hidden rounded-2xl border border-border/70 bg-card py-0 shadow-sm motion-safe:transition-all motion-safe:duration-200 hover:border-primary/30 hover:shadow-md"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary motion-safe:transition-transform motion-safe:duration-200 group-hover:scale-105 sm:size-14">
                    <Icon className="size-6 sm:size-7" aria-hidden />
                  </div>
                  <ResponsiveH4 className="mb-2 text-foreground">{t(`about_us.value_${key}`)}</ResponsiveH4>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {t(`about_us.value_${key}_desc`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Traveler quotes — social proof with depth */}
      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <Container>
          <div className="mb-12 text-center md:mb-14">
            <ResponsiveH3 className="text-foreground">{t('about_us.quotes_title')}</ResponsiveH3>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 sm:gap-10">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
              <Quote className="mb-4 size-8 text-primary/40" aria-hidden />
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('about_us.quote_1_text')}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{t('about_us.quote_1_author')}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
              <Quote className="mb-4 size-8 text-primary/40" aria-hidden />
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('about_us.quote_2_text')}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{t('about_us.quote_2_author')}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Vietnam at a glance — local flavor, grouped */}
      <section className="border-b border-border/40 bg-background_paleGray py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center md:mb-14">
              <ResponsiveH3 className="text-foreground">{t('about_us.local_title')}</ResponsiveH3>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {localItems.map(({ key, descKey, Icon }) => (
                <div
                  key={key}
                  className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8"
                >
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <ResponsiveH4 className="mb-2 text-foreground">{t(`about_us.${key}`)}</ResponsiveH4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`about_us.${descKey}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Trust + CTA — conversion */}
      <section className="bg-muted/30 py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground shadow-md sm:px-10 sm:py-12 md:py-14">
            <div className="mb-8 flex flex-col items-center justify-center gap-3 text-sm text-primary-foreground/90 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {trustBadges.map(({ key, Icon }) => (
                <span key={key} className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0 text-primary-foreground/80" aria-hidden />
                  {t(`about_us.${key}`)}
                </span>
              ))}
            </div>
            <ResponsiveH2 className="mb-3 text-balance text-primary-foreground">
              {t('about_us.cta_title')}
            </ResponsiveH2>
            <p className="mb-8 text-base text-primary-foreground/90 sm:text-lg">
              {t('about_us.cta_subtitle')}
            </p>
            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-12 min-h-12 rounded-xl bg-primary-foreground text-primary shadow-sm motion-safe:transition-opacity motion-safe:duration-200 hover:bg-primary-foreground/90"
              >
                <Link to={ROUTES.TOUR.INDEX} className="inline-flex items-center justify-center gap-2">
                  {t('about_us.cta_tours')}
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
                  {t('about_us.cta_rooms')}
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

export default AboutUsPage;
