import { useTranslation } from 'react-i18next';
import { fmtMoney } from '@/utils';
import { caculateSalePrice } from '@/utils';
import type { Tour } from '@/features/tours/types';

type Props = {
  tour: Tour;
  regionLabel: string;
  durationLine: string;
  days: number;
  nights: number;
  moodLabel: string;
  className?: string;
};

function formatNightsDays(days: number, nights: number): string | null {
  if (days <= 0 && nights <= 0) return null;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`);
  if (nights > 0) parts.push(`${nights} night${nights === 1 ? '' : 's'}`);
  return parts.join(' · ');
}

export function JourneyMetaStrip({
  tour,
  regionLabel,
  durationLine,
  days,
  nights,
  moodLabel,
  className,
}: Props) {
  const { t } = useTranslation();

  const basePrice = tour.pricing?.basePrice ?? 0;
  const salePercent =
    tour.sale?.isActive && tour.sale.type === 'PERCENT' ? tour.sale.value : 0;
  const displayPrice =
    salePercent && basePrice > 0
      ? caculateSalePrice(basePrice, salePercent)
      : basePrice;
  const priceStr = basePrice > 0 ? fmtMoney(displayPrice) : '—';

  const span = formatNightsDays(days, nights);
  const avg = tour.ratingSummary?.average ?? 0;
  const total = tour.ratingSummary?.total ?? 0;

  return (
    <div
      className={
        className ??
        'rounded-[1.5rem] border border-charcoal/10 bg-sand-100/80 px-5 py-5 shadow-inner md:px-8 md:py-6'
      }
    >
      <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('tour.journey.meta.region', 'Region')}
          </dt>
          <dd className="mt-1.5 font-display text-lg text-charcoal">
            {regionLabel}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('tour.journey.meta.duration', 'Time on foot & road')}
          </dt>
          <dd className="mt-1.5 text-sm leading-snug text-mist">
            {durationLine}
            {span ? (
              <span className="mt-1 block text-xs text-charcoal/50">
                ({span})
              </span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('tour.journey.meta.planning', 'Indicative planning')}
          </dt>
          <dd className="mt-1.5 font-display text-lg text-charcoal">{priceStr}</dd>
          <dd className="mt-1 text-xs leading-relaxed text-mist">
            {t('tour.booking.from', 'From')} ·{' '}
            {tour.pricing?.currency ?? 'VND'}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('tour.journey.meta.travelers', 'Traveler voices')}
          </dt>
          <dd className="mt-1.5 text-sm text-charcoal">
            <span className="font-display text-xl text-charcoal">
              {avg > 0 ? avg.toFixed(2) : '—'}
            </span>
            <span className="text-mist"> · </span>
            <span className="text-mist">
              {t('tour.journey.meta.review_notes', {
                count: total,
                defaultValue: '{{count}} notes',
              })}
            </span>
          </dd>
        </div>
      </dl>
      {moodLabel ? (
        <p className="mt-6 border-t border-charcoal/10 pt-4 text-xs uppercase tracking-[0.24em] text-charcoal/55">
          {moodLabel}
        </p>
      ) : null}
    </div>
  );
}
