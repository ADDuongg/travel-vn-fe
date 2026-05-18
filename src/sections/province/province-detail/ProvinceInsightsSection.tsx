import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { ProvinceDetail } from '@/features/provinces/types';

type ProvinceInsightsSectionProps = {
  province: ProvinceDetail;
};

export function ProvinceInsightsSection({ province }: ProvinceInsightsSectionProps) {
  const { t } = useTranslation();
  const hasStats =
    province.totalHotels !== undefined ||
    province.totalTours !== undefined ||
    province.totalTourGuides !== undefined;

  if (!hasStats) {
    return (
      <section id="insights" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-14 md:px-10 md:py-16">
        <p className="max-w-2xl text-center text-base leading-relaxed text-mist md:text-lg">
          {t('province.detail.insights_empty')}
        </p>
      </section>
    );
  }

  return (
    <section id="insights" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-14 md:px-10 md:py-20">
      <Reveal className="mb-10 space-y-3">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
          {t('province.detail.insights_kicker')}
        </p>
        <h2 className="font-display text-4xl text-charcoal">{t('province.detail.insights_title')}</h2>
      </Reveal>
      <div className="rounded-[2rem] border border-dashed border-charcoal/18 bg-sand-50/80 p-10 shadow-soft md:p-14">
        <p className="max-w-3xl font-display text-2xl leading-snug text-charcoal md:text-3xl">
          {t('province.detail.insights_lead')}
        </p>
        <dl className="mt-12 grid gap-10 sm:grid-cols-3">
          {province.totalHotels !== undefined ? (
            <div>
              <dt className="text-[11px] uppercase tracking-[0.26em] text-charcoal/45">
                {t('province.detail.insights_hotels_dt')}
              </dt>
              <dd className="mt-3 font-display text-4xl text-charcoal">
                {province.totalHotels.toLocaleString()}
              </dd>
              <dd className="mt-2 text-sm text-mist">{t('province.detail.insights_hotels_dd')}</dd>
            </div>
          ) : null}
          {province.totalTours !== undefined ? (
            <div>
              <dt className="text-[11px] uppercase tracking-[0.26em] text-charcoal/45">
                {t('province.detail.insights_tours_dt')}
              </dt>
              <dd className="mt-3 font-display text-4xl text-charcoal">
                {province.totalTours.toLocaleString()}
              </dd>
              <dd className="mt-2 text-sm text-mist">{t('province.detail.insights_tours_dd')}</dd>
            </div>
          ) : null}
          {province.totalTourGuides !== undefined ? (
            <div>
              <dt className="text-[11px] uppercase tracking-[0.26em] text-charcoal/45">
                {t('province.detail.insights_guides_dt')}
              </dt>
              <dd className="mt-3 font-display text-4xl text-charcoal">
                {province.totalTourGuides.toLocaleString()}
              </dd>
              <dd className="mt-2 text-sm text-mist">{t('province.detail.insights_guides_dd')}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </section>
  );
}

