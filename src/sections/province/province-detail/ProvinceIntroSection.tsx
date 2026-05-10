import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import { useLanguage } from '@/hooks/useLanguage';
import type { ImageItem, ProvinceDetail } from '@/features/provinces/types';
import { pickLocale } from '@/features/provinces/locale';
import { langKey } from '@/utils/addressOptions';

type ProvinceIntroSectionProps = {
  province: ProvinceDetail;
  images: ImageItem[];
};

export function ProvinceIntroSection({ province, images }: ProvinceIntroSectionProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const name = pickLocale(province.name, language) ?? province.slug;
  const fullName =
    pickLocale(province.fullName, language) ??
    pickLocale(province.fullName, lang) ??
    name;
  const shortDescription =
    province.translations?.[lang]?.shortDescription ??
    province.translations?.vi?.shortDescription ??
    province.translations?.en?.shortDescription ??
    '';
  const introImage = images[1]?.url ?? images[0]?.url;

  return (
    <section id="intro" className="mx-auto max-w-6xl scroll-mt-32 px-4 pt-20 md:px-10 md:pt-24">
      <div
        className={
          introImage
            ? 'grid gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center'
            : 'max-w-3xl space-y-5'
        }
      >
        <Reveal className="space-y-5">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('province.detail.intro_kicker')}
          </p>
          <h2 className="font-display text-4xl text-charcoal md:text-[2.9rem]">
            {t('province.detail.intro_title', { name: fullName })}
          </h2>
          {shortDescription ? (
            <p className="text-xl leading-relaxed text-mist md:text-[1.35rem]">{shortDescription}</p>
          ) : null}
        </Reveal>
        {introImage ? (
          <Reveal>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative overflow-hidden rounded-[2rem] border border-charcoal/10 shadow-soft"
            >
              <img
                src={introImage}
                alt={images[1]?.alt?.trim() || images[0]?.alt?.trim() || fullName}
                className="aspect-[4/5] w-full object-cover md:aspect-auto md:min-h-[460px]"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-charcoal/50 via-transparent to-transparent" />
            </motion.div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
