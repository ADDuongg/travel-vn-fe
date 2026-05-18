import { caculateSalePrice } from '@utils/index';
import React, { useMemo } from 'react';
import { Ratings } from './ui/rating';

export interface TourItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  tour_number: number;
  sale_percent?: number;
  duration?: string;
  hasSpecialOffer?: boolean;
  bestSeller?: boolean;
  review_number?: number;
  rate?: number;
}

export const getOfferLabel = (item: TourItem) => {
  if (item.bestSeller) return 'Best Seller';
  if (item.hasSpecialOffer) return 'Special Offer';
  if (item.sale_percent) return `${item.sale_percent}% Off`;
  return '';
};

const TourCard: React.FC<{ item: TourItem }> = ({ item }) => {
  const salePrice = useMemo(
    () =>
      item.sale_percent
        ? caculateSalePrice(item.price, item.sale_percent)
        : null,
    [item.price, item.sale_percent],
  );
  return (
    <div className="tour-card relative overflow-hidden group h-[500px]">
      <img
        src={item.image}
        alt="img"
        className="relative z-[1] w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[2]" />
      {(item.hasSpecialOffer || item.sale_percent) && (
        <div className="text-white text-[13px] font-semibold absolute z-[3] p-2 top-5 right-5 bg-primary rounded-md">
          {getOfferLabel(item)}
        </div>
      )}
      <div className="absolute bottom-0 w-full z-[4] p-4 flex flex-col items-center justify-end text-center gap-5 transition-all duration-500 ease-in-out group-hover:translate-y-0 translate-y-12 pb-5">
        <span className="text-white font-dm-serif-display text-3xl">
          {item.name}
        </span>
        <div className="opacity-0 w-full group-hover:opacity-100 px-5 transition-opacity duration-300 flex gap-2 items-center justify-between">
          <div className="flex flex-col items-start ">
            <div className="text-white">{item.duration}</div>
            <div className="flex items-center ju [&_svg]:inline-block">
              <Ratings
                rating={item.rate ?? 2.5}
                variant="yellow"
                totalStars={5}
                readOnly
                size={14}
              />
              <span className="text-paleGray text-[12px]">
                ({item.review_number ?? 1} review
                {item.review_number && item.review_number > 1 ? 's' : ''})
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start ">
            {salePrice && (
              <div className={`text-paleGray line-through text-sm`}>
                ${salePrice}
              </div>
            )}
            <div className="text-md text-white">${item.price}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;

