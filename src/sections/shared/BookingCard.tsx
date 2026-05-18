import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BookingCardProps {
  BookingFormComponent: React.ReactNode;
  EnquiryFormComponent: React.ReactNode;
  price?: string;
  badge?: string;

  variant?: 'default' | 'tour';
}

const BookingCard: React.FC<BookingCardProps> = ({
  BookingFormComponent,
  EnquiryFormComponent,
  price = '€92',
  badge = 'Best Seller',
  variant = 'default',
}) => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState<string>('booking');
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  if (variant === 'tour') {
    return (
      <Card className="w-full rounded-2xl border border-[rgba(28,26,20,0.1)] p-5 shadow-[var(--shadow-elevated)]">
        <CardContent className="flex flex-col gap-4 p-0">
          <div>
            <p className="text-sm font-medium text-[rgba(28,26,20,0.5)]">
              {badge}
            </p>
            <p
              className="mt-1 text-2xl font-bold text-[#c8102e] sm:text-[1.75rem]"
              style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
            >
              {t('tour.booking.from', 'From')} {price}
            </p>
          </div>
          {BookingFormComponent}
          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer border-[rgba(28,26,20,0.2)] text-[#1c1a14] hover:bg-[#ede7d9]"
            onClick={() => setEnquiryOpen(true)}
          >
            {t('tour.booking.enquiry_cta', 'Request consultation')}
          </Button>
          <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
            <DialogContent className="max-h-[min(90vh,640px)] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-left font-['Playfair_Display',serif] text-xl text-[#1c1a14]">
                  {t('tour.booking.enquiry_title', 'Send an enquiry')}
                </DialogTitle>
              </DialogHeader>
              {EnquiryFormComponent}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg rounded-2xl p-5">
      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-gray-500 font-medium">{badge}</p>
          <p className="text-2xl font-bold">From {price}</p>
        </div>

        <Tabs value={tabValue} onValueChange={setTabValue}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="booking" className="cursor-pointer">
              {t('tour.booking.tab_booking', 'Booking Form')}
            </TabsTrigger>
            <TabsTrigger value="enquiry" className="cursor-pointer">
              {t('tour.booking.tab_enquiry', 'Enquiry Form')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="booking" className="mt-4 space-y-4">
            {BookingFormComponent}
          </TabsContent>

          <TabsContent value="enquiry" className="mt-4">
            {EnquiryFormComponent}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingCard;

