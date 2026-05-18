import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { caculateSalePrice, fmtMoney } from '@/utils';
import RoomBookingForm from '../components/RoomBookingForm';
import type { Room } from '@/features/rooms/types';

type RoomFloatingBookingBarProps = {
  room: Room;
};

const RoomFloatingBookingBar = ({ room }: RoomFloatingBookingBarProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const basePrice = room.pricing?.basePrice ?? 0;
  const displayPrice =
    room.sale?.isActive && room.sale.type === 'PERCENT'
      ? caculateSalePrice(basePrice, room.sale.value)
      : room.sale?.isActive && room.sale.type === 'FIXED'
        ? Math.max(0, basePrice - room.sale.value)
        : basePrice;
  const priceStr = basePrice > 0 ? fmtMoney(displayPrice) : '—';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[rgba(28,26,20,0.1)] bg-white/95 px-4 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-[rgba(28,26,20,0.5)]">
            {t('room.booking.from', 'From')}
          </p>
          <p
            className="text-xl font-bold leading-none text-[#c8102e] sm:text-2xl"
            style={{
              fontFamily: 'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
            }}
          >
            {priceStr}
          </p>
        </div>
        <Button
          type="button"
          className="min-h-11 min-w-[8rem] shrink-0 cursor-pointer bg-[#c8102e] text-[15px] font-medium text-white shadow-[0_8px_24px_rgba(200,16,46,0.3)] hover:bg-[#a50d25]"
          onClick={() => setOpen(true)}
        >
          {t('room.booking.book_now', 'Book now')}
        </Button>
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="text-left text-[#1c1a14]">
              {t('room.booking.drawer_title', 'Book this room')}
            </DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto overscroll-contain px-4 pb-8" data-vaul-no-drag>
            <RoomBookingForm room={room} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default RoomFloatingBookingBar;

