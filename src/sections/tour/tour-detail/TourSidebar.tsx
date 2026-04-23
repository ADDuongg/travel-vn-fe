import React from 'react';
import { useTranslation } from 'react-i18next';
import BookingCard from '@/sections/shared/BookingCard';
import { Card } from '@/components/ui/card';
import {
  ShieldCheck,
  Headphones,
  Star,
  Globe,
  Phone,
  Mail,
} from 'lucide-react';
import TourBookingForm from '../components/TourBookingForm';
import EnquiryForm from '@/sections/shared/EnquiryForm';
import { fmtMoney } from '@/utils';
import { caculateSalePrice } from '@/utils';
import { cn } from '@/lib/utils';
import type { Tour } from '@/features/tours/types';

const ConfidenceBox = () => {
  const { t } = useTranslation();
  const items = [
    { icon: ShieldCheck, key: 'price' as const },
    { icon: Headphones, key: 'support' as const },
    { icon: Star, key: 'curated' as const },
    { icon: Globe, key: 'insurance' as const },
  ];
  return (
    <Card className="mt-6 rounded-2xl border border-[rgba(28,26,20,0.1)] p-6 shadow-[var(--shadow-card)]">
      <h3
        className="mb-4 font-['Playfair_Display',serif] text-lg font-bold text-[#1c1a14]"
        style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
      >
        {t('tour.confidence.title', 'Book with confidence')}
      </h3>
      <ul className="flex flex-col gap-3 text-sm text-[rgba(28,26,20,0.7)]">
        {items.map(({ icon: Icon, key }) => (
          <li key={key} className="flex items-center gap-2.5">
            <Icon
              className="size-4 shrink-0 text-[#2d6a4f]"
              strokeWidth={2.25}
              aria-hidden
            />
            {t(`tour.confidence.${key}`)}
          </li>
        ))}
      </ul>
    </Card>
  );
};

type TourSidebarProps = {
  tour: Tour;
};

const TourSidebar: React.FC<TourSidebarProps> = ({ tour }) => {
  const { t } = useTranslation();
  const basePrice = tour.pricing?.basePrice ?? 0;
  const salePercent =
    tour.sale?.isActive && tour.sale.type === 'PERCENT' ? tour.sale.value : 0;
  const displayPrice = salePercent
    ? caculateSalePrice(basePrice, salePercent)
    : basePrice;
  const priceStr = basePrice > 0 ? fmtMoney(displayPrice) : '—';
  const badge =
    salePercent > 0
      ? t('tour.booking.sale_badge', {
          defaultValue: '-{{percent}}% · limited',
          percent: salePercent,
        })
      : t('tour.booking.best_value', 'Handpicked for you');

  return (
    <div
      className={cn(
        'space-y-0',
        // MainLayout header 136px + tabs (py-3 md:py-4) + 8px gap — avoids card top border under z-20 tab bar
        'lg:sticky lg:top-[calc(136px+4rem+8px)] lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pb-8',
      )}
    >
      <BookingCard
        variant="tour"
        price={priceStr}
        badge={badge}
        BookingFormComponent={<TourBookingForm tour={tour} />}
        EnquiryFormComponent={<EnquiryForm />}
      />
      <ConfidenceBox />
      {tour?.contact && (tour.contact.phone || tour.contact.email) && (
        <div className="mt-6 rounded-2xl border border-[rgba(28,26,20,0.1)] p-6 shadow-[var(--shadow-card)]">
          <h3
            className="mb-4 font-['Playfair_Display',serif] text-lg font-bold text-[#1c1a14]"
            style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
          >
            {t('tour.contact.need_help', 'Need help?')}
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-[rgba(28,26,20,0.7)]">
            {tour.contact.phone && (
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-[#2d6a4f]" aria-hidden />
                {tour.contact.phone}
              </li>
            )}
            {tour.contact.email && (
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-[#2d6a4f]" aria-hidden />
                {tour.contact.email}
              </li>
            )}
            {tour.contact.hotline && (
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-[#2d6a4f]" aria-hidden />
                {tour.contact.hotline}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TourSidebar;
