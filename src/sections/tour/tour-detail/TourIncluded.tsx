import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Utensils,
  Car,
  User,
  Ship,
  Wine,
  Wifi,
  Check,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import type { Tour } from '@/features/tours/types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  meals: Utensils,
  transport: Car,
  guide: User,
  activities: Ship,
  welcome: Wine,
};

type TourIncludedProps = {
  tour: Tour;
};

const TourIncluded: React.FC<TourIncludedProps> = ({ tour }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const tr =
    tour.translations?.[language] ?? tour.translations?.vi ?? tour.translations?.en;
  const inclusions = tr?.inclusions ?? [];
  const amenities = tour.amenities ?? [];

  const items: { label: string; icon: React.ComponentType<{ className?: string }> }[] = [];

  if (inclusions.length > 0) {
    inclusions.forEach((inc) => {
      const lower = inc.toLowerCase();
      let icon = Check;
      if (
        lower.includes('meal') ||
        lower.includes('ăn') ||
        lower.includes('food')
      )
        icon = Utensils;
      else if (
        lower.includes('kayak') ||
        lower.includes('swim') ||
        lower.includes('bơi')
      )
        icon = Ship;
      else if (
        lower.includes('transfer') ||
        lower.includes('xe') ||
        lower.includes('car')
      )
        icon = Car;
      else if (lower.includes('guide') || lower.includes('hướng dẫn')) icon = User;
      else if (lower.includes('wifi')) icon = Wifi;
      else if (lower.includes('drink') || lower.includes('nước')) icon = Wine;
      items.push({ label: inc, icon });
    });
  } else if (amenities.length > 0) {
    amenities.forEach((a) => {
      const name =
        typeof a.name === 'object'
          ? (a.name?.[language] ?? a.name?.vi ?? a.name?.en)
          : String(a);
      const Icon =
        a.icon && ICON_MAP[a.icon] ? ICON_MAP[a.icon]! : Check;
      items.push({ label: name ?? '—', icon: Icon });
    });
  }

  if (items.length === 0) return null;

  return (
    <section id="included" className="scroll-mt-40">
      <Card className="border border-[rgba(28,26,20,0.1)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <h2
          className="mb-6 font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14]"
          style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
        >
          {t('tour.detail.included_title', "What's included")}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-3 rounded-xl border border-[rgba(28,26,20,0.08)]',
                  'bg-[#faf7f2] p-4 transition-shadow duration-200 hover:shadow-md',
                )}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d4eae0] text-[#1e4d38]">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="text-sm leading-relaxed text-[rgba(28,26,20,0.8)]">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
};

export default TourIncluded;

