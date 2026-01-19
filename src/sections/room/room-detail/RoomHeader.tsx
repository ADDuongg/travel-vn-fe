import type { Room } from '@/features/rooms/types';
import SharedHeader from '@/sections/shared/SharedHeader';
import { GalleryPreviewDetail } from '@components/GalleryPreviewDetail';
import { ResponsiveH6 } from '@components/ui/typography';
import { FaBed, FaRulerCombined } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';

const RoomHeader = ({ room }: { room: Room }) => {
  const { gallery, thumbnail } = room;
  const detailItems = [
    {
      icon: <FaBed size={24} />,
      value: <ResponsiveH6 className="font-normal">2 King Beds</ResponsiveH6>,
    },
    {
      icon: <FaUserGroup size={24} />,
      value: <span>Max: {room.maxGuests} People</span>,
    },
    {
      icon: <FaRulerCombined size={24} />,
      value: <span>Room Size: {room.roomSize}</span>,
    },
    /* {
      icon: <FaBuilding size={24} />,
      value: (
        <span>
          adult/children ratio: {room.adults}/{room.children}
        </span>
      ),
    }, */
  ];

  return (
    <SharedHeader
      title="Deluxe Family Room"
      rating={4.8}
      reviewCount={12}
      details={detailItems}
      GalleryComponent={
        <GalleryPreviewDetail gallery={gallery} thumbnail={thumbnail} />
      }
    />
  );
};

export default RoomHeader;
