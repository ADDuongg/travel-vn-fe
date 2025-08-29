import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

interface BookingCardProps {
  BookingFormComponent: React.ReactNode;
  EnquiryFormComponent: React.ReactNode;
  price?: string; // giá (vd: "€92")
  badge?: string; // ví dụ: "Best Seller"
}

const BookingCard: React.FC<BookingCardProps> = ({
  BookingFormComponent,
  EnquiryFormComponent,
  price = '€92',
  badge = 'Best Seller',
}) => {
  const [tabValue, setTabValue] = useState<string>('booking');

  return (
    <Card className="w-full shadow-lg rounded-2xl p-5">
      <CardContent className="flex flex-col gap-4">
        {/* Header */}
        <div>
          <p className="text-sm text-gray-500 font-medium">{badge}</p>
          <p className="text-2xl font-bold">From {price}</p>
        </div>

        {/* Tabs */}
        <Tabs value={tabValue} onValueChange={setTabValue}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="booking">Booking Form</TabsTrigger>
            <TabsTrigger value="enquiry">Enquiry Form</TabsTrigger>
          </TabsList>

          {/* Booking Form */}
          <TabsContent value="booking" className="mt-4 space-y-4">
            {BookingFormComponent}
            <div className="flex justify-end items-center text-gray-500 text-sm mt-4 gap-10">
              <button className="flex items-center gap-1">
                <span>♡</span> Save To Wish List
              </button>
              <span>👁 6031</span>
            </div>
          </TabsContent>

          {/* Enquiry Form */}
          <TabsContent value="enquiry" className="mt-4">
            {EnquiryFormComponent}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
