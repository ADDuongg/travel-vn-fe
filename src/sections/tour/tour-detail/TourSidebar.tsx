import React from 'react';
import BookingCard from '@/sections/shared/BookingCard';
import { Card } from '@/components/ui/card';
import { MdThumbUp, MdOutlineEmail } from 'react-icons/md';
import { FiPhone } from 'react-icons/fi';
import { AiOutlineStar } from 'react-icons/ai';
import { BsGlobe2 } from 'react-icons/bs';
import TourBookingForm from '../components/TourBookingForm';
import EnquiryForm from '@/sections/shared/EnquiryForm';
import { useTourDetail } from './TourDetailContext';
import { fmtMoney } from '@/utils';
import { caculateSalePrice } from '@/utils';

const ConfidenceBox = () => (
  <Card className="mt-6 p-6 shadow-sm rounded-2xl shadow-lg">
    <h3 className="font-bold text-lg mb-4">Book With Confidence</h3>
    <ul className="flex flex-col gap-3 text-sm text-gray-600">
      <li className="flex items-center gap-2">
        <MdThumbUp className="text-blue-500" /> Best price guarantee
      </li>
      <li className="flex items-center gap-2">
        <FiPhone className="text-blue-500" /> 24/7 Customer care
      </li>
      <li className="flex items-center gap-2">
        <AiOutlineStar className="text-blue-500" /> Hand-picked Tours
      </li>
      <li className="flex items-center gap-2">
        <BsGlobe2 className="text-blue-500" /> Free Insurance
      </li>
    </ul>
  </Card>
);

const TourSidebar: React.FC = () => {
  const tour = useTourDetail();
  const basePrice = tour?.pricing?.basePrice ?? 0;
  const salePercent =
    tour?.sale?.isActive && tour.sale.type === 'PERCENT' ? tour.sale.value : 0;
  const displayPrice = salePercent ? caculateSalePrice(basePrice, salePercent) : basePrice;
  const priceStr = basePrice > 0 ? fmtMoney(displayPrice) : '—';
  const badge = salePercent > 0 ? `${salePercent}% Off` : 'Best Price';

  return (
    <>
      <BookingCard
        price={priceStr}
        badge={badge}
        BookingFormComponent={<TourBookingForm tour={tour} />}
        EnquiryFormComponent={<EnquiryForm />}
      />
      <ConfidenceBox />
      {tour?.contact && (tour.contact.phone || tour.contact.email) && (
        <div className="mt-6 border rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4">Need Help?</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-600">
            {tour.contact.phone && (
              <li className="flex items-center gap-2">
                <FiPhone className="text-blue-500" /> {tour.contact.phone}
              </li>
            )}
            {tour.contact.email && (
              <li className="flex items-center gap-2">
                <MdOutlineEmail className="text-blue-500" /> {tour.contact.email}
              </li>
            )}
            {tour.contact.hotline && (
              <li className="flex items-center gap-2">
                <FiPhone className="text-blue-500" /> {tour.contact.hotline}
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default TourSidebar;
