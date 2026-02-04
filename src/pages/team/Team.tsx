import { MainLayout } from '@/layout';
import Container from '@components/Container';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { ResponsiveH1, ResponsiveH2, ResponsiveH3, ResponsiveH5 } from '@components/ui/typography';
import { ROUTES } from '@/constants/router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Users, Calendar, UserCheck, Quote, MapPin } from 'lucide-react';

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
      {/* Hero — primary focus */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary/90 to-slate-800 text-primary-foreground">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920')" }}
        />
        <Container className="relative py-24 text-center md:py-32">
          <ResponsiveH1 className="font-dm-serif-display mb-5 text-white drop-shadow-sm">
            {t('team.title')}
          </ResponsiveH1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            {t('team.subtitle')}
          </p>
        </Container>
      </section>

      {/* Context — our people */}
      <section className="border-b border-border/40 bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <ResponsiveH2 className="mb-6 text-foreground">{t('team.context_title')}</ResponsiveH2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('team.context_desc')}
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
                  <span className="text-sm text-muted-foreground">{t(`team.${key}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team grid — primary content, grouped */}
      <section className="bg-muted/30 py-20 md:py-28">
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
                className="overflow-hidden border border-border/60 bg-card shadow-sm"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="border-t border-border/50 p-6 text-center">
                  <ResponsiveH5 className="mb-1 text-foreground">{member.name}</ResponsiveH5>
                  <p className="text-sm text-muted-foreground">{t(`team.${member.roleKey}`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Quote — social proof with depth */}
      <section className="border-t border-border/50 bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl rounded-xl border border-border/50 bg-muted/30 p-8 text-center shadow-sm sm:p-10">
            <Quote className="mx-auto mb-5 size-10 text-primary/40" aria-hidden />
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('team.quote_text')}
            </p>
            <p className="mt-5 text-sm text-muted-foreground">{t('team.quote_author')}</p>
          </div>
        </Container>
      </section>

      {/* Rooted in Vietnam — local flavor, grouped */}
      <section className="border-t border-border/40 bg-muted/40 py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="size-6" aria-hidden />
            </div>
            <ResponsiveH3 className="mb-3 text-foreground">{t('team.local_title')}</ResponsiveH3>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('team.local_desc')}
            </p>
          </div>
        </Container>
      </section>

      {/* Contact CTA — conversion */}
      <section className="border-t border-border/50 bg-muted/50 py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <ResponsiveH2 className="mb-3 text-foreground">{t('team.cta_title')}</ResponsiveH2>
            <p className="mb-8 text-base text-muted-foreground sm:text-lg">
              {t('team.cta_subtitle')}
            </p>
            <Button asChild size="lg" className="min-w-[180px]">
              <Link to={ROUTES.CONTACT}>{t('team.cta_contact')}</Link>
            </Button>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default TeamPage;
