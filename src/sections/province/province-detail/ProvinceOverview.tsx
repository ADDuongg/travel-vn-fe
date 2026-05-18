import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';
import type { ProvinceDetail } from '@/features/provinces/types';

interface ProvinceOverviewProps {
  province: ProvinceDetail;
}

export function ProvinceOverview({ province }: ProvinceOverviewProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);

  const description =
    province.translations?.[lang]?.description ??
    province.translations?.vi?.description ??
    province.translations?.en?.description ??
    t('province.default_description', 'Explore this beautiful province of Vietnam.');

  return (
    <section id="overview" className="scroll-mt-44 rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
      <h2
        className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14] sm:text-3xl"
        style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
      >
        {t('province.overview', 'Overview')}
      </h2>
      <p className="mt-4 whitespace-pre-line text-base leading-7 text-[rgba(28,26,20,0.78)] sm:text-lg">
        {description}
      </p>
    </section>
  );
}

