import React from 'react';
import { Card } from '@/components/ui/card';
import { FaBed, FaUserGroup } from 'react-icons/fa6';

export interface RoomItem {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
  rating: number;
  oldPrice?: number;
  discount?: string;
  guests: number;
  beds: string;
  reviewCount: number;
}

interface RoomCardProps {
  item: RoomItem;
}

const RoomCard: React.FC<RoomCardProps> = ({ item }) => {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition flex flex-col">
      {/* Image */}
      <div className="relative w-full h-56">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />

        {/* Discount badge */}
        {item.discount && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded">
            {item.discount}
          </div>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3 bg-black text-white text-sm font-semibold px-4 py-2 rounded">
          From{' '}
          {item.oldPrice && (
            <span className="line-through opacity-70 mr-1">
              €{item.oldPrice}
            </span>
          )}
          €{item.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        {/* Title */}
        <h3 className="font-bold text-lg mb-3">{item.title}</h3>

        {/* Meta Info */}
        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <FaBed size={18} /> <span>{item.beds}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUserGroup size={18} /> <span>{item.guests}</span>
          </div>
        </div>

        {/* CTA */}
        <button className="text-sm font-semibold tracking-wide uppercase flex items-center gap-2 hover:gap-3 transition-all">
          Book Now <span>→</span>
        </button>
      </div>
    </Card>
  );
};

export default RoomCard;
