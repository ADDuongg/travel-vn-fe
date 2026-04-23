import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { PageHero } from '@components/PageHero';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { ResponsiveH2, ResponsiveH3, ResponsiveH4 } from '@components/ui/typography';
import { ROUTES } from '@/constants/router';
import { SectionReveal } from '@/sections/home/SectionReveal';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Building2,
  Map,
  UtensilsCrossed,
  ShoppingBag,
  Building,
  Route,
  Handshake,
  MapPin,
  ArrowRight,
  Search,
  CreditCard,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&h=1080&auto=format&fit=crop';

const OurServicesPage = () => {
  const { t } = useTranslation();

  const services = [
    { key: 'booking_rooms' as const, href: ROUTES.LIST_ROOMS, Icon: Building2 },
    { key: 'tours' as const, href: ROUTES.TOUR.INDEX, Icon: Map },
    { key: 'foods' as const, href: ROUTES.LIST_FOODS, Icon: UtensilsCrossed },
    { key: 'shop' as const, href: ROUTES.LIST_SHOP, Icon: ShoppingBag },
  ];

  const stats = [
    { key: 'stats_hotels', value: '500+', Icon: Building },
    { key: 'stats_tours', value: '200+', Icon: Route },
    { key: 'stats_partners', value: '100+', Icon: Handshake },
  ];

  const steps = [
    { titleKey: 'how_step1_title' as const, descKey: 'how_step1_desc' as const, Icon: Search },
    { titleKey: 'how_step2_title' as const, descKey: 'how_step2_desc' as const, Icon: CreditCard },
    { titleKey: 'how_step3_title' as const, descKey: 'how_step3_desc' as const, Icon: Compass },
  ] as const;

  return (
    <MainLayout>
      <PageHero
        id="our-services-hero-heading"
        backgroundImage={HERO_IMAGE}
        badge={t('our_services.badge')}
        title={t('our_services.hero_title')}
        subtitle={t('our_services.hero_subtitle')}
      />

      <section className="relative z-20 -mt-14 bg-transparent md:-mt-20">
        <Container>
          <div className="grid gap-0 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[var(--shadow-card)] sm:grid-cols-3">
            {stats.map(({ key, value, Icon }, i) => (
              <div
                key={key}
                className={cn(
                  'flex items-center gap-4 px-6 py-8 sm:py-10 md:px-8',
                  i > 0 ? 'border-t border-border/60 sm:border-l sm:border-t-0' : '',
                )}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" aria-hidden />
                </div>
                <div className="min-w-0 text-left">
                  <span className="block text-2xl font-semibold tracking-tight text-foreground">
                    {value}
                  </span>
                  <span className="text-sm text-muted-foreground">{t(`our_services.${key}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <SectionReveal>
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <ResponsiveH2 className="mb-4 text-balance text-foreground">
                {t('our_services.context_title')}
              </ResponsiveH2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('our_services.context_desc')}
              </p>
            </div>
          </Container>
        </SectionReveal>
      </section>

      <section
        className="border-b border-border/40 bg-surface-300 py-20 md:py-28"
        aria-labelledby="our-services-grid-heading"
      >
        <SectionReveal>
          <Container>
            <div className="mb-10 flex flex-col gap-3 text-center md:mb-12">
              <ResponsiveH2
                id="our-services-grid-heading"
                className="text-balance text-foreground"
              >
                {t('our_services.title')}
              </ResponsiveH2>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t('our_services.context_desc')}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {services.map(({ key, href, Icon }) => (
                <Card
                  key={key}
                  className="group cursor-pointer gap-0 overflow-hidden rounded-2xl border border-border/70 bg-card py-0 shadow-[var(--shadow-card)] motion-safe:transition-all motion-safe:duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-elevated)]"
                >
                  <CardContent className="flex flex-col p-6 sm:p-7">
                    <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-14">
                      <Icon className="size-6 sm:size-7" aria-hidden />
                    </div>
                    <ResponsiveH4 className="mb-2 text-foreground">{t(`our_services.${key}`)}</ResponsiveH4>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                      {t(`our_services.${key}_desc`)}
                    </p>
                    <Button asChild variant="default" size="sm" className="w-full cursor-pointer sm:w-auto">
                      <Link to={href} className="inline-flex items-center justify-center gap-1.5">
                        {t('buttons.see_more')}
                        <ArrowRight className="size-4 motion-safe:transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </SectionReveal>
      </section>

      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <SectionReveal>
          <Container>
            <div className="mb-10 text-center">
              <ResponsiveH3 className="text-balance text-foreground">
                {t('our_services.how_works_title')}
              </ResponsiveH3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {t('our_services.how_works_subtitle')}
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              {steps.map(({ titleKey, descKey, Icon }, index) => (
                <div
                  key={titleKey}
                  className="relative rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm sm:p-8"
                >
                  <div className="relative mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-sapa-green/15 text-sapa-green sm:size-14">
                    <span className="absolute -top-3 left-1/2 flex size-7 -translate-x-1/2 items-center justify-center rounded-full bg-sapa-green text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <h4 className="font-dm-serif-display text-lg font-bold text-foreground sm:text-xl">
                    {t(`our_services.${titleKey}`)}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`our_services.${descKey}`)}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </SectionReveal>
      </section>

      <section className="border-b border-border/40 bg-surface-300 py-20 md:py-28">
        <SectionReveal>
          <Container>
            <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-2xl border border-border/70 bg-card p-8 shadow-sm md:flex-row md:items-center md:gap-12 md:p-10 lg:p-12">
              <div className="flex shrink-0 justify-center md:justify-start">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary md:size-16">
                  <MapPin className="size-7 md:size-8" aria-hidden />
                </div>
              </div>
              <div className="text-center md:text-left">
                <ResponsiveH3 className="mb-3 text-foreground">{t('our_services.local_title')}</ResponsiveH3>
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {t('our_services.local_desc')}
                </p>
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
                {t('our_services.cta_title')}
              </ResponsiveH2>
              <p className="mb-8 text-base text-primary-foreground/90 sm:text-lg">
                {t('our_services.cta_subtitle')}
              </p>
              <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-12 min-h-12 cursor-pointer rounded-xl bg-primary-foreground text-primary"
                >
                  <Link to={ROUTES.LIST_ROOMS}>{t('our_services.cta_rooms')}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 min-h-12 cursor-pointer rounded-xl border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to={ROUTES.TOUR.INDEX}>{t('our_services.cta_tours')}</Link>
                </Button>
              </div>
            </div>
          </Container>
        </SectionReveal>
      </section>
    </MainLayout>
  );
};

export default OurServicesPage;
