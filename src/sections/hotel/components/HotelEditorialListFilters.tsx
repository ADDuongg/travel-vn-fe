import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useProvincesQuery } from '@/features/provinces/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import type { Province } from '@/features/provinces/types';
import type { HotelListQuery } from '@/sections/hotel/hotel-list-query';
import { Reveal } from '@/components/home-editorial/Reveal';
import { RevealItem, Stagger } from '@/components/home-editorial/Reveal';

type Props = {
  value: HotelListQuery;
  onChange: (next: HotelListQuery) => void;
};

export function HotelEditorialListFilters({ value, onChange }: Props) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: provincesList } = useProvincesQuery();

  const getProvinceLabel = useCallback(
    (p: Province) =>
      p.name?.[language as 'vi' | 'en'] ?? p.name?.vi ?? p.name?.en ?? p.slug,
    [language],
  );

  const sortLabels = useMemo(
    () =>
      ({
        newest: t('hotel.editorial.sort_newest', 'Newest listed'),
        name: t('hotel.editorial.sort_name', 'Name A–Z'),
        rating: t('hotel.editorial.sort_rating', 'Guest tone'),
      }) as const,
    [t],
  );

  return (
    <section className="border-b border-charcoal/10 bg-sand-100 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <Reveal className="mb-12 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('hotel.editorial.filter_province_kicker', 'Province')}
          </p>
          <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
            {t('hotel.editorial.filter_province_title', 'Where the roof should listen')}
          </h2>
        </Reveal>
        <Stagger className="flex flex-wrap gap-2 md:gap-3">
          <FilterPill
            active={value.provinceId === ''}
            onClick={() => onChange({ ...value, provinceId: '' })}
            label={t('hotel.filter.all_provinces', 'All provinces')}
          />
          {(provincesList ?? []).map((p) => (
            <FilterPill
              key={p._id}
              active={value.provinceId === p._id}
              onClick={() =>
                onChange({
                  ...value,
                  provinceId: value.provinceId === p._id ? '' : p._id,
                })
              }
              label={getProvinceLabel(p)}
            />
          ))}
        </Stagger>

        <Reveal className="mt-12 border-t border-charcoal/10 pt-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('hotel.editorial.filter_stars_kicker', 'Minimum stars')}
          </p>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {([0, 3, 4, 5] as const).map((n) => (
              <FilterPill
                key={n}
                active={value.minStars === n}
                onClick={() => onChange({ ...value, minStars: n })}
                label={
                  n === 0
                    ? t('hotel.filter.stars_any', 'Any stars')
                    : t('hotel.filter.stars_n_plus', { n, defaultValue: '{{n}}+ stars' })
                }
              />
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('hotel.editorial.filter_sort_kicker', 'Sort')}
          </p>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map(
              (mode) => (
                <SortPill
                  key={mode}
                  active={value.sortBy === mode}
                  onClick={() => onChange({ ...value, sortBy: mode })}
                  label={sortLabels[mode]}
                />
              ),
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <RevealItem>
      <button
        type="button"
        onClick={onClick}
        className={`rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition md:px-5 ${
          active
            ? 'border-forest bg-forest text-sand-50 shadow-soft'
            : 'border-charcoal/15 bg-sand-50 text-charcoal/70 hover:border-forest/35 hover:text-charcoal'
        }`}
      >
        {label}
      </button>
    </RevealItem>
  );
}

function SortPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] transition md:px-5 ${
        active
          ? 'border-charcoal bg-charcoal text-sand-50'
          : 'border-charcoal/15 bg-transparent text-charcoal/65 hover:border-charcoal/35 hover:text-charcoal'
      }`}
    >
      {label}
    </button>
  );
}
