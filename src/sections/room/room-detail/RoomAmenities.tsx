// components/RoomAmenities.tsx

import { EnumLanguage } from '@/constants/commons';
import type { Room } from '@/features/rooms/types';
import { useLocalStorage } from 'usehooks-ts';

const RoomAmenities = ({ room }: { room: Room }) => {
  const [value] = useLocalStorage('i18nextLng', EnumLanguage.DEFAULT);
  return (
    <section className="mt-10 space-y-10">
      {room?.amenities?.map((section, idx) => (
        <div key={idx}>
          <h2 className="text-xl font-bold mb-6">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="group flex items-center hover:scale-105 gap-3 border rounded-xl px-4 py-5 text-gray-700 hover:shadow-lg transition">
              <span className="text-xl transition-transform transform group-hover:scale-110 ">
                {section.icon && (
                  <img src={section.icon.url} className="w-5 h-5" />
                )}
              </span>
              <span className="text-paleGray">
                {section.translations[value]?.name}
              </span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default RoomAmenities;
