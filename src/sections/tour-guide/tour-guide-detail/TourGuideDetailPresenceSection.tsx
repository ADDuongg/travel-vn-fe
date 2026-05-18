import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Reveal, RevealItem, Stagger } from '@/components/home-editorial/Reveal';
import type { TourGuide } from '@/features/tour-guide/types';

type TourGuideDetailPresenceSectionProps = {
  guide: TourGuide;
  specialtyLines: string[];
  specialtiesText?: string;

  show: boolean;
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-charcoal/10 bg-sand-50 px-5 py-5 shadow-[var(--shadow-soft)]">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl text-charcoal">{value}</p>
    </div>
  );
}

export function TourGuideDetailPresenceSection({
  guide,
  specialtyLines,
  specialtiesText,
  show,
}: TourGuideDetailPresenceSectionProps) {
  const { t } = useTranslation();

  if (!show) {
    return null;
  }

  const cards: { label: string; value: string }[] = [];
  if (guide.completedTripsCount != null && guide.completedTripsCount > 0) {
    cards.push({
      label: t('tour_guide.detail.presence_stat_walks'),
      value: String(guide.completedTripsCount),
    });
  }
  if (guide.returningCustomerRate != null && guide.returningCustomerRate > 0) {
    cards.push({
      label: t('tour_guide.detail.presence_stat_returning'),
      value: `${guide.returningCustomerRate}%`,
    });
  }
  cards.push({
    label: t('tour_guide.detail.presence_stat_verify'),
    value: guide.isVerified
      ? t('tour_guide.detail.presence_verified')
      : t('tour_guide.detail.presence_community'),
  });

  return (
    <section
      id="presence"
      className="scroll-mt-28 border-y border-charcoal/10 bg-sand-100 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <Reveal className="mb-14 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('tour_guide.specialties_kicker')}
          </p>
          <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
            {t('tour_guide.detail.presence_title')}
          </h2>
        </Reveal>
        {specialtyLines.length > 0 ? (
          <Stagger className="grid gap-6 md:grid-cols-3">
            {specialtyLines.map((line) => (
              <RevealItem key={line}>
                <div className="h-full rounded-[1.5rem] border border-charcoal/10 bg-sand-50 px-6 py-6 shadow-[var(--shadow-soft)] md:px-8 md:py-7">
                  <p className="text-sm leading-relaxed text-mist md:text-base">
                    {line}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        ) : null}
        {specialtiesText ? (
          <Reveal className={specialtyLines.length > 0 ? 'mt-8' : ''}>
            <p className="max-w-[70ch] text-base leading-relaxed text-mist md:text-lg">
              {specialtiesText}
            </p>
          </Reveal>
        ) : null}
        {guide.certifications && guide.certifications.length > 0 ? (
          <Reveal className="mt-8 flex flex-wrap gap-2">
            {guide.certifications.map((c) => (
              <Badge
                key={c}
                variant="secondary"
                className="rounded-full border border-charcoal/10 bg-sand-50 px-3 py-1.5 text-charcoal"
              >
                {c}
              </Badge>
            ))}
          </Reveal>
        ) : null}
        {cards.length > 0 ? (
          <Reveal className="mt-14 grid gap-6 border-t border-charcoal/10 pt-12 md:grid-cols-3">
            {cards.map((c) => (
              <StatCard key={c.label} label={c.label} value={c.value} />
            ))}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

