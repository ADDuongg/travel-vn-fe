import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { TourScheduleWindowVm } from './tourJourneyMap';

type Props = {
  departureRhythm: string[];
  nextWindows: TourScheduleWindowVm[];
};

export function JourneyRhythm({ departureRhythm, nextWindows }: Props) {
  const { t } = useTranslation();

  if (departureRhythm.length === 0 && nextWindows.length === 0) return null;

  const twoCol = departureRhythm.length > 0 && nextWindows.length > 0;

  return (
    <div
      className={
        twoCol
          ? 'grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start'
          : 'space-y-12'
      }
    >
      {departureRhythm.length > 0 ? (
        <Reveal className="space-y-5">
          <h3 className="font-display text-3xl text-charcoal md:text-[2rem]">
            {t('tour.journey.rhythm.cadence_heading', 'Rhythm & cadence')}
          </h3>
          <ul className="space-y-4 text-base leading-relaxed text-mist md:text-lg">
            {departureRhythm.map((p) => (
              <li key={p} className="max-w-prose border-l border-forest/25 pl-5">
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}
      {nextWindows.length > 0 ? (
        <Reveal className="space-y-5" delay={twoCol ? 0.08 : 0}>
          <h3 className="font-display text-3xl text-charcoal md:text-[2rem]">
            {t('tour.journey.rhythm.windows_heading', 'Suggested windows')}
          </h3>
          <ul className="space-y-4">
            {nextWindows.map((w) => (
              <li
                key={`${w.label}-${w.note}`}
                className="rounded-[1.25rem] border border-charcoal/10 bg-sand-50 px-5 py-4 shadow-[var(--shadow-soft)]"
              >
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-forest">
                  {w.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-mist">{w.note}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}
    </div>
  );
}
