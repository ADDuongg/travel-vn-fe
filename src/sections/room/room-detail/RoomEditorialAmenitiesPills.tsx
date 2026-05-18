import { Reveal, RevealItem, Stagger } from '@/components/home-editorial/Reveal';
import { useTranslation } from 'react-i18next';
import type { Room } from '@/features/rooms/types';

type Props = {
  room: Room;
  lang: string;
};

export function RoomEditorialAmenitiesPills({ room, lang }: Props) {
  const { t } = useTranslation();
  if (!room.amenities?.length) return null;

  return (
    <section
      id="amenities"
      className="scroll-mt-28 mx-auto max-w-6xl px-4 py-20 md:px-10 md:py-28"
    >
      <Reveal className="mb-10 space-y-3">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
          {t('room.detail.amenities_kicker', 'Amenities')}
        </p>
        <h2 className="font-display text-4xl text-charcoal">
          {t(
            'room.editorial.amenities_title',
            'What travels with this key',
          )}
        </h2>
      </Reveal>
      <Stagger className="flex flex-wrap gap-2">
        {room.amenities.map((a, idx) => {
          const label =
            a.translations?.[lang]?.name ??
            a.translations?.vi?.name ??
            a.translations?.en?.name ??
            t('room.detail.amenity', 'Amenity');
          return (
            <RevealItem key={`${label}-${idx}`}>
              <span className="inline-block rounded-full border border-charcoal/12 bg-sand-100 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-charcoal/75">
                {label}
              </span>
            </RevealItem>
          );
        })}
      </Stagger>
    </section>
  );
}

