import React from 'react';
import { SubTitle } from '@components/ui/typography';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

const TourDetail: React.FC = () => {
  return (
    <section id="detail" className="mt-6">
      <h2 className="text-xl font-bold mb-4">Detail</h2>

      <div className="mt-4 space-y-4 text-paleGray leading-relaxed">
        <p>
          Leave your guidebooks at home and dive into the local cultures that
          make each destination so special...
        </p>
        <p>A wonderful serenity has taken possession of my entire soul...</p>
      </div>

      <div className="mt-8">
        <h4 className="font-semibold text-lg mb-3">Price Includes</h4>
        <ul className="space-y-2 text-paleGray">
          <li className="flex items-center gap-2">
            <AiOutlineCheck className="text-green-600" size={20} /> Air fares
          </li>
          <li className="flex items-center gap-2">
            <AiOutlineCheck className="text-green-600" size={20} /> 3 Nights
            Hotel Accomodation
          </li>
          <li className="flex items-center gap-2">
            <AiOutlineCheck className="text-green-600" size={20} /> On Trip
            Transport
          </li>
          <li className="flex items-center gap-2">
            <AiOutlineCheck className="text-green-600" size={20} /> 2 Meals /
            day
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <h4 className="font-semibold text-lg mb-3">Price Excludes</h4>
        <ul className="space-y-2 text-paleGray">
          <li className="flex items-center gap-2">
            <AiOutlineClose className="text-red-500" size={20} /> Driver Service
            Fee
          </li>
          <li className="flex items-center gap-2">
            <AiOutlineClose className="text-red-500" size={20} /> Guide Service
            Fee
          </li>
          <li className="flex items-center gap-2">
            <AiOutlineClose className="text-red-500" size={20} /> Room Service
            Fees
          </li>
        </ul>
      </div>
    </section>
  );
};

export default TourDetail;
