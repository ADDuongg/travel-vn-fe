import React from 'react';
import { ResponsiveH6 } from '@components/ui/typography';
import { GiChopsticks } from 'react-icons/gi';
import { MdOutlineLocationOn, MdOutlineTimer } from 'react-icons/md';
import { BsClockHistory } from 'react-icons/bs';
import SharedHeader from '@/sections/shared/SharedHeader';

const GALLERY_IMAGES = [
  {
    _id: '1',
    url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80',
    alt: 'Bún Chả Hà Nội served on table',
  },
  {
    _id: '2',
    url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80',
    alt: 'Grilled pork patties',
  },
  {
    _id: '3',
    url: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=400&q=80',
    alt: 'Rice vermicelli noodles',
  },
  {
    _id: '4',
    url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80',
    alt: 'Fresh Vietnamese herbs',
  },
  {
    _id: '5',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
    alt: 'Vietnamese street food',
  },
];

const FoodGallery = () => {
  const thumbnail = GALLERY_IMAGES[0];
  const sideImages = GALLERY_IMAGES.slice(1);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="relative col-span-12 md:col-span-8 rounded-xl overflow-hidden ring-1 ring-border aspect-[16/9]">
        <img
          src={thumbnail.url}
          alt={thumbnail.alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
            <GiChopsticks className="text-primary" size={14} />
            Local Signature
          </span>
        </div>
      </div>

      <div className="col-span-12 md:col-span-4 grid grid-cols-2 grid-rows-2 gap-4">
        {sideImages.map((img) => (
          <div
            key={img._id}
            className="rounded-xl overflow-hidden ring-1 ring-border"
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const FoodHeader: React.FC = () => {
  const detailItems = [
    {
      icon: <MdOutlineLocationOn size={24} />,
      value: (
        <ResponsiveH6 className="font-normal">Hanoi, Vietnam</ResponsiveH6>
      ),
    },
    {
      icon: <BsClockHistory size={24} />,
      value: <span>Best at Lunch (11AM - 2PM)</span>,
    },
    {
      icon: <MdOutlineTimer size={24} />,
      value: <span>~30 min to enjoy</span>,
    },
    {
      icon: <GiChopsticks size={24} />,
      value: <span>Street Food</span>,
    },
  ];

  return (
    <SharedHeader
      title="Bún Chả Hà Nội"
      subtitle="The soul of Hanoi's midday street food culture — grilled pork with rice noodles, fresh herbs, and savory dipping sauce."
      rating={4.8}
      reviewCount={2300}
      details={detailItems}
      GalleryComponent={<FoodGallery />}
    />
  );
};

export default FoodHeader;

