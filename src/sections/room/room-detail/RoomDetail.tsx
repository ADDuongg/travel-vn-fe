import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { fmtMoney } from '@/utils';
import { caculateSalePrice } from '@/utils';
import type { Room } from '@/features/rooms/types';

type RoomDetailProps = {
  room: Room;
};

const RoomDetail = ({ room }: RoomDetailProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const translation =
    room.translations?.[language] ??
    room.translations?.vi ??
    room.translations?.en;
  const description = translation?.description ?? '';
  const basePrice = room.pricing?.basePrice ?? 0;
  const salePrice =
    room.sale?.isActive && room.sale.type === 'PERCENT'
      ? caculateSalePrice(basePrice, room.sale.value)
      : room.sale?.isActive && room.sale.type === 'FIXED'
        ? Math.max(0, basePrice - room.sale.value)
        : basePrice;
  const hasSale = salePrice < basePrice;
  const currency = room.pricing?.currency ?? 'VND';

  return (
    <section id="overview" className="scroll-mt-40">
      <Card className="border border-[rgba(28,26,20,0.1)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <h2
          className="mb-4 font-['Playfair_Display',serif] text-2xl font-bold tracking-[-0.02em] text-[#1c1a14] sm:text-[1.75rem]"
          style={{
            fontFamily: 'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
          }}
        >
          {t('room.detail.overview', 'Overview')}
        </h2>
        <div className="flex items-baseline gap-2">
          <span className="text-lg text-[rgba(28,26,20,0.6)]">
            {t('room.from', 'From')}
          </span>
          {hasSale && (
            <span className="text-base text-[rgba(28,26,20,0.45)] line-through">
              {fmtMoney(basePrice)} {currency}
            </span>
          )}
          <span
            className="text-2xl font-bold text-[#c8102e]"
            style={{
              fontFamily:
                'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
            }}
          >
            {fmtMoney(salePrice)} {currency}
          </span>
        </div>
        <p className="mt-1 text-sm text-[rgba(28,26,20,0.5)]">
          {t('room.detail.per_night', 'per night')}
        </p>
        <p className="mt-6 whitespace-pre-line text-base leading-[1.65] text-[rgba(28,26,20,0.75)]">
          {description}
        </p>
      </Card>
    </section>
  );
};

export default RoomDetail;

