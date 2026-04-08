import { useRoomsQuery } from '@/features/rooms/hooks';
import type { Room } from '@/features/rooms/types';
import { CardCarousel } from '@components/CardsCarousel';
import { ButtonNavigate } from '@components/ui/button';
import { ResponsiveH2 } from '@components/ui/typography';
import React from 'react';
import RoomCard, { RoomCardSkeleton } from '../components/RoomCard';

const SKELETON_COUNT = 3;

const RoomRelated: React.FC = () => {
  const { data: relatedRooms, isLoading } = useRoomsQuery({
    limit: 6,
    sortBy: 'newest',
  });
  const items = relatedRooms?.items ?? [];

  if (isLoading) {
    return (
      <div className="w-full flex flex-col">
        <ResponsiveH2 className="text-sm font-bold my-10">
          Related Rooms
        </ResponsiveH2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <RoomCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <CardCarousel<Room>
      title={
        <ResponsiveH2 className="text-sm font-bold my-10">
          Related Rooms
        </ResponsiveH2>
      }
      items={items}
      renderItem={(item) => <RoomCard key={item._id} item={item} />}
      seeMoreButton={<ButtonNavigate label="See More" />}
      classNameContainer="w-full flex flex-col"
      itemsPerView={{ base: 1, md: 2, lg: 3 }}
    />
  );
};

export default RoomRelated;
