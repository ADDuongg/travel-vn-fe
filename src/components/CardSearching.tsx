import React from 'react';
import { Ratings } from './ui/rating';
import { getOfferLabel } from './TourCard';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { CardName } from '@components/ui/typography';
const CardSearching: React.FC<{ item: any }> = ({ item }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col w-full mx-auto">
      <div className="relative h-56 w-full">
        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full"
        />
        {(item.hasSpecialOffer || item.sale_percent) && (
          <div className="text-white text-[13px] font-semibold absolute z-[3] p-2 top-5 right-5 bg-primary rounded-md">
            {getOfferLabel(item)}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <CardName className="leading-tight mb-2">{item.name}</CardName>
        <div className="flex items-center gap-2 mb-1">
          <Ratings
            rating={item.rate ?? 5}
            variant="yellow"
            totalStars={5}
            readOnly
            size={12}
          />
          <span className="text-gray-400 text-xs">
            ({item.review_number ?? 1} Review
            {(item.review_number ?? 1) > 1 ? 's' : ''})
          </span>
        </div>
        <div className="flex items-center gap-2 my-2">
          <AiOutlineClockCircle className="text-primary" size={16} />
          <span className="text-gray-400 text-xs">{item.duration}</span>
        </div>
        <div>
          {item.sale_price ? (
            <span className="text-gray-400 line-through text-md mr-2">
              ${item.price}
            </span>
          ) : (
            <span className="text-gray-400 text-md mr-2">From</span>
          )}
          <span className="text-primary font-semibold text-lg">
            ${item.sale_price ? item.sale_price : item.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardSearching;
