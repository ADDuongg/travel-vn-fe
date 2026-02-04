import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { ResponsiveH1, ResponsiveH2, ResponsiveH3, ResponsiveH4 } from '@components/ui/typography';
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
      {/* Hero — primary focus */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary/90 to-slate-800 text-primary-foreground">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')" }}
        />
        <Container className="relative py-24 text-center md:py-32">
          <ResponsiveH1 className="font-dm-serif-display mb-5 text-white drop-shadow-sm">
            {t('our_services.title')}
          </ResponsiveH1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            {t('our_services.subtitle')}
          </p>
        </Container>
      </section>

      {/* Context — why one platform */}
      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <ResponsiveH2 className="mb-6 text-foreground">{t('our_services.context_title')}</ResponsiveH2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('our_services.context_desc')}
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
                  <span className="text-sm text-muted-foreground">{t(`our_services.${key}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Service cards — primary content, grouped */}
      <section className="bg-muted/30 py-20 md:py-28">
        <Container>
          <div className="mb-12 text-center md:mb-14">
            <ResponsiveH2 className="text-foreground">{t('our_services.title')}</ResponsiveH2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              {t('our_services.context_desc')}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ key, href, Icon }) => (
              <Card
                key={key}
                className="overflow-hidden border border-border/60 bg-card shadow-sm"
              >
                <CardContent className="flex flex-col p-6 sm:p-8">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-14">
                    <Icon className="size-6 sm:size-7" aria-hidden />
                  </div>
                  <ResponsiveH4 className="mb-2 text-foreground">{t(`our_services.${key}`)}</ResponsiveH4>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {t(`our_services.${key}_desc`)}
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto sm:min-w-[120px]">
                    <Link to={href}>{t('buttons.see_more')}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Popular choices — secondary CTA */}
      <section className="border-t border-border/50 bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <ResponsiveH3 className="mb-4 text-foreground">{t('our_services.popular_title')}</ResponsiveH3>
            <p className="mb-8 text-sm text-muted-foreground">
              {t('our_services.popular_intro')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {popular.map(({ labelKey, href }) => (
                <Button key={labelKey} asChild variant="outline" size="lg" className="min-w-[180px]">
                  <Link to={href}>{t(`our_services.${labelKey}`)}</Link>
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Vietnam in every service — local flavor, grouped */}
      <section className="border-t border-border/40 bg-muted/40 py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl rounded-xl border border-border/50 bg-card p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="size-6" aria-hidden />
            </div>
            <ResponsiveH3 className="mb-3 text-foreground">{t('our_services.local_title')}</ResponsiveH3>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('our_services.local_desc')}
            </p>
          </div>
        </Container>
      </section>

      {/* Conversion — CTA */}
      <section className="border-t border-border/50 bg-muted/50 py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <ResponsiveH2 className="mb-3 text-foreground">{t('our_services.cta_title')}</ResponsiveH2>
            <p className="mb-8 text-base text-muted-foreground sm:text-lg">
              {t('our_services.cta_subtitle')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="min-w-[140px]">
                <Link to={ROUTES.LIST_ROOMS}>{t('our_services.cta_rooms')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[140px]">
                <Link to={ROUTES.TOUR.INDEX}>{t('our_services.cta_tours')}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default OurServicesPage;
