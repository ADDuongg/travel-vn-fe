import type { Hotel } from '@/features/hotels/types';
import { useRoomsQuery } from '@/features/rooms/hooks';
import RoomCard, { RoomCardSkeleton } from '@/sections/room/components/RoomCard';
import { useLanguage } from '@/hooks/useLanguage';
import { ResponsiveH2 } from '@/components/ui/typography';

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
    <section className="border-t border-border pt-16">
      <div className="mb-10">
        <ResponsiveH2 className="text-foreground mb-2 border-0 pb-0">
          Available Rooms
        </ResponsiveH2>
        <p className="text-muted-foreground">
          Choose your stay from our rooms at this hotel.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <RoomCardSkeleton key={i} />
            ))
          : rooms.map((room) => (
              <RoomCard key={room._id} item={room} lang={language} />
            ))}
      </div>
    </section>
  );
};

export default HotelRooms;
