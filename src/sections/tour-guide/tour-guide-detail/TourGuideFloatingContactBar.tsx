import { Button } from '@/components/ui/button';
import type { TourGuide } from '@/features/tour-guide/types';
import { fmtMoney } from '@/utils';
import { useTranslation } from 'react-i18next';

type TourGuideFloatingContactBarProps = {
  guide: TourGuide;
};

export function TourGuideFloatingContactBar({
  guide,
}: TourGuideFloatingContactBarProps) {
  const { t } = useTranslation();
  const priceLabel =
    guide.dailyRate != null && guide.dailyRate > 0
      ? fmtMoney(guide.dailyRate, guide.currency)
      : t('tour_guide.contact_for_price', 'Contact for price');

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/12 bg-sand-50/95 p-3 shadow-[0_-12px_40px_-20px_oklch(22%_0.02_75/0.35)] backdrop-blur-md supports-[backdrop-filter]:bg-sand-50/82 lg:hidden">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-1">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.16em] text-charcoal/45">
            {t('tour_guide.daily_rate')}
          </p>
          <p className="truncate font-display text-lg font-semibold text-sunset-deep">
            {priceLabel}
          </p>
        </div>
        <Button
          className="h-10 min-w-[132px] bg-forest text-sand-50 hover:bg-forest/92"
          disabled={!guide.isAvailable}
        >
          {t('tour_guide.contact_guide')}
        </Button>
      </div>
    </div>
  );
}
