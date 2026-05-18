import { Reveal } from '@/components/home-editorial/Reveal';
import { useTranslation } from 'react-i18next';
import type { Room } from '@/features/rooms/types';
import { toParagraphs } from '@/sections/room/room-detail/roomEditorialCopyUtils';

type Props = {
  room: Room;
  lang: string;
};

export function RoomEditorialStorySection({ room, lang }: Props) {
  const { t } = useTranslation();
  const tr =
    room.translations?.[lang] ??
    room.translations?.vi ??
    room.translations?.en;
  const raw = tr?.description ?? '';
  const paragraphs = toParagraphs(raw);
  if (!paragraphs.length) return null;

  return (
    <section id="story" className="mx-auto max-w-6xl scroll-mt-28 px-4 pt-20 md:px-10 md:pt-28">
      <Reveal className="space-y-8">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
          {t('room.editorial.story_kicker', 'Editorial')}
        </p>
        <h2 className="font-display text-4xl text-charcoal md:text-[2.85rem]">
          {t(
            'room.editorial.story_title',
            'Why this inventory line exists',
          )}
        </h2>
        {paragraphs.map((para, idx) => (
          <p
            key={idx}
            className="text-lg leading-relaxed text-mist md:text-xl"
          >
            {para}
          </p>
        ))}
      </Reveal>
    </section>
  );
}

