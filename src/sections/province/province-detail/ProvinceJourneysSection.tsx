import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, generatePath } from 'react-router-dom';
import { Reveal } from '@/components/home-editorial/Reveal';
import { ROUTES } from '@/constants/router';
import { MOCK_PROVINCES_FALLBACK } from '@/features/provinces/mockProvinces';
import type { ProvinceDetail } from '@/features/provinces/types';
import { pickLocale } from '@/features/provinces/locale';
import { useLanguage } from '@/hooks/useLanguage';

type ProvinceJourneysSectionProps = {
  province: ProvinceDetail;
};

export function ProvinceJourneysSection({ province }: ProvinceJourneysSectionProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const relatedProvinces = useMemo(() => {
    if (!province.region) return [];
    return MOCK_PROVINCES_FALLBACK.filter(
      (p) => p.region === province.region && p.slug !== province.slug,
    ).slice(0, 4);
  }, [province.region, province.slug]);

  return (
    <section id="journeys" className="mx-auto max-w-6xl scroll-mt-32 px-4 pb-8 md:px-10">
      <Reveal className="mb-12 space-y-4">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
          {t('province.detail.journeys_kicker')}
        </p>
        <h2 className="font-display text-4xl text-charcoal">{t('province.detail.journeys_title')}</h2>
        <p className="max-w-xl text-sm text-mist">{t('province.detail.journeys_lead')}</p>
      </Reveal>

      <Reveal className="col-span-full rounded-[1.5rem] border border-dashed border-charcoal/18 bg-sand-100/70 p-12 text-center md:col-span-3">
        <p className="font-display text-2xl text-charcoal">{t('province.detail.journeys_empty_title')}</p>
        <p className="mt-3 text-sm text-mist">{t('province.detail.journeys_empty_desc')}</p>
        <Link
          className="mt-6 inline-block text-sm font-semibold text-forest hover:text-sunset-deep"
          to={ROUTES.TOUR.INDEX}
        >
          {t('province.detail.journeys_browse_tours')}
        </Link>
      </Reveal>

      {relatedProvinces.length > 0 ? (
        <Reveal className="mt-20 space-y-6">
          <h3 className="font-display text-3xl text-charcoal">
            {t('province.detail.journeys_nearby_title')}
          </h3>
          <div className="flex flex-wrap gap-4">
            {relatedProvinces.map((p) => {
              const label = pickLocale(p.name, language) ?? p.slug;
              return (
                <Link
                  key={p.slug}
                  to={generatePath(ROUTES.PROVINCE.DETAIL, { slug: p.slug })}
                  className="rounded-full border border-charcoal/12 px-5 py-2.5 text-sm font-medium text-charcoal transition hover:border-forest/35 hover:text-forest"
                >
                  {label}
                </Link>
              );
            })}
            <Link
              to={ROUTES.PROVINCE.INDEX}
              className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-semibold text-sand-50 shadow-soft hover:bg-charcoal/90"
            >
              {t('province.detail.journeys_full_atlas')}
            </Link>
          </div>
        </Reveal>
      ) : null}

      <Reveal className="mt-14 flex flex-wrap gap-4">
        <Link
          to={ROUTES.PROVINCE.INDEX}
          className="rounded-full border border-charcoal/15 px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-forest/40"
        >
          {t('province.detail.journeys_back_atlas')}
        </Link>
        <Link
          to={ROUTES.HOME}
          className="rounded-full border border-transparent px-6 py-3 text-sm font-semibold text-mist underline-offset-4 hover:text-charcoal hover:underline"
        >
          {t('province.detail.journeys_home')}
        </Link>
      </Reveal>
    </section>
  );
}
