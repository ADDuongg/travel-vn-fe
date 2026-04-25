import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { langKey } from '@/utils/addressOptions';
import type { ProvinceDetail } from '@/features/provinces/types';
import { getHighlightTitleAndDescription } from '@/features/provinces/locale';

interface ProvinceHighlightsProps {
  province: ProvinceDetail;
}

export function ProvinceHighlights({ province }: ProvinceHighlightsProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const highlights = province.highlights ?? [];

  if (highlights.length === 0) {
    return null;
  }

  return (
    <section id="highlights" className="scroll-mt-44 rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
      <h2
        className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14] sm:text-3xl"
        style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
      >
        {t('province.highlights', 'Highlights')}
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {highlights.map((highlight, index) => {
          const { title, description } = getHighlightTitleAndDescription(
            highlight,
            lang,
            language,
          );
          const imgAlt = highlight.thumbnail?.alt?.trim() || title;

          return (
            <article
              key={highlight.thumbnail?.url ?? `highlight-${index}`}
              className="overflow-hidden rounded-xl border border-[rgba(28,26,20,0.08)] bg-[#faf7f2] transition-shadow duration-200 hover:shadow-md"
            >
              {highlight.thumbnail?.url && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={highlight.thumbnail.url}
                    alt={imgAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 motion-reduce:transition-none hover:scale-[1.03] motion-reduce:hover:scale-100"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#1c1a14]">{title}</h3>
                {description ? (
                  <p className="mt-2 text-sm leading-6 text-[rgba(28,26,20,0.72)]">{description}</p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
