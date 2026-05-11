import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';

const WINDOW_KEYS = ['a', 'b', 'c'] as const;

/**
 * General seasonal hints (not guide-specific commitments). Copy is neutral per product plan.
 */
export function TourGuideDetailWindowsSection() {
  const { t } = useTranslation();

  return (
    <section
      id="windows"
      className="scroll-mt-28 border-y border-charcoal/10 bg-sand-100 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <Reveal className="mb-14 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('tour_guide.detail.windows_kicker')}
          </p>
          <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
            {t('tour_guide.detail.windows_title')}
          </h2>
          <p className="max-w-[62ch] text-sm leading-relaxed text-charcoal/55 md:text-base">
            {t('tour_guide.detail.windows_disclaimer')}
          </p>
        </Reveal>
        <div className="relative ms-2 border-s border-charcoal/15 ps-8 md:ms-6 md:ps-12">
          {WINDOW_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 0.05}>
              <div className="relative pb-12 last:pb-0">
                <span className="absolute -start-[calc(0.5rem+1px)] top-2 flex size-3 -translate-x-1/2 rounded-full bg-sunset shadow-[0_0_0_6px_var(--color-sand-100)] md:-start-[calc(1.5rem+1px)]" />
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-forest/80">
                  {t(`tour_guide.detail.windows_slot_${key}_label`)}
                </p>
                <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-mist md:text-base">
                  {t(`tour_guide.detail.windows_slot_${key}_note`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
