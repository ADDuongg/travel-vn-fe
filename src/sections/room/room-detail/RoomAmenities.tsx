import React, { type JSX } from 'react';
import {
  MdOutlineTv,
  MdWifi,
  MdOutlineShower,
  MdOutlinePhone,
  MdOutlineAcUnit,
  MdOutlineLock,
  MdOutlineLocalParking,
  MdRestaurant,
  MdRoomService,
  MdOutlinePool,
  MdFitnessCenter,
  MdOutlineSpa,
  MdLocalLaundryService,
} from 'react-icons/md';
import { IoMdHand } from 'react-icons/io';

interface AmenityItem {
  icon: JSX.Element;
  label: string;
}

interface AmenitySection {
  title: string;
  items: AmenityItem[];
}

interface AmenitiesProps {
  sections: AmenitySection[];
  iconSize?: number;
}

const Amenities: React.FC<AmenitiesProps> = ({ sections, iconSize = 24 }) => {
  return (
    <section className="mt-10 space-y-10">
      {sections.map((section, idx) => (
        <div key={idx}>
          <h2 className="text-xl font-bold mb-6">{section.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {section.items.map((item, i) => (
              <div
                key={i}
                className="group flex items-center hover:scale-105 gap-3 border rounded-xl px-4 py-5 text-gray-700 hover:shadow-lg transition"
              >
                <span className="text-xl transition-transform transform group-hover:scale-110 ">
                  {React.cloneElement(item.icon, { size: iconSize })}
                </span>
                <span className="text-paleGray">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

const RoomAmenities = () => {
  const sections: AmenitySection[] = [
    {
      title: 'Room Amenities',
      items: [
        { icon: <MdOutlineTv />, label: 'TV' },
        { icon: <MdWifi />, label: 'Free Wifi' },
        { icon: <MdOutlineLock />, label: 'Safe' },
        { icon: <MdOutlineShower />, label: 'None Smoking' },
        { icon: <MdOutlineAcUnit />, label: 'Air Conditioning' },
        { icon: <MdOutlineSpa />, label: 'Heater' },
        { icon: <MdOutlinePhone />, label: 'Phone' },
        { icon: <IoMdHand />, label: 'Hair Dryer' },
      ],
    },
    {
      title: 'Hotel Amenities',
      items: [
        { icon: <MdFitnessCenter />, label: 'Gym' },
        { icon: <MdOutlineLocalParking />, label: 'Parking' },
        { icon: <MdOutlineSpa />, label: 'Spa' },
        { icon: <MdRestaurant />, label: 'Restaurant' },
        { icon: <MdRoomService />, label: 'Room Service' },
        { icon: <MdOutlinePool />, label: 'Swimming Pool' },
        { icon: <MdOutlinePhone />, label: '24 Hour Concierge' },
        { icon: <MdLocalLaundryService />, label: 'In-house Laundry' },
      ],
    },
  ];

  return <Amenities sections={sections} iconSize={24} />;
};

export default RoomAmenities;
