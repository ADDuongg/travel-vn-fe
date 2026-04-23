import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { PageHero } from '@components/PageHero';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { ResponsiveH2, ResponsiveH3, ResponsiveH5 } from '@components/ui/typography';
import { ROUTES } from '@/constants/router';
import { SectionReveal } from '@/sections/home/SectionReveal';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Users, Calendar, UserCheck, Quote, MapPin, ArrowRight, Linkedin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&auto=format&fit=crop';

const members = [
  {
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=1000&fit=crop&auto=format',
    nameKey: 'member1_name' as const,
    roleKey: 'role_ceo' as const,
    bioKey: 'bio_ceo' as const,
    tag1Key: 'tag_ceo_1' as const,
    tag2Key: 'tag_ceo_2' as const,
    linkedin: 'https://www.linkedin.com',
  },
  {
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop&auto=format',
    nameKey: 'member2_name' as const,
    roleKey: 'role_expert' as const,
    bioKey: 'bio_expert' as const,
    tag1Key: 'tag_expert_1' as const,
    tag2Key: 'tag_expert_2' as const,
    linkedin: 'https://www.linkedin.com',
  },
  {
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop&auto=format',
    nameKey: 'member3_name' as const,
    roleKey: 'role_success' as const,
    bioKey: 'bio_success' as const,
    tag1Key: 'tag_support_1' as const,
    tag2Key: 'tag_support_2' as const,
    linkedin: 'https://www.linkedin.com',
  },
] as const;

const TeamPage = () => {
  const { t } = useTranslation();

  const stats = [
    { key: 'stats_years', value: '5+', Icon: Calendar },
    { key: 'stats_members', value: '12', Icon: Users },
    { key: 'stats_guests', value: '10,000+', Icon: UserCheck },
  ];

  return (
    <MainLayout>
      <PageHero
        id="team-hero-heading"
        backgroundImage={HERO_IMAGE}
        badge={t('team.badge')}
        title={t('team.hero_title')}
        subtitle={t('team.hero_subtitle')}
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
                  <span className="text-sm text-muted-foreground">{t(`team.${key}`)}</span>
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
              <ResponsiveH2 className="mb-6 text-foreground">{t('team.context_title')}</ResponsiveH2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('team.context_desc')}
              </p>
            </div>
          </Container>
        </SectionReveal>
      </section>

      <section className="border-b border-border/40 bg-surface-300 py-20 md:py-28">
        <SectionReveal>
          <Container>
            <div className="mb-12 text-center md:mb-14">
              <ResponsiveH2 className="text-foreground">{t('team.title')}</ResponsiveH2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">{t('team.team_intro')}</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <Card
                  key={member.nameKey}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-card py-0 shadow-[var(--shadow-card)] motion-safe:transition-all motion-safe:duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-elevated)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#1c1a14]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <img
                      src={member.image}
                      alt={t(`team.${member.nameKey}`)}
                      className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="border-t border-border/50 p-6 text-left">
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#9a6f1a]">
                        {t(`team.${member.tag1Key}`)}
                      </span>
                      <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#9a6f1a]">
                        {t(`team.${member.tag2Key}`)}
                      </span>
                    </div>
                    <ResponsiveH5 className="mb-1 text-foreground">
                      {t(`team.${member.nameKey}`)}
                    </ResponsiveH5>
                    <p className="text-sm text-muted-foreground">{t(`team.${member.roleKey}`)}</p>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {t(`team.${member.bioKey}`)}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border/70 bg-surface-100 text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        aria-label={t('team.aria_linkedin')}
                      >
                        <Linkedin className="size-4" aria-hidden />
                      </a>
                      <a
                        href="mailto:hello@travelvn.com"
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border/70 bg-surface-100 text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        aria-label={t('team.aria_email')}
                      >
                        <Mail className="size-4" aria-hidden />
                      </a>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mt-5 w-full cursor-pointer rounded-xl border-border/80"
                    >
                      <Link to={ROUTES.CONTACT} className="inline-flex items-center justify-center gap-2">
                        {t('team.cta_contact')}
                        <ArrowRight className="size-4 opacity-70" aria-hidden />
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
            <div className="mx-auto max-w-3xl rounded-2xl border-2 border-hoi-an-gold/35 bg-card p-8 text-center shadow-sm sm:p-10">
              <Quote className="mx-auto mb-5 size-10 text-primary/40" aria-hidden />
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('team.quote_text')}
              </p>
              <p className="mt-5 text-sm text-muted-foreground">{t('team.quote_author')}</p>
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
                <ResponsiveH3 className="mb-3 text-foreground">{t('team.local_title')}</ResponsiveH3>
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {t('team.local_desc')}
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
                {t('team.cta_join_title')}
              </ResponsiveH2>
              <p className="mb-8 text-base text-primary-foreground/90 sm:text-lg">
                {t('team.cta_join_subtitle')}
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-12 min-h-12 cursor-pointer rounded-xl bg-primary-foreground text-primary"
              >
                <Link to={ROUTES.CONTACT}>{t('team.cta_contact')}</Link>
              </Button>
            </div>
          </Container>
        </SectionReveal>
      </section>
    </MainLayout>
  );
};

export default TeamPage;
