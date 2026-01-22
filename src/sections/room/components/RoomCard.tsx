import React from 'react';
import { Card } from '@/components/ui/card';
import { FaBed, FaUserGroup } from 'react-icons/fa6';
import type { Room } from '@/features/rooms/types';

interface RoomCardProps {
  item: Room;
  lang?: string; // ngôn ngữ hiển thị
}

const RoomCard: React.FC<RoomCardProps> = ({ item, lang = 'vi' }) => {
  const translation = item.translations?.[lang];

  const imageUrl = item.thumbnail?.url ?? 'https://via.placeholder.com/600x400';

  const basePrice = item.pricing?.basePrice || 0;
  const currency = item.pricing?.currency;

  let finalPrice = basePrice;
  let oldPrice: number | undefined;
  let discountLabel: string | undefined;

  if (item.sale?.isActive) {
    oldPrice = basePrice;

    if (item.sale.type === 'PERCENT') {
      finalPrice = Math.round(basePrice * (1 - item.sale.value / 100));
      discountLabel = `-${item.sale.value}%`;
    }

    if (item.sale.type === 'FIXED') {
      finalPrice = Math.max(0, basePrice - item.sale.value);
      discountLabel = `-${item.sale.value}${currency}`;
    }
  }

  /* ================= CAPACITY ================= */
  const totalGuests = item.adults + item.children;

  return (
    <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition flex flex-col">
      {/* Image */}
      <div className="relative w-full h-56">
        <img
          src={imageUrl}
          alt={item.thumbnail?.alt ?? translation?.name}
          className="w-full h-full object-cover"
        />

        {/* Discount badge */}
        {discountLabel && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded">
            {discountLabel}
          </div>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3 bg-black text-white text-sm font-semibold px-4 py-2 rounded">
          From{' '}
          {oldPrice && (
            <span className="line-through opacity-70 mr-1">
              {oldPrice.toLocaleString()} {currency}
            </span>
          )}
          {finalPrice.toLocaleString()} {currency}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        {/* Title */}
        <div className="mb-2">
          {item.roomType && (
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              {item.roomType}
            </span>
          )}
          <h3 className="font-bold text-lg">
            {translation?.name ?? item.code}
          </h3>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <FaBed size={18} />
            <span>{item.roomSize ? `${item.roomSize} m²` : 'Room'}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUserGroup size={18} />
            <span>
              {totalGuests} / {item.maxGuests} Guests
            </span>
          </div>
        </div>

        {/* Rating */}
        {item.ratingSummary?.total > 0 && (
          <div className="text-sm text-gray-500 mb-3">
            ⭐ {item.ratingSummary.average.toFixed(1)} (
            {item.ratingSummary.total} reviews)
          </div>
        )}

        {/* CTA */}
        <button className="text-sm font-semibold tracking-wide uppercase flex items-center gap-2 hover:gap-3 transition-all">
          View Detail <span>→</span>
        </button>
      </div>
    </Card>
  );
};

export default RoomCard;
