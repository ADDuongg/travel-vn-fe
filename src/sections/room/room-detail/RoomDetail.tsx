import React from 'react';
import { Separator } from '@components/ui/separator';
import type { Room } from '@/features/rooms/types';
import { EnumLanguage } from '@/constants/commons';
import { useI18nStorage } from '@/hooks/useI18nStorage';

const RoomDetail = ({ room }: { room: Room }) => {
  const [value] = useI18nStorage(EnumLanguage.DEFAULT);
  console.log('room', room);

  return (
    <section id="room-detail" className="mt-6">
      {/* Price Section */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl text-black">From</span>

          {room.pricing && (
            <span className="text-gray-400 line-through text-lg">
              €{room.pricing.basePrice.toFixed(2)}
            </span>
          )}

          <span className="text-2xl font-bold text-black">
            €{room.sale?.value.toFixed(2)}
          </span>
        </div>

        <p className="text-gray-500 text-md">per night</p>
      </div>

      <Separator className="my-6" />

      {/* Description */}
      <div
        className="space-y-4 text-paleGray leading-relaxed whitespace-pre-line"
        dangerouslySetInnerHTML={{
          __html: room.translations?.[value]?.description || '',
        }}
      />
    </section>
  );
};

export default RoomDetail;
