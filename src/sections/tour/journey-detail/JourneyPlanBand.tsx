import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { fmtMoney } from '@/utils';
import { caculateSalePrice } from '@/utils';
import type { Tour } from '@/features/tours/types';

type Props = {
  tour: Tour;
  planCopy: string;
  onOpenBooking: () => void;
};

export function JourneyPlanBand({ tour, planCopy, onOpenBooking }: Props) {
  const { t } = useTranslation();
  const basePrice = tour.pricing?.basePrice ?? 0;
  const salePercent =
    tour.sale?.isActive && tour.sale.type === 'PERCENT' ? tour.sale.value : 0;
  const displayPrice =
    salePercent && basePrice > 0
      ? caculateSalePrice(basePrice, salePercent)
      : basePrice;
  const priceStr = basePrice > 0 ? fmtMoney(displayPrice) : '—';
  const strike =
    salePercent > 0 && basePrice > 0 ? fmtMoney(basePrice) : null;

  const contactHref = `${ROUTES.CONTACT}?tour=${encodeURIComponent(tour.slug)}`;

  return (
    <div className="rounded-[2rem] border border-charcoal/10 bg-gradient-to-br from-sand-100 via-sand-50 to-sand-100 px-6 py-10 shadow-[var(--shadow-soft)] md:px-12 md:py-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div className="space-y-5">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('tour.journey.plan.kicker', 'Planning posture')}
          </p>
          <p className="max-w-prose text-lg leading-relaxed text-mist">{planCopy}</p>
          <p className="text-xs leading-relaxed text-charcoal/45">
            {t(
              'tour.journey.plan.disclaimer',
              'Prices and availability follow live inventory — our team confirms before payment.',
            )}
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-charcoal/10 bg-sand-50/90 p-6 md:p-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
              {t('tour.journey.plan.from_label', 'Indicative from')}
            </p>
            <p className="mt-2 font-display text-4xl text-charcoal md:text-[2.75rem]">
              {priceStr}
            </p>
            {strike ? (
              <p className="mt-1 text-sm text-mist line-through">{strike}</p>
            ) : null}
            <p className="mt-2 text-xs text-mist">
              {t('tour.booking.from', 'From')} · {tour.pricing?.currency ?? 'VND'}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenBooking}
            className="inline-flex w-full items-center justify-center rounded-full bg-charcoal px-8 py-3.5 text-center text-sm font-semibold text-sand-50 shadow-[var(--shadow-soft)] transition hover:bg-charcoal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            {t('tour.journey.plan.cta_book', 'Book this journey')}
          </button>
          <Link
            to={contactHref}
            className="text-center text-sm font-semibold text-forest underline-offset-4 hover:text-sunset-deep hover:underline"
          >
            {t('tour.journey.plan.cta_contact', 'Prefer a letter first — write to us')}
          </Link>
        </div>
      </div>
    </div>
  );
}
