import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ParallaxHero } from '@/components/home-editorial/ParallaxHero';
import { useLanguage } from '@/hooks/useLanguage';
import type { ProvinceDetail } from '@/features/provinces/types';
import { pickLocale } from '@/features/provinces/locale';
import { formatAreaKm2, formatCount } from '@/utils/formatNumber';
import { langKey } from '@/utils/addressOptions';

type ProvinceDetailHeroProps = {
  province: ProvinceDetail;
  heroRef: React.RefObject<HTMLElement | null>;
};

function getRegionLabel(
  region: ProvinceDetail['region'],
  t: (key: string, fallback: string) => string,
): string {
  if (region === 'NORTH') return t('province.region_north', 'North Vietnam');
  if (region === 'CENTRAL') return t('province.region_central', 'Central Vietnam');
  if (region === 'SOUTH') return t('province.region_south', 'South Vietnam');
  return '';
}

export function ProvinceDetailHero({ province, heroRef }: ProvinceDetailHeroProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  const reduceMotion = useReducedMotion();
  const name = pickLocale(province.name, language) ?? province.slug;
  const shortDescription =
    province.translations?.[langKey(language)]?.shortDescription ??
    province.translations?.vi?.shortDescription ??
    province.translations?.en?.shortDescription ??
    '';
  const coverImage =
    province.thumbnail?.url ??
    province.gallery?.[0]?.url ??
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80';
  const regionLabel = getRegionLabel(province.region, t);

  return (
    <section className="relative">
      <ParallaxHero ref={heroRef} image={coverImage} heightClass="min-h-[100svh]">
        <div className="flex flex-1 flex-col justify-end px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-44">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl space-y-6 text-sand-50"
          >
            {regionLabel ? (
              <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/72">{regionLabel}</p>
            ) : null}
            <h1 className="font-display text-[clamp(2.8rem,7.2vw,5rem)] leading-[0.92]">{name}</h1>
            {shortDescription ? (
              <p className="max-w-[48ch] text-lg leading-relaxed text-sand-100/85">{shortDescription}</p>
            ) : null}
            <dl className="flex flex-wrap gap-x-10 gap-y-3 border-t border-sand-100/20 pt-6 text-[11px] uppercase tracking-[0.24em] text-sand-100/72">
              <div>
                <dt className="text-sand-100/55">{t('province.detail.hero_population_label')}</dt>
                <dd className="mt-1 font-mono normal-case tracking-normal text-sand-50">
                  {province.population !== undefined ? (
                    <>
                      {formatCount(province.population, locale)}{' '}
                      <span className="font-sans">{t('province.detail.hero_population_suffix')}</span>
                    </>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sand-100/55">{t('province.detail.hero_area_label')}</dt>
                <dd className="mt-1 font-mono normal-case tracking-normal text-sand-50">
                  {province.area !== undefined ? (
                    <>
                      {formatAreaKm2(province.area, locale)}{' '}
                      <span className="font-sans">{t('province.detail.hero_area_suffix')}</span>
                    </>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </ParallaxHero>
    </section>
  );
}
