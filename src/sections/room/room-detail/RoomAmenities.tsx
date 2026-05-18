import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import type { Room } from '@/features/rooms/types';

type RoomAmenitiesProps = {
  room: Room;
};

const RoomAmenities = ({ room }: RoomAmenitiesProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  if (!room?.amenities?.length) return null;

  return (
    <section id="amenities" className="scroll-mt-40">
      <Card className="border border-[rgba(28,26,20,0.1)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <h2
          className="mb-6 font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14]"
          style={{
            fontFamily: 'var(--font-dm-serif-display, "Playfair Display", Georgia, serif)',
          }}
        >
          {t('room.detail.amenities_title', 'Amenities')}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {room.amenities.map((amenity, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-[rgba(28,26,20,0.08)] bg-[#faf7f2] p-4 transition-shadow duration-200 hover:shadow-md"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d4eae0] text-[#1e4d38]">
                {amenity.icon?.url ? (
                  <img src={amenity.icon.url} alt="" className="h-4 w-4 object-cover" />
                ) : (
                  <span className="text-xs font-semibold">+</span>
                )}
              </span>
              <span className="text-sm leading-relaxed text-[rgba(28,26,20,0.8)]">
                {amenity.translations?.[language]?.name ||
                  amenity.translations?.vi?.name ||
                  amenity.translations?.en?.name ||
                  t('room.detail.amenity', 'Amenity')}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};

export default RoomAmenities;

