import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';
import { Building2, Compass, Landmark, Users } from 'lucide-react';
import type { ProvinceDetail } from '@/features/provinces/types';
import { formatAreaKm2, formatCount } from '@/utils/formatNumber';

interface ProvinceSidebarProps {
  province: ProvinceDetail;
}

export function ProvinceSidebar({ province }: ProvinceSidebarProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';

  const facts = [
    {
      label: t('province.population', 'Population'),
      value: province.population !== undefined ? formatCount(province.population, locale) : '--',
    },
    {
      label: t('province.area', 'Area'),
      value: province.area !== undefined ? formatAreaKm2(province.area, locale) : '--',
    },
    {
      label: t('province.best_time_to_visit', 'Best time to visit'),
      value:
        province.bestTimeToVisit?.[lang] ??
        province.bestTimeToVisit?.vi ??
        province.bestTimeToVisit?.en ??
        '--',
    },
    {
      label: t('province.region', 'Region'),
      value: province.region ?? '--',
    },
  ];

  const stats = [
    {
      icon: Building2,
      label: t('province.total_hotels', 'Hotels'),
      value: province.totalHotels,
    },
    {
      icon: Compass,
      label: t('province.total_tours', 'Tours'),
      value: province.totalTours,
    },
    {
      icon: Users,
      label: t('province.total_tour_guides', 'Tour guides'),
      value: province.totalTourGuides,
    },
  ].filter((stat) => stat.value !== undefined);

  const hasTravelStats = stats.length > 0;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[rgba(28,26,20,0.08)] bg-white p-5 shadow-[var(--shadow-card)]">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1c1a14]">
          <Landmark className="size-5 text-[#2d6a4f]" />
          {t('province.quick_facts', 'Quick facts')}
        </h3>
        <div className="mt-4 space-y-3">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-xl bg-[#faf7f2] px-3 py-2.5">
              <p className="text-xs uppercase tracking-wider text-[rgba(28,26,20,0.55)]">{fact.label}</p>
              <p className="mt-1 text-sm font-semibold text-[#1c1a14]">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      {hasTravelStats && (
        <section className="rounded-2xl border border-[rgba(28,26,20,0.08)] bg-white p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-lg font-semibold text-[#1c1a14]">{t('province.stats', 'Travel stats')}</h3>
          <div className="mt-4 space-y-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 rounded-xl bg-[#faf7f2] px-3 py-2.5">
                <stat.icon className="size-4 text-[#2d6a4f]" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-[rgba(28,26,20,0.55)]">{stat.label}</p>
                  <p className="text-sm font-semibold text-[#1c1a14]">
                    {formatCount(stat.value as number, locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
