import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { PageHero } from '@components/PageHero';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { ResponsiveH2, ResponsiveH4 } from '@components/ui/typography';
import { ROUTES } from '@/constants/router';
import { SectionReveal } from '@/sections/home/SectionReveal';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ExternalLink, ArrowRight, Clock } from 'lucide-react';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1920&h=1080&auto=format&fit=crop';

const faqKeys = ['faq1', 'faq2', 'faq3', 'faq4'] as const;

const ContactPage = () => {
  const { t } = useTranslation();

  const contactItems = [
    { label: t('contact.info_address'), value: 'Hà Nội, Việt Nam', Icon: MapPin },
    { label: t('contact.info_phone'), value: '+84 123 456 789', Icon: Phone },
    { label: t('contact.info_email'), value: 'hello@travelvn.com', Icon: Mail },
  ];

  return (
    <MainLayout>
      <PageHero
        id="contact-hero-heading"
        backgroundImage={HERO_IMAGE}
        badge={t('contact.badge')}
        title={t('contact.hero_title')}
        subtitle={t('contact.hero_subtitle')}
      />

      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <SectionReveal>
          <Container>
            <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5 lg:gap-10">
              <Card className="border border-border/60 bg-card shadow-[var(--shadow-card)] lg:col-span-2">
                <CardContent className="p-6 sm:p-8">
                  <ResponsiveH4 className="mb-6 text-foreground">{t('contact.info_title')}</ResponsiveH4>
                  <ul className="space-y-0 divide-y divide-border/50">
                    {contactItems.map(({ label, value, Icon }) => (
                      <li key={label} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-5" aria-hidden />
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-foreground">{label}</span>
                          <span className="mt-0.5 block text-sm text-muted-foreground sm:text-base">
                            {value}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 flex items-start gap-2 border-t border-border/50 pt-4 text-xs text-muted-foreground">
                    <Clock className="mt-0.5 size-4 shrink-0 text-primary/70" aria-hidden />
                    <span>{t('contact.working_hours')}</span>
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">{t('contact.info_note')}</p>
                </CardContent>
              </Card>

              <Card className="border border-border/60 bg-card shadow-[var(--shadow-card)] lg:col-span-3">
                <CardContent className="p-6 sm:p-8">
                  <ResponsiveH4 className="mb-2 text-foreground">{t('contact.form_send')}</ResponsiveH4>
                  <p className="mb-6 text-sm text-muted-foreground">{t('contact.form_intro')}</p>
                  <form className="grid gap-4 sm:gap-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name" className="text-foreground">
                          {t('contact.form_name')}
                        </Label>
                        <Input
                          id="contact-name"
                          placeholder={t('contact.form_name')}
                          className="w-full border-border/80 bg-surface-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email" className="text-foreground">
                          {t('contact.form_email')}
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder={t('contact.form_email')}
                          className="w-full border-border/80 bg-surface-100"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-subject" className="text-foreground">
                        {t('contact.form_subject')}
                      </Label>
                      <Input
                        id="contact-subject"
                        placeholder={t('contact.form_subject')}
                        className="w-full border-border/80 bg-surface-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-message" className="text-foreground">
                        {t('contact.form_message')}
                      </Label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        placeholder={t('contact.form_message')}
                        className="w-full rounded-md border border-border/80 bg-surface-100 px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <div className="pt-1">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full cursor-pointer sm:w-auto sm:min-w-[160px]"
                      >
                        {t('contact.form_send')}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </Container>
        </SectionReveal>
      </section>

      <section className="border-b border-border/40 bg-surface-300 py-20 md:py-28">
        <SectionReveal>
          <Container>
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="size-6" aria-hidden />
              </div>
              <ResponsiveH4 className="mb-2 text-foreground">{t('contact.map_title')}</ResponsiveH4>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t('contact.map_desc')}
              </p>
              <a
                href={t('contact.map_link')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline"
              >
                <span>{t('contact.map_embed_label')}</span>
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </div>
          </Container>
        </SectionReveal>
      </section>

      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <SectionReveal>
          <Container>
            <div className="mb-8 text-center">
              <ResponsiveH2 className="text-foreground">{t('contact.faq_title')}</ResponsiveH2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t('contact.faq_subtitle')}</p>
            </div>
            <div className="mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card p-2 shadow-sm sm:p-4">
              <Accordion type="single" collapsible className="w-full">
                {faqKeys.map((k) => (
                  <AccordionItem key={k} value={k} className="border-border/50 px-2">
                    <AccordionTrigger className="text-left text-foreground">
                      {t(`contact.${k}_q` as const)}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {t(`contact.${k}_a` as const)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Container>
        </SectionReveal>
      </section>

      <section className="bg-surface-300 py-20 md:py-28">
        <SectionReveal>
          <Container>
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground shadow-md sm:px-10 sm:py-12 md:py-14">
              <ResponsiveH2 className="mb-3 text-balance text-primary-foreground">
                {t('contact.cta_explore_title')}
              </ResponsiveH2>
              <p className="mb-8 text-base text-primary-foreground/90 sm:text-lg">
                {t('contact.cta_explore_subtitle')}
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
                    <ArrowRight className="size-4" aria-hidden />
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
                    <ArrowRight className="size-4" aria-hidden />
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

export default ContactPage;
