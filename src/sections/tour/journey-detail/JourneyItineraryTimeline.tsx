import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { TourItineraryStopVm } from './tourJourneyMap';

type Props = {
  stops: TourItineraryStopVm[];
};

export function JourneyItineraryTimeline({ stops }: Props) {
  const { t } = useTranslation();

  if (stops.length === 0) return null;

  return (
    <div className="relative ms-2 border-s border-charcoal/15 ps-8 md:ms-6 md:ps-12">
      {stops.map((stop, i) => (
        <Reveal key={`${stop.label}-${stop.title}`} delay={i * 0.05}>
          <div className="relative pb-12 last:pb-0">
            <span className="absolute -start-[calc(0.5rem+1px)] top-2 flex size-3 -translate-x-1/2 rounded-full bg-sunset shadow-[0_0_0_6px_var(--color-sand-100)] md:-start-[calc(1.5rem+1px)]" />
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-forest/80">
              {stop.label}
            </p>
            <h3 className="mt-3 font-display text-2xl text-charcoal md:text-3xl">
              {stop.title}
            </h3>
            <p className="mt-2 max-w-[62ch] whitespace-pre-line text-sm leading-relaxed text-mist md:text-base">
              {stop.detail || t('tour.journey.itinerary.no_detail', 'Details coming soon.')}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
