import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import {
  ResponsiveH1,
  ResponsiveH2,
  ResponsiveH3,
  ResponsiveH4,
  ResponsiveH5,
} from '@components/ui/typography';
import { ROUTES } from '@/constants/router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Users, Calendar, UserCheck, Quote, MapPin, ArrowRight } from 'lucide-react';

const teamMembers = [
  { name: 'Nguyễn Văn A', roleKey: 'role_founder', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
  { name: 'Trần Thị B', roleKey: 'role_lead', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
  { name: 'Lê Văn C', roleKey: 'role_support', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
];

const TeamPage = () => {
  const { t } = useTranslation();

  const stats = [
    { key: 'stats_years', value: '5+', Icon: Calendar },
    { key: 'stats_members', value: '12', Icon: Users },
    { key: 'stats_guests', value: '10,000+', Icon: UserCheck },
  ];

  return (
    <MainLayout>
      {/* Hero — same pattern as Contact / About */}     
      <section
        className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-primary/90 to-slate-800 text-primary-foreground"
        aria-labelledby="team-hero-heading"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920')] bg-cover bg-center opacity-20" />
        <Container className="relative py-24 text-center md:py-32">
          <ResponsiveH1
            id="team-hero-heading"
            className="font-dm-serif-display mb-5 text-white drop-shadow-sm"
          >
            {t('team.title')}
          </ResponsiveH1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            {t('team.subtitle')}
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
                  <span className="text-sm text-muted-foreground">{t(`team.${key}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Context — our people */}
      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <ResponsiveH2 className="mb-6 text-foreground">{t('team.context_title')}</ResponsiveH2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('team.context_desc')}
            </p>
          </div>
        </Container>
      </section>

      {/* Team grid — primary content, grouped */}
      <section className="border-b border-border/40 bg-background_paleGray py-20 md:py-28">
        <Container>
          <div className="mb-12 text-center md:mb-14">
            <ResponsiveH2 className="text-foreground">{t('team.title')}</ResponsiveH2>
            <p className="mt-3 text-sm text-muted-foreground">
              {t('team.team_intro')}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card
                key={member.name}
                className="group overflow-hidden rounded-2xl border border-border/70 bg-card py-0 shadow-sm motion-safe:transition-all motion-safe:duration-200 hover:border-primary/30 hover:shadow-md"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <CardContent className="border-t border-border/50 p-6 text-center">
                  <ResponsiveH5 className="mb-1 text-foreground">{member.name}</ResponsiveH5>
                  <p className="text-sm text-muted-foreground">{t(`team.${member.roleKey}`)}</p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-5 w-full rounded-xl border-border/80 bg-background shadow-sm motion-safe:transition-colors motion-safe:duration-200 hover:border-primary/40 hover:bg-accent/60"
                  >
                    <Link
                      to={ROUTES.CONTACT}
                      className="inline-flex items-center justify-center gap-2"
                    >
                      {t('team.cta_contact')}
                      <ArrowRight className="size-4 shrink-0 opacity-70" aria-hidden />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Quote — social proof with depth */}
      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm sm:p-10">
            <Quote className="mx-auto mb-5 size-10 text-primary/40" aria-hidden />
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('team.quote_text')}
            </p>
            <p className="mt-5 text-sm text-muted-foreground">{t('team.quote_author')}</p>
          </div>
        </Container>
      </section>

      {/* Rooted in Vietnam — local flavor, grouped */}
      <section className="border-b border-border/40 bg-background_paleGray py-20 md:py-28">
        <Container>
          <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-2xl border border-border/70 bg-card p-8 shadow-sm md:flex-row md:items-center md:gap-12 md:p-10 lg:p-12">
            <div className="flex shrink-0 justify-center md:justify-start">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary md:size-16">
                <MapPin className="size-7 md:size-8" aria-hidden />
              </div>
            </div>
            <div className="text-center md:text-left">
              <ResponsiveH3 className="mb-3 text-foreground">{t('team.local_title')}</ResponsiveH3>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('team.local_desc')}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact CTA — conversion */}
      <section className="bg-muted/30 py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground shadow-md sm:px-10 sm:py-12 md:py-14">
            <ResponsiveH2 className="mb-3 text-balance text-primary-foreground">
              {t('team.cta_title')}
            </ResponsiveH2>
            <p className="mb-8 text-base text-primary-foreground/90 sm:text-lg">
              {t('team.cta_subtitle')}
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 min-h-12 rounded-xl bg-primary-foreground text-primary shadow-sm motion-safe:transition-opacity motion-safe:duration-200 hover:bg-primary-foreground/90"
            >
              <Link to={ROUTES.CONTACT}>{t('team.cta_contact')}</Link>
            </Button>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default TeamPage;
