import React from 'react';
import BookingCard from '@/sections/shared/BookingCard';
import { Card } from '@components/ui/card';
import { MdThumbUp } from 'react-icons/md';
import { FiPhone } from 'react-icons/fi';
import { AiOutlineStar } from 'react-icons/ai';
import { BsGlobe2 } from 'react-icons/bs';
import { MdOutlineEmail } from 'react-icons/md';
import TourBookingForm from '../components/TourBookingForm';
import EnquiryForm from '@/sections/shared/EnquiryForm';

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

const HelpBox = () => (
  <div className="mt-6 border rounded-2xl p-6 shadow-lg">
    <h3 className="font-bold text-lg mb-4">Need Help?</h3>
    <ul className="flex flex-col gap-3 text-sm text-gray-600">
      <li className="flex items-center gap-2">
        <FiPhone className="text-blue-500" /> 1.8445.3356.33
      </li>
      <li className="flex items-center gap-2">
        <MdOutlineEmail className="text-blue-500" /> Help@goodlayers.com
      </li>
    </ul>
  </div>
);

const TourSidebar: React.FC = () => (
  <>
    <BookingCard
      BookingFormComponent={<TourBookingForm />}
      EnquiryFormComponent={<EnquiryForm />}
    />
    <ConfidenceBox />
    <HelpBox />
  </>
);

export default TourSidebar;
