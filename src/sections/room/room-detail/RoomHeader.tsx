import React from 'react';
import { ResponsiveH6 } from '@components/ui/typography';
import SharedHeader from '@/sections/shared/SharedHeader';
import { FaBed, FaRulerCombined, FaBuilding } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';
import { GalleryPreviewDetail } from '@components/GalleryPreviewDetail';

const RoomHeader: React.FC = () => {
  const detailItems = [
    {
      icon: <FaBed size={24} />,
      value: <ResponsiveH6 className="font-normal">2 King Beds</ResponsiveH6>,
    },
    {
      icon: <FaUserGroup size={24} />,
      value: <span>Max: 6 Guests</span>,
    },
    {
      icon: <FaRulerCombined size={24} />,
      value: <span>45 sqm</span>,
    },
    {
      icon: <FaBuilding size={24} />,
      value: <span>City View</span>,
    },
  ];

  return (
    <SharedHeader
      title="Deluxe Family Room"
      rating={4.8}
      reviewCount={12}
      details={detailItems}
      GalleryComponent={<GalleryPreviewDetail />}
    />
  );
};

export default RoomHeader;
