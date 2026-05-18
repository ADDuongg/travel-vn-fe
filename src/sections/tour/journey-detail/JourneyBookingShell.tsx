import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import TourBookingForm from '@/sections/tour/components/TourBookingForm';
import type { Tour } from '@/features/tours/types';

type Props = {
  open: boolean;
  onClose: () => void;
  tour: Tour;
};

export function JourneyBookingShell({ open, onClose, tour }: Props) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[min(92vh,880px)] w-full max-w-lg min-h-0 flex-col gap-0 overflow-hidden rounded-[1.85rem] border-charcoal/12 bg-sand-50 p-0 shadow-[var(--shadow-soft)] sm:max-h-[90vh]">
        <DialogHeader className="shrink-0 border-b border-charcoal/10 px-6 py-5 md:px-8">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('tour.journey.booking.kicker', 'Hold dates')}
          </p>
          <DialogTitle className="mt-2 font-display text-2xl text-charcoal md:text-3xl">
            {t('tour.journey.booking.title', 'Request this journey')}
          </DialogTitle>
          <p className="mt-1 text-sm text-mist">
            {t(
              'tour.journey.booking.subtitle',
              'Same booking flow as our live tours — pick a departure and we will confirm.',
            )}
          </p>
        </DialogHeader>
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 md:px-8 md:py-8"
          data-vaul-no-drag
        >
          <TourBookingForm tour={tour} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

