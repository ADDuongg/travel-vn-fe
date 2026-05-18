import React from 'react';
import { Ratings } from './ui/rating';

export interface FreshlyTourItem {
  id: number;
  name: string;
  image: string;
  price: number;
  sale_price?: number;
  bestSeller?: boolean;
  review_number?: number;
  rate?: number;
}

const CardWithRating: React.FC<{ item: any }> = ({ item }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col w-full max-w-xs mx-auto">
      <div className="relative h-56 w-full">
        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full"
        />
        {item.bestSeller && (
          <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-md">
            Best Seller
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="font-dm-serif-display text-lg font-bold text-gray-900 leading-tight mb-2">
          {item.name}
        </h3>
        <div className="flex items-center gap-2 mb-1">
          <Ratings
            rating={item.rate ?? 5}
            variant="yellow"
            totalStars={5}
            readOnly
            size={16}
          />
          <span className="text-gray-400 text-xs">
            ({item.review_number ?? 1} Review
            {(item.review_number ?? 1) > 1 ? 's' : ''})
          </span>
        </div>
        <div className="mt-2">
          {item.sale_price && (
            <span className="text-gray-400 line-through text-sm mr-2">
              ${item.price}
            </span>
          )}
          <span className="text-blue-500 font-semibold text-lg">
            ${item.sale_price ? item.sale_price : item.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardWithRating;

