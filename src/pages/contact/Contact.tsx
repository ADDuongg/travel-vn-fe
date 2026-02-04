import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { ResponsiveH1, ResponsiveH4 } from '@components/ui/typography';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactPage = () => {
  const { t } = useTranslation();

  const contactItems = [
    { label: t('contact.info_address'), value: 'Hà Nội, Việt Nam', Icon: MapPin },
    { label: t('contact.info_phone'), value: '+84 123 456 789', Icon: Phone },
    { label: t('contact.info_email'), value: 'hello@travelvn.com', Icon: Mail },
  ];

  return (
    <MainLayout>
      {/* Hero — primary focus */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-primary/90 to-slate-800 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920')] bg-cover bg-center opacity-20" />
        <Container className="relative py-24 text-center md:py-32">
          <ResponsiveH1 className="font-dm-serif-display mb-5 text-white drop-shadow-sm">
            {t('contact.title')}
          </ResponsiveH1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            {t('contact.subtitle')}
          </p>
        </Container>
      </section>

      {/* Main content — clear hierarchy and grouping */}
      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5 lg:gap-10">
            {/* Contact info — secondary, grouped */}
            <Card className="border border-border/60 bg-card shadow-sm lg:col-span-2">
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
                        <span className="mt-0.5 block text-sm text-muted-foreground sm:text-base">{value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-border/50 pt-6 text-xs text-muted-foreground">
                  {t('contact.info_note')}
                </p>
              </CardContent>
            </Card>

            {/* Form — primary action */}
            <Card className="border border-border/60 bg-card shadow-sm lg:col-span-3">
              <CardContent className="p-6 sm:p-8">
                <ResponsiveH4 className="mb-2 text-foreground">{t('contact.form_send')}</ResponsiveH4>
                <p className="mb-6 text-sm text-muted-foreground">
                  {t('contact.form_intro')}
                </p>
                <form className="grid gap-4 sm:gap-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name" className="text-foreground">{t('contact.form_name')}</Label>
                      <Input id="contact-name" placeholder={t('contact.form_name')} className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email" className="text-foreground">{t('contact.form_email')}</Label>
                      <Input id="contact-email" type="email" placeholder={t('contact.form_email')} className="w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-subject" className="text-foreground">{t('contact.form_subject')}</Label>
                    <Input id="contact-subject" placeholder={t('contact.form_subject')} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message" className="text-foreground">{t('contact.form_message')}</Label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      placeholder={t('contact.form_message')}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="pt-1">
                    <Button type="submit" size="lg" className="w-full sm:w-auto sm:min-w-[160px]">
                      {t('contact.form_send')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default ContactPage;
