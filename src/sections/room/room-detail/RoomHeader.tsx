import type { Room, HotelRef } from '@/features/rooms/types';
import SharedHeader from '@/sections/shared/SharedHeader';
import { GalleryPreviewDetail } from '@components/GalleryPreviewDetail';
import { ResponsiveH6 } from '@components/ui/typography';
import { FaBed, FaRulerCombined } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';
import { useLanguage } from '@/hooks/useLanguage';

function getHotelDisplay(
  hotel: string | HotelRef | undefined,
  lang: string,
): string | null {
  if (!hotel || typeof hotel === 'string') return null;
  const name =
    hotel.translations?.[lang]?.name ??
    hotel.translations?.vi?.name ??
    hotel.translations?.en?.name;
  return name ?? null;
}

function getProvinceDisplay(
  hotel: string | HotelRef | undefined,
  lang: string,
): string | null {
  if (!hotel || typeof hotel === 'string') return null;
  const province = hotel.provinceId;
  if (!province || typeof province === 'string') return null;
  const names = province.name as { vi?: string; en?: string } | undefined;
  const name = names?.[lang as 'vi' | 'en'] ?? names?.vi ?? names?.en;
  return name ?? null;
}

const RoomHeader = ({ room }: { room: Room }) => {
  const { language } = useLanguage();
  const { gallery, thumbnail } = room;
  const lang = language || 'vi';
  const roomName =
    room.translations?.[lang]?.name ??
    room.translations?.vi?.name ??
    room.translations?.en?.name ??
    room.roomType ??
    room.code;
  const hotelName = getHotelDisplay(room.hotelId, lang);
  const provinceName = getProvinceDisplay(room.hotelId, lang);
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
    ...(room.roomType
      ? [
          {
            icon: <FaBed size={24} />,
            value: <span>Type: {room.roomType}</span>,
          },
        ]
      : []),
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
      title={roomName}
      subtitle={
        hotelName || provinceName
          ? [hotelName, provinceName].filter(Boolean).join(' • ')
          : undefined
      }
      rating={room.ratingSummary?.average ?? 0}
      reviewCount={room.ratingSummary?.total ?? 0}
      details={detailItems}
      GalleryComponent={
        <GalleryPreviewDetail gallery={gallery} thumbnail={thumbnail} />
      }
    />
  );
};

export default RoomHeader;
