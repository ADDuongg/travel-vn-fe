import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MagazineSectionHeading } from '@/components/home-editorial/MagazineSectionHeading';
import type { TourGuide } from '@/features/tour-guide/types';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

type TourGuideOverviewProps = {
  guide: TourGuide;
  bio?: string;
  specialties?: string;
  specialtyItems: string[];
  provinceNames: string[];
};

const editorialCard =
  'overflow-hidden rounded-[2rem] border border-charcoal/10 bg-sand-50 p-6 shadow-[var(--shadow-soft)] md:p-8';

export function TourGuideOverview({
  guide,
  bio,
  specialties,
  specialtyItems,
  provinceNames,
}: TourGuideOverviewProps) {
  const { t } = useTranslation();

  return (
    <div id="overview" className="scroll-mt-44 space-y-12 md:space-y-16">
      {bio ? (
        <section className="space-y-6">
          <MagazineSectionHeading
            kicker={t('tour_guide.chapter_about_kicker', 'Portrait')}
            title={t('tour_guide.about')}
            className="space-y-6"
          />
          <Card className={cn(editorialCard)}>
            <p className="whitespace-pre-line text-base leading-[1.75] text-mist">{bio}</p>
          </Card>
        </section>
      ) : null}

      {(guide.languages?.length ?? 0) > 0 || provinceNames.length > 0 ? (
        <section className="space-y-6">
          <MagazineSectionHeading
            kicker={t('tour_guide.field_notes_kicker', 'Field notes')}
            title={t('tour_guide.language_and_area')}
            className="space-y-6"
          />
          <div className="grid grid-cols-1 gap-6 border-t border-charcoal/10 pt-8 sm:grid-cols-2">
            {guide.languages && guide.languages.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal/50">
                  {t('tour_guide.language_label')}
                </p>
                <p className="text-[15px] leading-relaxed text-charcoal/90">
                  {guide.languages.join(', ')}
                </p>
              </div>
            ) : null}
            {provinceNames.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal/50">
                  {t('tour_guide.operating_areas')}
                </p>
                <p className="text-[15px] leading-relaxed text-charcoal/90">{provinceNames.join(', ')}</p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {(specialtyItems.length > 0 ||
        specialties ||
        (guide.certifications?.length ?? 0) > 0) && (
        <section id="specialties" className="scroll-mt-44 space-y-6">
          <MagazineSectionHeading
            kicker={t('tour_guide.specialties_kicker', 'Craft')}
            title={t('tour_guide.specialties_and_certifications')}
            className="space-y-6"
          />
          <Card className={cn(editorialCard)}>
            {specialtyItems.length > 0 ? (
              <div className="mb-6 flex flex-wrap gap-2">
                {specialtyItems.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="rounded-full border border-charcoal/10 bg-sand-100 px-4 py-1.5 text-sm font-medium text-charcoal"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            ) : null}
            {specialties ? (
              <p className="mb-6 leading-relaxed text-mist">{specialties}</p>
            ) : null}
            {guide.certifications && guide.certifications.length > 0 ? (
              <ul className="list-none space-y-3 border-t border-charcoal/10 pt-6">
                {guide.certifications.map((certification) => (
                  <li key={certification} className="flex items-start gap-3 text-mist">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                    <span className="leading-relaxed">{certification}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>
        </section>
      )}
    </div>
  );
}
