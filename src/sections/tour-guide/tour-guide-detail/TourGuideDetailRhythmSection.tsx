import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { TourGuide } from '@/features/tour-guide/types';

type TourGuideDetailRhythmSectionProps = {
  guide: TourGuide;
};

export function TourGuideDetailRhythmSection({
  guide,
}: TourGuideDetailRhythmSectionProps) {
  const { t } = useTranslation();
  const methods = guide.contactMethods ?? [];
  const hasResponse =
    guide.responseRate != null && guide.responseRate > 0;

  if (methods.length === 0 && !hasResponse) {
    return null;
  }

  return (
    <section
      id="rhythm"
      className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20 md:px-10 md:py-28"
    >
      <Reveal className="mb-14 space-y-3">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
          {t('tour_guide.detail.rhythm_kicker')}
        </p>
        <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
          {t('tour_guide.detail.rhythm_title')}
        </h2>
      </Reveal>
      <ul className="space-y-6">
        {hasResponse ? (
          <Reveal>
            <li className="flex gap-4 rounded-[1.5rem] border border-charcoal/10 bg-sand-50/90 px-6 py-5 shadow-[var(--shadow-soft)] md:px-8 md:py-6">
              <span className="mt-1 font-mono text-xs text-forest/80" aria-hidden>
                —
              </span>
              <p className="text-base leading-relaxed text-mist">
                {t('tour_guide.detail.rhythm_response_note', {
                  pct: guide.responseRate,
                })}
              </p>
            </li>
          </Reveal>
        ) : null}
        {methods.map((note) => (
          <Reveal key={note}>
            <li className="flex gap-4 rounded-[1.5rem] border border-charcoal/10 bg-sand-50/90 px-6 py-5 shadow-[var(--shadow-soft)] md:px-8 md:py-6">
              <span className="mt-1 font-mono text-xs text-forest/80" aria-hidden>
                —
              </span>
              <p className="text-base leading-relaxed text-mist">{note}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
