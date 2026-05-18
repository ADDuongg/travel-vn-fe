import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { TourGuide } from '@/features/tour-guide/types';
import { fmtMoney } from '@/utils';

type TourGuideDetailArchivalStripProps = {
  guide: TourGuide;
  provinceLine: string;
  rating: number;
  reviewCount: number;
};

export function TourGuideDetailArchivalStrip({
  guide,
  provinceLine,
  rating,
  reviewCount,
}: TourGuideDetailArchivalStripProps) {
  const { t } = useTranslation();
  const dayFee =
    guide.dailyRate != null && guide.dailyRate > 0
      ? fmtMoney(guide.dailyRate, guide.currency)
      : t('tour_guide.contact_for_price');

  return (
    <Reveal
      delay={0.05}
      className="mt-8 rounded-[1.75rem] border border-charcoal/10 bg-sand-100/90 px-6 py-6 shadow-[var(--shadow-soft)] md:px-10 md:py-8"
    >
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-forest/90">
            {t('tour_guide.detail.archival_kicker')}
          </p>
          <p className="text-sm leading-relaxed text-mist md:text-base">
            {provinceLine
              ? `${provinceLine} — ${t('tour_guide.detail.archival_language_line')}`
              : t('tour_guide.detail.archival_fallback_areas')}
          </p>
        </div>
        <dl className="grid gap-4 font-mono text-xs uppercase tracking-[0.22em] text-charcoal/60 md:justify-items-end md:text-end">
          <div>
            <dt className="text-charcoal/40">
              {t('tour_guide.detail.stat_day_fee')}
            </dt>
            <dd className="mt-1 font-display text-xl normal-case tracking-normal text-charcoal">
              {dayFee}
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
            <div>
              <dt className="text-charcoal/40">
                {t('tour_guide.detail.stat_rating')}
              </dt>
              <dd className="mt-1 text-charcoal">{rating.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="text-charcoal/40">
                {t('tour_guide.detail.stat_reviews')}
              </dt>
              <dd className="mt-1 text-charcoal">{reviewCount}</dd>
            </div>
            <div>
              <dt className="text-charcoal/40">
                {t('tour_guide.detail.stat_reply')}
              </dt>
              <dd className="mt-1 text-charcoal">
                {guide.responseRate != null && guide.responseRate > 0
                  ? `${guide.responseRate}%`
                  : '—'}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </Reveal>
  );
}

