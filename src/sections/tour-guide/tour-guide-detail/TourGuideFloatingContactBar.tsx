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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(28,26,20,0.12)] bg-white/95 p-3 shadow-[0_-8px_30px_rgba(28,26,20,0.12)] backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-[rgba(28,26,20,0.55)]">{t('tour_guide.daily_rate')}</p>
          <p className="truncate text-base font-bold text-[#c8102e]">{priceLabel}</p>
        </div>
        <Button className="h-10 min-w-[132px]" disabled={!guide.isAvailable}>
          {t('tour_guide.contact_guide')}
        </Button>
      </div>
    </div>
  );
}
