import { useTranslation } from 'react-i18next';
import { Reveal, RevealItem, Stagger } from '@/components/home-editorial/Reveal';

type Props = {
  included: string[];
  excluded: string[];
};

export function JourneyEssentials({ included, excluded }: Props) {
  const { t } = useTranslation();

  if (included.length === 0 && excluded.length === 0) return null;

  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-12">
      {included.length > 0 ? (
        <Reveal className="space-y-4">
          <h3 className="font-display text-2xl text-charcoal">
            {t('tour.journey.essentials.included_heading', 'Included in this arc')}
          </h3>
          <Stagger className="space-y-3" stagger={0.04}>
            {included.map((line) => (
              <RevealItem key={line}>
                <p className="rounded-xl border border-charcoal/10 bg-sand-50 px-4 py-3 text-sm leading-relaxed text-mist shadow-[var(--shadow-soft)]">
                  {line}
                </p>
              </RevealItem>
            ))}
          </Stagger>
        </Reveal>
      ) : null}
      {excluded.length > 0 ? (
        <Reveal className="space-y-4" delay={0.06}>
          <h3 className="font-display text-2xl text-charcoal">
            {t('tour.journey.essentials.excluded_heading', 'Thoughtful exclusions')}
          </h3>
          <Stagger className="space-y-3" stagger={0.04}>
            {excluded.map((line) => (
              <RevealItem key={line}>
                <p className="rounded-xl border border-charcoal/10 bg-sand-100/90 px-4 py-3 text-sm leading-relaxed text-mist">
                  {line}
                </p>
              </RevealItem>
            ))}
          </Stagger>
        </Reveal>
      ) : null}
    </div>
  );
}

