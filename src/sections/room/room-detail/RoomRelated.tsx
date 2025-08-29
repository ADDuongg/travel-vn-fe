import React from 'react';
import { CardCarousel } from '@components/CardsCarousel';
import { ResponsiveH2 } from '@components/ui/typography';
import { ButtonNavigate } from '@components/ui/button';
import type { RoomItem } from '../components/RoomCard';
import RoomCard from '../components/RoomCard';

// giả mock data
const relatedRooms: RoomItem[] = [
  {
    id: 1,
    title: 'Deluxe Family Room',
    imageUrl: 'https://picsum.photos/400/250?random=1',
    price: 120,
    oldPrice: 150,
    rating: 4.8,
    reviewCount: 32,
    guests: 4,
    beds: '2 King Beds',
  },
  {
    id: 2,
    title: 'Ocean View Suite',
    imageUrl: 'https://picsum.photos/400/250?random=6',
    price: 220,
    oldPrice: 260,
    rating: 4.9,
    reviewCount: 40,
    guests: 3,
    beds: '1 King Bed',
  },
  {
    id: 3,
    title: 'Standard Room',
    imageUrl: 'https://picsum.photos/400/250?random=3',
    price: 80,
    rating: 4.5,
    reviewCount: 18,
    guests: 2,
    beds: '1 Queen Bed',
  },
  {
    id: 4,
    title: 'Standard Room',
    imageUrl: 'https://picsum.photos/400/250?random=3',
    price: 80,
    rating: 4.5,
    reviewCount: 18,
    guests: 2,
    beds: '1 Queen Bed',
  },
];

const RoomRelated: React.FC = () => {
  return (
    <CardCarousel<RoomItem>
      title={
        <ResponsiveH2 className="text-sm font-bold my-10">
          Related Rooms
        </ResponsiveH2>
      }
      items={relatedRooms}
      renderItem={(item) => <RoomCard key={item.id} item={item} />}
      seeMoreButton={<ButtonNavigate label="See More" />}
      classNameContainer="w-full flex flex-col"
      itemsPerView={{ base: 3, sm: 2, lg: 3 }}
    />
  );
};

export default RoomRelated;
