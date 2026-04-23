import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';
import type { ProvinceDetail } from '@/features/provinces/types';

interface ProvinceHeaderProps {
  province: ProvinceDetail;
}

function getRegionLabel(region?: ProvinceDetail['region']) {
  if (region === 'NORTH') return 'North Vietnam';
  if (region === 'CENTRAL') return 'Central Vietnam';
  if (region === 'SOUTH') return 'South Vietnam';
  return '';
}

export function ProvinceHeader({ province }: ProvinceHeaderProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const name = province.name?.[lang] ?? province.name?.vi ?? province.name?.en ?? province.slug;
  const shortDescription =
    province.translations?.[lang]?.shortDescription ??
    province.translations?.vi?.shortDescription ??
    province.translations?.en?.shortDescription ??
    '';
  const regionLabel = getRegionLabel(province.region);
  const coverImage =
    province.thumbnail?.url ??
    province.gallery?.[0]?.url ??
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80';

  return (
    <section className="pt-4 sm:pt-6">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={coverImage}
          alt={name}
          className="h-[340px] w-full object-cover sm:h-[420px] lg:h-[500px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a14]/80 via-[#1c1a14]/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-[1] p-6 sm:p-8 lg:p-10">
          {regionLabel && (
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              {regionLabel}
            </span>
          )}
          <h1
            className="mt-4 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
          >
            {name}
          </h1>
          {shortDescription && (
            <p className="mt-2 max-w-2xl text-base text-white/90 sm:text-lg">{shortDescription}</p>
          )}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-white/75">
                {t('province.population', 'Population')}
              </p>
              <p className="mt-1 text-lg font-semibold">
                {province.population ? province.population.toLocaleString() : '--'}
              </p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-white/75">
                {t('province.area', 'Area')}
              </p>
              <p className="mt-1 text-lg font-semibold">
                {province.area ? `${province.area.toLocaleString()} km2` : '--'}
              </p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-white/75">
                {t('province.best_time_to_visit', 'Best time to visit')}
              </p>
              <p className="mt-1 text-lg font-semibold">
                {province.bestTimeToVisit?.[lang] ??
                  province.bestTimeToVisit?.vi ??
                  province.bestTimeToVisit?.en ??
                  '--'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
