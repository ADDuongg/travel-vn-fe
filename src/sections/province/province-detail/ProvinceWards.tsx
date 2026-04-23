import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';
import { MapPinned } from 'lucide-react';
import type { ProvinceDetail } from '@/features/provinces/types';

interface ProvinceWardsProps {
  province: ProvinceDetail;
}

export function ProvinceWards({ province }: ProvinceWardsProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const wards = province.wards ?? [];

  if (wards.length === 0) {
    return null;
  }

  return (
    <section id="wards" className="scroll-mt-44 rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2">
        <MapPinned className="size-5 text-[#2d6a4f]" />
        <h2
          className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14] sm:text-3xl"
          style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
        >
          {t('province.districts_wards', 'Districts & Wards')}
        </h2>
      </div>
      <p className="mt-2 text-sm text-[rgba(28,26,20,0.6)]">
        {t('province.ward_count', {
          count: wards.length,
          defaultValue: '{{count}} districts/wards',
        })}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {wards.map((ward) => {
          const name = ward.name?.[lang] ?? ward.name?.vi ?? ward.name?.en ?? ward.slug;
          return (
            <span
              key={ward.code}
              className="inline-flex items-center rounded-full border border-[rgba(28,26,20,0.1)] bg-[#faf7f2] px-3 py-1.5 text-sm font-medium text-[#1c1a14]"
            >
              {name}
            </span>
          );
        })}
      </div>
    </section>
  );
}
