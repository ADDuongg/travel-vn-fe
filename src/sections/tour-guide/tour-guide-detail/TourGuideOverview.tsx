import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { TourGuide } from '@/features/tour-guide/types';
import { FaCertificate, FaLanguage, FaLocationDot, FaUserGroup } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

type TourGuideOverviewProps = {
  guide: TourGuide;
  bio?: string;
  specialties?: string;
  specialtyItems: string[];
  provinceNames: string[];
};

export function TourGuideOverview({
  guide,
  bio,
  specialties,
  specialtyItems,
  provinceNames,
}: TourGuideOverviewProps) {
  const { t } = useTranslation();

  return (
    <div id="overview" className="scroll-mt-44 space-y-8">
      {bio && (
        <Card className="overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.08)] p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FaUserGroup className="h-5 w-5" />
            </span>
            {t('tour_guide.about')}
          </h2>
          <p className="whitespace-pre-line leading-relaxed text-gray-600">{bio}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {guide.languages?.length > 0 && (
          <Card className="overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.08)] p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FaLanguage className="h-5 w-5" />
              </span>
              {t('tour_guide.language_label')}
            </h2>
            <p className="text-gray-600">{guide.languages.join(', ')}</p>
          </Card>
        )}
        {provinceNames.length > 0 && (
          <Card className="overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.08)] p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FaLocationDot className="h-5 w-5" />
              </span>
              {t('tour_guide.operating_areas')}
            </h2>
            <p className="text-gray-600">{provinceNames.join(', ')}</p>
          </Card>
        )}
      </div>

      {(specialtyItems.length > 0 ||
        specialties ||
        (guide.certifications?.length ?? 0) > 0) && (
        <Card
          id="specialties"
          className="scroll-mt-44 overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.08)] p-6 shadow-[var(--shadow-card)]"
        >
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FaCertificate className="h-5 w-5" />
            </span>
            {t('tour_guide.specialties_and_certifications')}
          </h2>
          {specialtyItems.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {specialtyItems.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700"
                >
                  {item}
                </Badge>
              ))}
            </div>
          )}
          {specialties && (
            <p className="mb-4 leading-relaxed text-gray-600">{specialties}</p>
          )}
          {guide.certifications && guide.certifications.length > 0 && (
            <ul className="list-none space-y-2">
              {guide.certifications.map((certification) => (
                <li
                  key={certification}
                  className="flex items-start gap-2 text-gray-600"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{certification}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {guide.gallery && guide.gallery.length > 0 && (
        <Card className="overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.08)] p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            {t('tour_guide.gallery')}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {guide.gallery.map((img, i) => (
              <a
                key={`${img.url}-${i}`}
                href={img.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl ring-1 ring-black/5 transition hover:ring-2 hover:ring-primary/30"
              >
                <img
                  src={img.url}
                  alt={img.alt ?? `${t('tour_guide.gallery_alt')} ${i + 1}`}
                  className="aspect-square w-full object-cover"
                />
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
