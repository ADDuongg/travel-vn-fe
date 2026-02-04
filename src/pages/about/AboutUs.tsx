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
  BookOpen,
  Users,
  Map,
  Hotel,
  Quote,
  UtensilsCrossed,
  Heart,
  Lock,
  Headphones,
  CalendarCheck,
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
      {/* Hero — primary focus */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary/90 to-slate-800 text-primary-foreground">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528127269322-539801943592?w=1920')" }}
        />
        <Container className="relative py-24 text-center md:py-32">
          <ResponsiveH1 className="font-dm-serif-display mb-5 text-white drop-shadow-sm">
            {t('about_us.title')}
          </ResponsiveH1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl">
            {t('about_us.subtitle')}
          </p>
        </Container>
      </section>

      {/* Our story — secondary section with clear grouping */}
      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl">
            <ResponsiveH2 className="mb-6 text-foreground">{t('about_us.story_title')}</ResponsiveH2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('about_us.story_desc')}
            </p>
          </div>
        </Container>
      </section>

      {/* Stats strip — supporting credibility */}
      <section className="border-y border-border/50 bg-muted/30 py-14 md:py-16">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 sm:gap-x-20 md:gap-x-24">
            {stats.map(({ key, value, Icon }, i) => (
              <div
                key={key}
                className={`flex items-center gap-4 ${i > 0 ? 'border-l border-border/40 pl-16 md:pl-24' : ''}`}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" aria-hidden />
                </div>
                <div>
                  <span className="block font-semibold text-foreground sm:text-lg">{value}</span>
                  <span className="text-sm text-muted-foreground">{t(`about_us.${key}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission — primary statement */}
      <section className="bg-muted/40 py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <ResponsiveH2 className="mb-4 text-foreground">{t('about_us.mission_title')}</ResponsiveH2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('about_us.mission_desc')}
            </p>
          </div>
        </Container>
      </section>

      {/* Values — grouped cards with hierarchy */}
      <section className="border-t border-border/40 bg-background py-20 md:py-28">
        <Container>
          <div className="mb-12 text-center md:mb-14">
            <ResponsiveH2 className="text-foreground">{t('about_us.values_title')}</ResponsiveH2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {valueCards.map(({ key, Icon }) => (
              <Card
                key={key}
                className="overflow-hidden border border-border/60 bg-card shadow-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-14">
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
      <section className="border-t border-border/50 bg-muted/30 py-20 md:py-28">
        <Container>
          <div className="mb-12 text-center md:mb-14">
            <ResponsiveH3 className="text-foreground">{t('about_us.quotes_title')}</ResponsiveH3>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 sm:gap-10">
            <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm sm:p-8">
              <Quote className="mb-4 size-8 text-primary/40" aria-hidden />
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('about_us.quote_1_text')}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{t('about_us.quote_1_author')}</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm sm:p-8">
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
      <section className="border-t border-border/40 bg-background py-20 md:py-28">
        <Container>
          <div className="mb-12 text-center md:mb-14">
            <ResponsiveH3 className="text-foreground">{t('about_us.local_title')}</ResponsiveH3>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/30 p-8 sm:p-10 md:p-12">
            <div className="grid gap-8 sm:grid-cols-3">
              {localItems.map(({ key, descKey, Icon }) => (
                <div key={key} className="text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <ResponsiveH4 className="mb-2 text-foreground">{t(`about_us.${key}`)}</ResponsiveH4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{t(`about_us.${descKey}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Trust + CTA — conversion */}
      <section className="border-t border-border/50 bg-muted/50 py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 border-b border-border/40 pb-10 text-sm text-muted-foreground">
              {trustBadges.map(({ key, Icon }, i) => (
                <span key={key} className="flex items-center gap-2">
                  {i > 0 && <span className="hidden sm:inline" aria-hidden>·</span>}
                  <Icon className="size-4 shrink-0 text-primary/70" aria-hidden />
                  {t(`about_us.${key}`)}
                </span>
              ))}
            </div>
            <ResponsiveH2 className="mb-3 text-foreground">{t('about_us.cta_title')}</ResponsiveH2>
            <p className="mb-8 text-base text-muted-foreground sm:text-lg">
              {t('about_us.cta_subtitle')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="min-w-[140px]">
                <Link to={ROUTES.TOUR.INDEX}>{t('about_us.cta_tours')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[140px]">
                <Link to={ROUTES.LIST_ROOMS}>{t('about_us.cta_rooms')}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default AboutUsPage;
