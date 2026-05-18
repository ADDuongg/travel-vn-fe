import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/home-editorial/Reveal';
import { ROUTES } from '@/constants/router';
import type { TourGuide } from '@/features/tour-guide/types';
import { fmtMoney } from '@/utils';

type TourGuideDetailPlanBandProps = {
  guide: TourGuide;
  firstName: string;
};

export function TourGuideDetailPlanBand({
  guide,
  firstName,
}: TourGuideDetailPlanBandProps) {
  const { t } = useTranslation();
  const contactHref = `${ROUTES.CONTACT}?guide=${encodeURIComponent(guide._id)}`;
  const rateLabel =
    guide.dailyRate != null && guide.dailyRate > 0
      ? fmtMoney(guide.dailyRate, guide.currency)
      : t('tour_guide.contact_for_price');

  return (
    <section
      id="plan"
      className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-12 md:px-10 md:pb-20"
    >
      <Reveal className="mb-10 space-y-3">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
          {t('tour_guide.detail.plan_kicker')}
        </p>
        <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
          {t('tour_guide.detail.plan_title', { name: firstName })}
        </h2>
      </Reveal>
      <Reveal>
        <div className="rounded-[2rem] border border-charcoal/10 bg-gradient-to-br from-sand-100 via-sand-50 to-sand-100 px-6 py-10 shadow-[var(--shadow-soft)] md:px-12 md:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div className="space-y-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
                {t('tour_guide.detail.plan_correspondence')}
              </p>
              <p className="max-w-prose text-lg leading-relaxed text-mist">
                {t('tour_guide.detail.plan_lead')}
              </p>
              <p className="text-xs leading-relaxed text-charcoal/45">
                {t('tour_guide.detail.plan_disclaimer')}
              </p>
            </div>
            <div className="flex flex-col gap-4 rounded-[1.5rem] border border-charcoal/10 bg-sand-50/90 p-6 md:p-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
                  {t('tour_guide.detail.plan_day_rate_label')}
                </p>
                <p className="mt-2 font-display text-3xl text-charcoal md:text-[2.35rem]">
                  {rateLabel}
                </p>
              </div>
              {guide.isAvailable ? (
                <Link
                  to={contactHref}
                  className="inline-flex w-full items-center justify-center rounded-full bg-charcoal px-8 py-3.5 text-center text-sm font-semibold text-sand-50 shadow-[var(--shadow-soft)] transition hover:bg-charcoal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                >
                  {t('tour_guide.detail.plan_cta_primary')}
                </Link>
              ) : (
                <span className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-charcoal/35 px-8 py-3.5 text-center text-sm font-semibold text-sand-50/90">
                  {t('tour_guide.detail.plan_cta_unavailable')}
                </span>
              )}
              <Link
                to={ROUTES.CONTACT}
                className="text-center text-sm font-semibold text-forest underline-offset-4 hover:text-sunset-deep hover:underline"
              >
                {t('tour_guide.detail.plan_cta_secondary')}
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

