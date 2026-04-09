import React from 'react';
import { Ratings } from './ui/rating';
import { CardName } from '@components/ui/typography';
import clsx from 'clsx';
import { Button } from './ui/button';
import { getOfferLabel } from './TourCard';
import { EnumDisplayItem } from '@/constants/commons';

const CardSearchingFlex: React.FC<{
  item: any;
  displayType?: EnumDisplayItem;
  className?: string;
}> = ({ item, className }) => {
  return (
    <div
      className={clsx(
        'flex rounded-2xl shadow-md bg-white overflow-hidden',
        className,
      )}
    >
      {/* Image */}
      <div className="relative w-[260px] h-[200px] flex-shrink-0">
        <img
          src={item?.image}
          alt={item?.name}
          className="w-full h-full object-cover"
        />
        {(item.hasSpecialOffer || item.sale_percent || item.bestSeller) && (
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-sm px-3 py-1 rounded shadow">
            {getOfferLabel(item)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 px-6 py-4 items-center justify-between">
        {/* Left info */}
        <div className="flex flex-col gap-2">
          <CardName className="text-xl font-semibold">{item?.name}</CardName>
          {/* Optional: mô tả ngắn */}
          {item?.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-full w-px bg-gray-200 mx-4" />

        {/* Right info */}
        <div className="flex flex-col items-center gap-2 min-w-[120px]">
          <p className="text-sm text-gray-500">From</p>
          <p className="text-lg font-bold text-blue-600">€{item?.price}</p>
          <Ratings rating={item?.rating} size={16} />
          <p className="text-xs text-gray-400">
            ({item?.reviewCount || 0} Review{item?.reviewCount > 1 ? 's' : ''})
          </p>
          <Button className="shadow transition ">View Details</Button>
        </div>
      </div>
    </div>
  );
};

export default CardSearchingFlex;
