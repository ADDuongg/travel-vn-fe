import { useParams } from 'react-router-dom';
import { useProvinceDetailQuery } from '@/features/provinces/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';
import { FaCalendarDay, FaTemperatureHalf, FaMoneyBill, FaLocationDot } from 'react-icons/fa6';

export function ProvinceOverview() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useProvinceDetailQuery(slug ?? '');
  const { language } = useLanguage();
  const lang = langKey(language);

  if (isLoading || error || !data) return null;

  const description =
    data.translations?.[lang]?.description ??
    data.translations?.vi?.description ??
    data.translations?.en?.description ??
    '';

  const quickFacts = [
    {
      icon: <FaCalendarDay className="text-[#0e7490] size-5" />,
      text: 'Best time: Feb to May',
    },
    {
      icon: <FaTemperatureHalf className="text-[#0e7490] size-5" />,
      text: 'Average: 25°C - 30°C',
    },
    {
      icon: <FaMoneyBill className="text-[#0e7490] size-5" />,
      text: 'Currency: VND (Vietnamese Dong)',
    },
    {
      icon: <FaLocationDot className="text-[#0e7490] size-5" />,
      text: data.fullName?.[lang] ?? data.fullName?.vi ?? data.name?.[lang] ?? '',
    },
  ];

  return (
    <section className="px-4 mb-16" id="overview">
      <h2 className="text-[#111813] dark:text-white tracking-light text-[32px] font-bold leading-tight pb-4">
        Discover the Magic
      </h2>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <p className="text-[#111813] dark:text-gray-300 text-lg font-normal leading-relaxed whitespace-pre-line">
            {description || 'Explore this beautiful province of Vietnam.'}
          </p>
        </div>
        <div className="bg-white dark:bg-[#162d1d] p-6 rounded-xl border border-[#dbe6df] dark:border-[#1e3a29] shadow-sm">
          <h3 className="font-bold text-xl mb-4 text-[#111813] dark:text-white">Quick Facts</h3>
          <ul className="space-y-4">
            {quickFacts.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm text-[#111813] dark:text-gray-300">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
