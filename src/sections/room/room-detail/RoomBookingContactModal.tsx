import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import RoomBookingForm from '@/sections/room/components/RoomBookingForm';
import { ContactEditorialInquiryForm } from '@/sections/shared/ContactEditorialInquiryForm';
import type { Room, HotelRef } from '@/features/rooms/types';
import { fmtMoney, caculateSalePrice } from '@/utils';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room;
  lang: string;
  contactHref: string;
  defaultJourneyInterest: string;
};

function isHotelRef(h: string | HotelRef | undefined): h is HotelRef {
  return Boolean(h && typeof h === 'object' && '_id' in h);
}

export function RoomBookingContactModal({
  open,
  onOpenChange,
  room,
  lang,
  contactHref,
  defaultJourneyInterest,
}: Props) {
  const { t } = useTranslation();
  const hotel = isHotelRef(room.hotelId) ? room.hotelId : null;

  const basePrice = room.pricing?.basePrice ?? 0;
  const weekend = room.pricing?.weekendPrice;
  const currency = room.pricing?.currency ?? 'VND';
  let displayPrice = basePrice;
  if (room.sale?.isActive && room.sale.type === 'PERCENT') {
    displayPrice = caculateSalePrice(basePrice, room.sale.value);
  } else if (room.sale?.isActive && room.sale.type === 'FIXED') {
    displayPrice = Math.max(0, basePrice - room.sale.value);
  }

  const roomName =
    room.translations?.[lang]?.name ??
    room.translations?.vi?.name ??
    room.translations?.en?.name ??
    room.code;
  const hotelTitle =
    hotel?.translations?.[lang]?.name ??
    hotel?.translations?.vi?.name ??
    hotel?.translations?.en?.name ??
    '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-50 bg-charcoal/45 backdrop-blur-[2px]"
        className={cn(
          'z-50 flex max-h-[min(92svh,880px)] w-full max-w-lg flex-col gap-0 overflow-hidden rounded-[1.85rem] border border-charcoal/12 bg-sand-50 p-0 shadow-soft sm:max-h-[90vh]',
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-charcoal/10 px-6 py-5 md:px-8">
          <DialogHeader className="flex-1 space-y-0 text-left">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('room.editorial.modal_eyebrow')}
            </p>
            <DialogTitle className="mt-2 font-display text-2xl text-charcoal md:text-3xl">
              {t('room.editorial.modal_title')}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-mist">
              {t('room.editorial.modal_description')}
            </DialogDescription>
          </DialogHeader>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="shrink-0 rounded-full border-charcoal/15 bg-sand-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/70 hover:border-charcoal/30 hover:text-charcoal"
          >
            {t('room.editorial.modal_close', 'Close')}
          </Button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-6 py-6 md:px-8 md:py-8">
          <div className="mb-6 rounded-[1.25rem] border border-charcoal/10 bg-sand-100/90 px-4 py-3">
            <p className="font-display text-lg text-charcoal">{roomName}</p>
            {hotelTitle ? <p className="mt-1 text-xs text-mist">{hotelTitle}</p> : null}
            <p className="mt-2 text-sm text-charcoal">
              {t('room.from', 'From')}{' '}
              <span className="font-mono font-medium">{fmtMoney(displayPrice, currency)}</span>
              {weekend ? (
                <span className="ms-2 text-mist">
                  {t('room.editorial.weekend_tier', 'Weekend tier')} {fmtMoney(weekend, currency)}
                </span>
              ) : null}
              <span className="text-mist"> · {currency}</span>
            </p>
          </div>

          <div className="space-y-2 border-b border-charcoal/10 pb-8">
            <p className="text-sm font-medium text-charcoal/80">
              {t('room.editorial.modal_booking_section', 'Dates & hold')}
            </p>
            <RoomBookingForm room={room} visualVariant="editorial" />
          </div>

          <div className="pt-8">
            <ContactEditorialInquiryForm
              mode="embedded"
              guideJourneyPrefill={defaultJourneyInterest}
              conversationPick={null}
            />
          </div>

          <div className="mt-8 border-t border-charcoal/10 pt-6">
            <Link
              to={contactHref}
              onClick={() => onOpenChange(false)}
              className="text-center text-sm font-semibold text-forest underline-offset-4 hover:text-sunset-deep hover:underline"
            >
              {t('room.editorial.modal_full_contact', 'Prefer a longer letter — open full contact page')}
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
