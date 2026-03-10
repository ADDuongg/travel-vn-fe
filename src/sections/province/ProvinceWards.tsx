import { useParams } from 'react-router-dom';
import { useProvinceDetailQuery } from '@/features/provinces/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';
import { FaMapLocationDot } from 'react-icons/fa6';

export function ProvinceWards() {
  const { slug } = useParams<{ slug: string }>();
  const { data } = useProvinceDetailQuery(slug ?? '');
  const { language } = useLanguage();
  const lang = langKey(language);

  const wards = data?.wards ?? [];

  if (wards.length === 0) return null;

  return (
    <section className="px-4 mb-16" id="wards">
      <h2 className="text-[#111813] dark:text-white text-3xl font-bold pb-8">
        Districts & Wards
      </h2>
      <div className="bg-white dark:bg-[#162d1d] p-6 rounded-xl border border-[#dbe6df] dark:border-[#1e3a29] shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FaMapLocationDot className="text-[#0e7490] size-5" />
          <span className="text-sm font-medium text-[#61896f] dark:text-gray-400">
            {wards.length} districts/wards
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {wards.map((ward) => {
            const name = ward.name?.[lang] ?? ward.name?.vi ?? ward.name?.en ?? ward.slug ?? '';
            return (
              <span
                key={ward.code}
                className="inline-flex items-center rounded-lg bg-[#f0f4f2] dark:bg-[#1e3a29] px-3 py-1.5 text-sm font-medium text-[#111813] dark:text-gray-300"
              >
                {name}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
