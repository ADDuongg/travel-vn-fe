import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useProvincesQuery } from '@/features/provinces/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import type { Province } from '@/features/provinces/types';
import type { RoomListQuery } from '@/sections/room/room-list-query';
import { Reveal, RevealItem, Stagger } from '@/components/home-editorial/Reveal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  value: RoomListQuery;
  onChange: (next: RoomListQuery) => void;
};

export function RoomEditorialListFilters({ value, onChange }: Props) {
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
        newest: t('room.editorial.sort_newest', 'Newest listed'),
        price_asc: t('room.editorial.sort_price_asc', 'Rate · gentle first'),
        price_desc: t('room.editorial.sort_price_desc', 'Rate · generous first'),
        rating_desc: t('room.editorial.sort_rating_desc', 'Property tone'),
      }) as const,
    [t],
  );

  return (
    <section className="border-b border-charcoal/10 bg-sand-100 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <Reveal className="mb-12 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('room.editorial.filter_province_kicker', 'Province')}
          </p>
          <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
            {t(
              'room.editorial.filter_province_title',
              'Where the room should face',
            )}
          </h2>
        </Reveal>
        <Stagger className="flex flex-wrap gap-2 md:gap-3">
          <FilterPill
            active={value.provinceId === ''}
            onClick={() => onChange({ ...value, provinceId: '' })}
            label={t('room.filter.all_provinces', 'All provinces')}
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

        <Reveal className="mt-10 grid gap-6 border-t border-charcoal/10 pt-10 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="room-editorial-min-price" className="text-charcoal/80">
              {t('room.editorial.min_price_label', 'Floor (VND)')}
            </Label>
            <Input
              id="room-editorial-min-price"
              value={value.minPrice}
              onChange={(e) =>
                onChange({ ...value, minPrice: e.target.value })
              }
              placeholder={t(
                'room.editorial.min_price_placeholder',
                'e.g. 1000000',
              )}
              inputMode="numeric"
              autoComplete="off"
              className="rounded-2xl border-charcoal/12 bg-sand-50/90 h-12 px-4"
            />
            <p className="text-xs text-mist">
              {t(
                'room.editorial.price_floor_hint',
                'Digits only; leave empty for no floor.',
              )}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="room-editorial-max-price" className="text-charcoal/80">
              {t('room.editorial.max_price_label', 'Ceiling (VND)')}
            </Label>
            <Input
              id="room-editorial-max-price"
              value={value.maxPrice}
              onChange={(e) =>
                onChange({ ...value, maxPrice: e.target.value })
              }
              placeholder={t(
                'room.editorial.max_price_placeholder',
                'e.g. 5000000',
              )}
              inputMode="numeric"
              autoComplete="off"
              className="rounded-2xl border-charcoal/12 bg-sand-50/90 h-12 px-4"
            />
            <p className="text-xs text-mist">
              {t(
                'room.editorial.price_ceiling_hint',
                'Digits only; leave empty for no ceiling.',
              )}
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('room.editorial.filter_sort_kicker', 'Sort')}
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

