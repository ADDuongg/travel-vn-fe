import BookingCard from '@/sections/shared/BookingCard';
import { Card } from '@components/ui/card';
import {
  ShieldCheck,
  Headphones,
  Star,
  Globe,
  Phone,
  Mail,
} from 'lucide-react';
import RoomBookingForm from '../components/RoomBookingForm';
import EnquiryForm from '@/sections/shared/EnquiryForm';
import { useTranslation } from 'react-i18next';
import { caculateSalePrice, fmtMoney } from '@/utils';
import { cn } from '@/lib/utils';
import type { Room } from '@/features/rooms/types';

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
        style={{
          fontFamily: 'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
        }}
      >
        {t('room.confidence.title', 'Book with confidence')}
      </h3>
      <ul className="flex flex-col gap-3 text-sm text-[rgba(28,26,20,0.7)]">
        {items.map(({ icon: Icon, key }) => (
          <li key={key} className="flex items-center gap-2.5">
            <Icon className="size-4 shrink-0 text-[#2d6a4f]" strokeWidth={2.25} />
            {t(`tour.confidence.${key}`)}
          </li>
        ))}
      </ul>
    </Card>
  );
};

const HelpBox = ({ room }: { room: Room }) => {
  const { t } = useTranslation();
  const hotel = room.hotelId && typeof room.hotelId === 'object' ? room.hotelId : null;
  const contact = hotel?.contact;
  if (!contact?.phone && !contact?.email) return null;

  return (
    <div className="mt-6 rounded-2xl border border-[rgba(28,26,20,0.1)] p-6 shadow-[var(--shadow-card)]">
      <h3
        className="mb-4 font-['Playfair_Display',serif] text-lg font-bold text-[#1c1a14]"
        style={{
          fontFamily: 'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
        }}
      >
        {t('room.contact.need_help', 'Need help?')}
      </h3>
      <ul className="flex flex-col gap-3 text-sm text-[rgba(28,26,20,0.7)]">
        {contact.phone && (
          <li className="flex items-center gap-2">
            <Phone className="size-4 shrink-0 text-[#2d6a4f]" />
            {contact.phone}
          </li>
        )}
        {contact.email && (
          <li className="flex items-center gap-2">
            <Mail className="size-4 shrink-0 text-[#2d6a4f]" />
            {contact.email}
          </li>
        )}
      </ul>
    </div>
  );
};

type RoomSidebarProps = {
  room: Room;
};

const RoomSidebar = ({ room }: RoomSidebarProps) => {
  const { t } = useTranslation();
  const basePrice = room.pricing?.basePrice ?? 0;
  const displayPrice =
    room.sale?.isActive && room.sale.type === 'PERCENT'
      ? caculateSalePrice(basePrice, room.sale.value)
      : room.sale?.isActive && room.sale.type === 'FIXED'
        ? Math.max(0, basePrice - room.sale.value)
        : basePrice;
  const salePercent = room.sale?.isActive && room.sale.type === 'PERCENT' ? room.sale.value : 0;
  const priceStr = basePrice > 0 ? fmtMoney(displayPrice) : '—';
  const badge =
    salePercent > 0
      ? t('room.booking.sale_badge', {
          defaultValue: '-{{percent}}% · limited',
          percent: salePercent,
        })
      : t('room.booking.best_value', 'Recommended stay');

  return (
    <div
      className={cn(
        'space-y-0',
        'lg:sticky lg:top-[calc(136px+4rem+8px)] lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pb-8',
      )}
    >
      <BookingCard
        variant="tour"
        price={priceStr}
        badge={badge}
        BookingFormComponent={<RoomBookingForm room={room} />}
        EnquiryFormComponent={<EnquiryForm />}
      />
      <ConfidenceBox />
      <HelpBox room={room} />
    </div>
  );
};

export default RoomSidebar;

