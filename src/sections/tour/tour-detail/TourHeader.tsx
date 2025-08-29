import React from 'react';
import { ResponsiveH6 } from '@components/ui/typography';
import { BsClockHistory } from 'react-icons/bs';
import { FaUserGroup } from 'react-icons/fa6';
import { AiOutlineWifi, AiTwotoneCalendar } from 'react-icons/ai';
import { GalleryPreviewDetail } from '@components/GalleryPreviewDetail';
import SharedHeader from '@/sections/shared/SharedHeader';

const TourHeader: React.FC = () => {
  const detailItems = [
    {
      icon: <BsClockHistory size={24} />,
      value: <ResponsiveH6 className="font-normal">5 Hours</ResponsiveH6>,
    },
    { icon: <FaUserGroup size={24} />, value: <span>Max Guests: 200</span> },
    { icon: <AiOutlineWifi size={24} />, value: <span>Wifi Available</span> },
    { icon: <AiTwotoneCalendar size={24} />, value: <span>Jan – July</span> },
  ];

  return (
    <SharedHeader
      title="Africa – Amazing African Safari"
      rating={5}
      reviewCount={1}
      details={detailItems}
      GalleryComponent={<GalleryPreviewDetail />}
    />
  );
};

export default TourHeader;
