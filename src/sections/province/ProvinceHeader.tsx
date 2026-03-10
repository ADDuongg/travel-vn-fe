import { useParams } from 'react-router-dom';
import { useProvinceDetailQuery } from '@/features/provinces/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';

function getRegionLabel(region?: string) {
  if (region === 'NORTH') return 'NORTH VIETNAM';
  if (region === 'CENTRAL') return 'CENTRAL VIETNAM';
  if (region === 'SOUTH') return 'SOUTH VIETNAM';
  return null;
}

export function ProvinceHeader() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useProvinceDetailQuery(slug ?? '');
  const { language } = useLanguage();
  const lang = langKey(language);

  if (isLoading || error || !data) {
    return (
      <div className="min-h-[300px] rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
    );
  }

  const name = data.name?.[lang] ?? data.name?.vi ?? data.name?.en ?? data.slug ?? '';
  const shortDesc =
    data.translations?.[lang]?.shortDescription ??
    data.translations?.vi?.shortDescription ??
    '';
  const regionLabel = getRegionLabel(data.region);
  const imageUrl =
    data.thumbnail?.url ??
    data.gallery?.[0]?.url ??
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80';

  return (
    <div className="px-4 py-6">
      <div
        className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-xl min-h-[450px] relative group"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 50%), url(${imageUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
        <div className="relative z-10 flex flex-col p-8 lg:p-12">
          {regionLabel && (
            <span className="bg-primary/90 text-[#111813] text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
              {regionLabel}
            </span>
          )}
          <h1 className="text-white tracking-light text-5xl font-bold leading-tight">{name}</h1>
          {shortDesc && (
            <p className="text-white/90 text-lg mt-2 max-w-2xl">{shortDesc}</p>
          )}
        </div>
      </div>
    </div>
  );
}
