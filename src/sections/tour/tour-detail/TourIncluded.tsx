import React from 'react';
import { Card } from '@/components/ui/card';
import { useTourDetail } from './TourDetailContext';
import { useLanguage } from '@/hooks/useLanguage';
import {
  MdOutlineRestaurant,
  MdDirectionsBoat,
  MdDirectionsCar,
  MdLocalBar,
  MdPerson,
  MdWifi,
} from 'react-icons/md';
import { AiOutlineCheck } from 'react-icons/ai';

const ICON_MAP: Record<string, React.ReactNode> = {
  wifi: <MdWifi size={20} />,
  meals: <MdOutlineRestaurant size={20} />,
  transport: <MdDirectionsCar size={20} />,
  guide: <MdPerson size={20} />,
  activities: <MdDirectionsBoat size={20} />,
  welcome: <MdLocalBar size={20} />,
};

const TourIncluded: React.FC = () => {
  const tour = useTourDetail();
  const { language } = useLanguage();

  if (!tour) return null;

  const t = tour.translations?.[language] ?? tour.translations?.vi ?? tour.translations?.en;
  const inclusions = t?.inclusions ?? [];
  const amenities = tour.amenities ?? [];

  const items: { label: string; icon?: React.ReactNode }[] = [];

  if (inclusions.length > 0) {
    inclusions.forEach((inc) => {
      const lower = inc.toLowerCase();
      let icon: React.ReactNode = <AiOutlineCheck size={20} className="text-blue-500" />;
      if (lower.includes('meal') || lower.includes('ăn') || lower.includes('food')) icon = <MdOutlineRestaurant size={20} className="text-blue-500" />;
      else if (lower.includes('kayak') || lower.includes('swim') || lower.includes('bơi')) icon = <MdDirectionsBoat size={20} className="text-blue-500" />;
      else if (lower.includes('transfer') || lower.includes('xe') || lower.includes('car')) icon = <MdDirectionsCar size={20} className="text-blue-500" />;
      else if (lower.includes('guide') || lower.includes('hướng dẫn')) icon = <MdPerson size={20} className="text-blue-500" />;
      else if (lower.includes('wifi')) icon = <MdWifi size={20} className="text-blue-500" />;
      else if (lower.includes('drink') || lower.includes('nước')) icon = <MdLocalBar size={20} className="text-blue-500" />;
      items.push({ label: inc, icon });
    });
  } else if (amenities.length > 0) {
    amenities.forEach((a) => {
      const name = typeof a.name === 'object' ? (a.name?.[language] ?? a.name?.vi ?? a.name?.en) : String(a);
      const icon = a.icon && ICON_MAP[a.icon] ? <span className="text-blue-500">{ICON_MAP[a.icon]}</span> : <AiOutlineCheck size={20} className="text-blue-500" />;
      items.push({ label: name ?? '—', icon });
    });
  }

  if (items.length === 0) return null;

  return (
    <section id="included" className="mt-10">
      <Card className="p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-6">What&apos;s Included</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="group flex items-center gap-3 border rounded-xl px-4 py-5 text-gray-700 hover:shadow-lg transition border-gray-100"
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-paleGray">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};

export default TourIncluded;
