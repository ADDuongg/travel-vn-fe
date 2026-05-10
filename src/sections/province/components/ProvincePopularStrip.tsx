import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import { ROUTES } from '@/constants/router';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';
import type { ProvinceListItem } from '@/features/provinces/types';
import { pickLocale } from '@/features/provinces/locale';

const regionCardTone: Record<'NORTH' | 'CENTRAL' | 'SOUTH', string> = {
  NORTH: 'from-charcoal/60 via-charcoal/25 to-[oklch(35%_0.03_230)]/55',
  CENTRAL: 'from-charcoal/55 via-sunset-deep/35 to-charcoal/20',
  SOUTH: 'from-charcoal/60 via-charcoal/30 to-[oklch(42%_0.12_55)]/40',
};

function getShortDescription(item: ProvinceListItem, lang: 'vi' | 'en') {
  return (
    item.translations?.[lang]?.shortDescription ??
    item.translations?.vi?.shortDescription ??
    item.translations?.en?.shortDescription ??
    ''
  );
}

const PopularStripCard = memo(function PopularStripCard({ item }: { item: ProvinceListItem }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const reduceMotion = useReducedMotion();

  const name = pickLocale(item.name, language) ?? item.slug;
  const shortDescription = getShortDescription(item, lang);
  const region = item.region ?? 'CENTRAL';
  const tone = regionCardTone[region];

  const thumbnail =
    item.thumbnail?.url ??
    item.gallery?.[0]?.url ??
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80';

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -5 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="group relative h-[460px] overflow-hidden rounded-[1.85rem] border border-charcoal/10 shadow-soft md:h-[520px]"
    >
      <Link
        to={ROUTES.PROVINCE.DETAIL.replace(':slug', item.slug)}
        className="absolute inset-0 z-10"
        aria-labelledby={`popular-${item.slug}`}
      />
      <img
        src={thumbnail}
        alt=""
        className="absolute inset-0 size-full object-cover transition duration-[1.1s] group-hover:scale-[1.04]"
        loading="lazy"
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t ${tone} opacity-95 transition duration-700 group-hover:opacity-85`}
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-7 text-sand-50">
        <p className="text-[10px] uppercase tracking-[0.3em] text-sand-100/72">
          {item.region === 'NORTH'
            ? t('province.region_north')
            : item.region === 'CENTRAL'
              ? t('province.region_central')
              : item.region === 'SOUTH'
                ? t('province.region_south')
                : ''}
        </p>
        <h3 id={`popular-${item.slug}`} className="mt-2 font-display text-3xl">
          {name}
        </h3>
        {shortDescription ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-sand-100/82">{shortDescription}</p>
        ) : null}
      </div>
    </motion.article>
  );
});

type ProvincePopularStripProps = {
  items: ProvinceListItem[];
};

export function ProvincePopularStrip({ items }: ProvincePopularStripProps) {
  const { t } = useTranslation();

  if (items.length === 0) return null;

  return (
    <section className="border-b border-charcoal/10 bg-sand-100 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <Reveal className="mb-10 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('province.strip.kicker', 'Beloved signatures')}
          </p>
          <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
            {t('province.strip.title', 'Provinces travelers return to')}
          </h2>
        </Reveal>
        <div className="flex snap-x gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-8 [&::-webkit-scrollbar]:hidden">
          {items.map((p, i) => (
            <Reveal key={p._id} delay={i * 0.06} className="min-w-[min(88vw,320px)] snap-center md:min-w-[380px]">
              <PopularStripCard item={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
