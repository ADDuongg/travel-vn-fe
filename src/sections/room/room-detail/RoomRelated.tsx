import { useRoomsQuery } from '@/features/rooms/hooks';
import type { Room } from '@/features/rooms/types';
import { CardCarousel } from '@components/CardsCarousel';
import { ButtonNavigate } from '@components/ui/button';
import { ResponsiveH2 } from '@components/ui/typography';
import React from 'react';
import RoomCard from '../components/RoomCard';

const RoomRelated: React.FC = () => {
  const { data: relatedRooms } = useRoomsQuery({
    limit: 6,
    sortBy: 'newest',
  });
  return (
    <CardCarousel<Room>
      title={
        <ResponsiveH2 className="text-sm font-bold my-10">
          Related Rooms
        </ResponsiveH2>
      }
      items={relatedRooms?.items || []}
      renderItem={(item) => <RoomCard key={item._id} item={item} />}
      seeMoreButton={<ButtonNavigate label="See More" />}
      classNameContainer="w-full flex flex-col"
      itemsPerView={{ base: 3, sm: 2, lg: 3 }}
    />
  );
};

export default RoomRelated;
