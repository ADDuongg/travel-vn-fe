import type { Hotel } from '@/features/hotels/types';
import { useRoomsQuery } from '@/features/rooms/hooks';
import RoomCard, { RoomCardSkeleton } from '@/sections/room/components/RoomCard';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from 'react-i18next';

const HotelRooms = ({ hotel }: { hotel: Hotel }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { data, isLoading } = useRoomsQuery({
    hotelIds: [hotel._id],
    limit: 6,
    lang: language,
  });
  const rooms = data?.items ?? [];

  if (rooms.length === 0 && !isLoading) return null;

  return (
    <section
      id="rooms"
      className="scroll-mt-36 border-b border-[rgba(28,26,20,0.08)] py-12 lg:py-16"
    >
      <div className="mb-8">
        <h2
          className="mb-2 text-2xl font-semibold text-[#1c1a14] sm:text-3xl"
          style={{
            fontFamily: 'var(--font-dm-serif-display, Georgia, serif)',
          }}
        >
          {t('hotel.detail.rooms_title', 'Rooms & rates')}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-[rgba(28,26,20,0.65)] sm:text-base">
          {t(
            'hotel.detail.rooms_subtitle',
            'Choose a room for your stay — availability and details are on each card.',
          )}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
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
