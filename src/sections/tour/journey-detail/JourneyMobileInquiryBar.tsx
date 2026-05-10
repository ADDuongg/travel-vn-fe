import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { fmtMoney } from '@/utils';
import { caculateSalePrice } from '@/utils';
import type { Tour } from '@/features/tours/types';

type Props = {
  tour: Tour;
  onOpenBooking: () => void;
};

export function JourneyMobileInquiryBar({ tour, onOpenBooking }: Props) {
  const { t } = useTranslation();
  const basePrice = tour.pricing?.basePrice ?? 0;
  const salePercent =
    tour.sale?.isActive && tour.sale.type === 'PERCENT' ? tour.sale.value : 0;
  const displayPrice =
    salePercent && basePrice > 0
      ? caculateSalePrice(basePrice, salePercent)
      : basePrice;
  const priceStr = basePrice > 0 ? fmtMoney(displayPrice) : '—';

  const contactHref = `${ROUTES.CONTACT}?tour=${encodeURIComponent(tour.slug)}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal/15 bg-sand-50/92 px-4 py-3 shadow-[0_-12px_40px_-20px_oklch(22%_0.02_75/0.35)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('tour.journey.plan.from_label', 'Indicative from')}
          </p>
          <p className="truncate font-display text-xl text-charcoal">{priceStr}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to={contactHref}
            className="rounded-full border border-charcoal/15 px-3 py-2 text-xs font-semibold text-charcoal/80 transition hover:border-forest/35 hover:text-forest"
          >
            {t('tour.journey.mobile.note', 'Note')}
          </Link>
          <button
            type="button"
            onClick={onOpenBooking}
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-sand-50 shadow-[var(--shadow-soft)] transition hover:bg-forest-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
          >
            {t('tour.journey.mobile.book', 'Book')}
          </button>
        </div>
      </div>
    </div>
  );
}
