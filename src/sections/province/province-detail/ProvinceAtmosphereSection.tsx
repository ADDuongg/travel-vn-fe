import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import { useLanguage } from '@/hooks/useLanguage';
import type { ImageItem, ProvinceDetail } from '@/features/provinces/types';
import { pickLocale } from '@/features/provinces/locale';

type ProvinceAtmosphereSectionProps = {
  province: ProvinceDetail;
  images: ImageItem[];
};

export function ProvinceAtmosphereSection({ province, images }: ProvinceAtmosphereSectionProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const name = pickLocale(province.name, language) ?? province.slug;
  const region = province.region;
  if (!region || (region !== 'NORTH' && region !== 'CENTRAL' && region !== 'SOUTH')) {
    return (
      <section
        id="atmosphere"
        className="scroll-mt-32 border-y border-charcoal/10 bg-charcoal px-4 py-16 text-sand-50 md:px-10 md:py-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-sand-100/85">{t('province.detail.atmosphere_empty')}</p>
        </div>
      </section>
    );
  }

  const title = t(`province.detail.atmosphere.${region}.title`);
  const body = t(`province.detail.atmosphere.${region}.body`);
  const imageSrc = images[2]?.url ?? images[0]?.url;

  return (
    <section
      id="atmosphere"
      className="scroll-mt-32 border-y border-charcoal/10 bg-charcoal px-4 py-20 text-sand-50 md:px-10 md:py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <Reveal className="space-y-6">
          <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/65">
            {t('province.detail.atmosphere_kicker')}
          </p>
          <h2 className="font-display text-4xl leading-tight md:text-[2.9rem]">{title}</h2>
          <p className="text-lg leading-relaxed text-sand-100/85">{body}</p>
        </Reveal>
        {imageSrc ? (
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
              <img
                src={imageSrc}
                alt=""
                className="aspect-[16/13] w-full object-cover opacity-92"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
              <p className="absolute bottom-8 left-8 right-8 font-display text-2xl italic text-sand-50/92 md:text-3xl">
                {t('province.detail.atmosphere_quote', { name })}
              </p>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
