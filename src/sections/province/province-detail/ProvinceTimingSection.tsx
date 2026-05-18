import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import { useLanguage } from '@/hooks/useLanguage';
import type { ProvinceDetail } from '@/features/provinces/types';
import { getProvinceBestTimeDisplay } from '@/features/provinces/locale';
import { langKey } from '@/utils/addressOptions';

type ProvinceTimingSectionProps = {
  province: ProvinceDetail;
};

export function ProvinceTimingSection({ province }: ProvinceTimingSectionProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const best = getProvinceBestTimeDisplay(province, lang, language)?.trim();

  if (!best) {
    return (
      <section
        id="timing"
        className="scroll-mt-32 border-y border-charcoal/10 bg-sand-100 py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <p className="max-w-2xl text-center text-base leading-relaxed text-mist md:text-lg">
            {t('province.detail.timing_empty')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="timing"
      className="scroll-mt-32 border-y border-charcoal/10 bg-sand-100 py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <Reveal className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('province.detail.timing_kicker')}
            </p>
            <h2 className="font-display text-4xl text-charcoal">{t('province.detail.timing_title')}</h2>
          </div>
          <p className="text-lg leading-[1.8] text-mist">{best}</p>
        </Reveal>
      </div>
    </section>
  );
}

