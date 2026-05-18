import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { Hotel } from '@/features/hotels/types';
import {
  buildOrderedGallery,
  paragraphsFromHotelDescription,
} from '@/sections/hotel/hotel-detail/hotelEditorialUtils';

type Props = { hotel: Hotel; lang: string };

export function HotelEditorialStorySection({ hotel, lang }: Props) {
  const { t } = useTranslation();
  const descRaw =
    hotel.translations?.[lang]?.description ??
    hotel.translations?.vi?.description ??
    hotel.translations?.en?.description;
  const desc = typeof descRaw === 'string' ? descRaw : undefined;
  const paras = paragraphsFromHotelDescription(desc);
  const gallery = buildOrderedGallery(hotel);
  const leadImage = gallery[0];

  if (paras.length === 0 && !leadImage) return null;

  return (
    <section
      id="story"
      className="mx-auto max-w-6xl scroll-mt-36 px-4 pt-20 md:px-10 md:pt-28"
    >
      <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <Reveal className="space-y-8">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('hotel.editorial.story_kicker', 'Editorial')}
          </p>
          <h2 className="font-display text-4xl text-charcoal md:text-[2.85rem]">
            {t(
              'hotel.editorial.story_title',
              'Why this roof earns patience',
            )}
          </h2>
          {paras.length > 0 ? (
            paras.map((para) => (
              <p
                key={para.slice(0, 48)}
                className="text-lg leading-relaxed text-mist md:text-xl"
              >
                {para}
              </p>
            ))
          ) : (
            <p className="text-lg leading-relaxed text-mist md:text-xl">
              {t('hotel.detail.no_description', 'No description available.')}
            </p>
          )}
        </Reveal>
        {leadImage ? (
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-charcoal/10 shadow-soft">
              <img
                src={leadImage.url}
                alt={leadImage.alt || ''}
                className="max-h-[640px] w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-transparent" />
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

