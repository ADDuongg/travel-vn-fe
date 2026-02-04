import type { Hotel } from '@/features/hotels/types';
import { useRoomsQuery } from '@/features/rooms/hooks';
import RoomCard, { RoomCardSkeleton } from '@/sections/room/components/RoomCard';
import { useLanguage } from '@/hooks/useLanguage';
import { ResponsiveH3 } from '@/components/ui/typography';

const HotelRooms = ({ hotel }: { hotel: Hotel }) => {
  const { language } = useLanguage();
  const { data, isLoading } = useRoomsQuery({
    hotelIds: [hotel._id],
    limit: 6,
    lang: language,
  });
  const rooms = data?.items ?? [];

  if (rooms.length === 0 && !isLoading) return null;

  return (
    <div>
      <ResponsiveH3 className="mb-6">Rooms at this hotel</ResponsiveH3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <RoomCardSkeleton key={i} />
            ))
          : rooms.map((room) => (
              <RoomCard key={room._id} item={room} lang={language} />
            ))}
      </div>
    </div>
  );
};

export default HotelRooms;
