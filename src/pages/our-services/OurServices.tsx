import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import {
  ResponsiveH1,
  ResponsiveH2,
  ResponsiveH3,
  ResponsiveH4,
} from '@components/ui/typography';
import { ROUTES } from '@/constants/router';
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
} from 'lucide-react';

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

  const popular = [
    { labelKey: 'popular_rooms', href: ROUTES.LIST_ROOMS },
    { labelKey: 'popular_tours', href: ROUTES.TOUR.INDEX },
  ];

  return (
    <MainLayout>
      {/* Hero — same pattern as Contact / About */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-primary/90 to-slate-800 text-primary-foreground"
        aria-labelledby="our-services-hero-heading"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920')] bg-cover bg-center opacity-20" />
        <Container className="relative py-24 text-center md:py-32">
          <ResponsiveH1
            id="our-services-hero-heading"
            className="font-dm-serif-display mb-5 text-white drop-shadow-sm"
          >
            {t('our_services.title')}
          </ResponsiveH1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            {t('our_services.subtitle')}
          </p>
        </Container>
      </section>

      {/* Stats — elevated strip overlapping hero (like earlier) */}
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
                  <span className="text-sm text-muted-foreground">
                    {t(`our_services.${key}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Context — About / Contact section rhythm */}
      <section className="border-b border-border/40 bg-background py-20 md:py-28">
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
      </section>

      {/* Service grid */}
      <section
        className="border-b border-border/40 bg-background_paleGray py-20 md:py-28"
        aria-labelledby="our-services-grid-heading"
      >
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
                className="group gap-0 overflow-hidden rounded-2xl border-border/70 bg-card py-0 shadow-sm motion-safe:transition-all motion-safe:duration-200 hover:border-primary/30 hover:shadow-md"
              >
                <CardContent className="flex flex-col p-6 sm:p-7">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary motion-safe:transition-transform motion-safe:duration-200 group-hover:scale-105 sm:size-14">
                    <Icon className="size-6 sm:size-7" aria-hidden />
                  </div>
                  <ResponsiveH4 className="mb-2 text-foreground">
                    {t(`our_services.${key}`)}
                  </ResponsiveH4>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {t(`our_services.${key}_desc`)}
                  </p>
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="w-full gap-1.5 sm:w-auto sm:min-w-[132px]"
                  >
                    <Link
                      to={href}
                      className="inline-flex items-center justify-center"
                    >
                      {t('buttons.see_more')}
                      <ArrowRight
                        className="size-4 opacity-90 motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Popular */}
      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <ResponsiveH3 className="mb-3 text-balance text-foreground">
              {t('our_services.popular_title')}
            </ResponsiveH3>
            <p className="mb-8 text-sm text-muted-foreground sm:text-base">
              {t('our_services.popular_intro')}
            </p>
            <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              {popular.map(({ labelKey, href }) => (
                <Button
                  key={labelKey}
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 min-h-12 rounded-xl border-border/80 bg-card px-6 shadow-sm motion-safe:transition-colors motion-safe:duration-200 hover:border-primary/40 hover:bg-accent/60"
                >
                  <Link
                    to={href}
                    className="inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                  >
                    {t(`our_services.${labelKey}`)}
                    <ArrowRight
                      className="size-4 shrink-0 opacity-70"
                      aria-hidden
                    />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Local highlight */}
      <section className="border-b border-border/40 bg-background_paleGray py-20 md:py-28">
        <Container>
          <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-2xl border border-border/70 bg-card p-8 shadow-sm md:flex-row md:items-center md:gap-12 md:p-10 lg:p-12">
            <div className="flex shrink-0 justify-center md:justify-start">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary md:size-16">
                <MapPin className="size-7 md:size-8" aria-hidden />
              </div>
            </div>
            <div className="text-center md:text-left">
              <ResponsiveH3 className="mb-3 text-foreground">
                {t('our_services.local_title')}
              </ResponsiveH3>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('our_services.local_desc')}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Conversion */}
      <section className="bg-muted/30 py-20 md:py-28">
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
                className="h-12 min-h-12 rounded-xl bg-primary-foreground text-primary shadow-sm motion-safe:transition-opacity motion-safe:duration-200 hover:bg-primary-foreground/90"
              >
                <Link to={ROUTES.LIST_ROOMS}>
                  {t('our_services.cta_rooms')}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 min-h-12 rounded-xl border-primary-foreground/40 bg-transparent text-primary-foreground motion-safe:transition-colors motion-safe:duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to={ROUTES.TOUR.INDEX}>
                  {t('our_services.cta_tours')}
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default OurServicesPage;
