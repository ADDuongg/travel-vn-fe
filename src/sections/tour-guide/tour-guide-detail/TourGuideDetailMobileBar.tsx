import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import type { TourGuide } from '@/features/tour-guide/types';
import { fmtMoney } from '@/utils';

type TourGuideDetailMobileBarProps = {
  guide: TourGuide;
};

export function TourGuideDetailMobileBar({ guide }: TourGuideDetailMobileBarProps) {
  const { t } = useTranslation();
  const contactHref = `${ROUTES.CONTACT}?guide=${encodeURIComponent(guide._id)}`;
  const priceLabel =
    guide.dailyRate != null && guide.dailyRate > 0
      ? fmtMoney(guide.dailyRate, guide.currency)
      : t('tour_guide.contact_for_price');

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal/15 bg-sand-50/92 px-4 py-3 shadow-[0_-12px_40px_-20px_oklch(22%_0.02_75/0.35)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] uppercase tracking-[0.28em] text-charcoal/45">
            {t('tour_guide.detail.mobile_day_fee')}
          </p>
          <p className="truncate font-display text-lg text-charcoal">{priceLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to={contactHref}
            className="rounded-full border border-charcoal/15 px-3 py-2 text-xs font-semibold text-charcoal/80 transition hover:border-forest/35 hover:text-forest"
          >
            {t('tour_guide.detail.mobile_note')}
          </Link>
          <Link
            to={contactHref}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold text-sand-50 shadow-[var(--shadow-soft)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal ${
              guide.isAvailable
                ? 'bg-forest hover:bg-forest/90'
                : 'pointer-events-none bg-charcoal/40'
            }`}
            aria-disabled={!guide.isAvailable}
          >
            {t('tour_guide.detail.mobile_request')}
          </Link>
        </div>
      </div>
    </div>
  );
}
