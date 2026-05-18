import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
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
    return (
      <section
        id="highlights"
        className="scroll-mt-32 border-y border-charcoal/10 bg-sand-100 py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <p className="max-w-2xl text-center text-base leading-relaxed text-mist md:text-lg">
            {t('province.detail.highlights_empty')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="highlights"
      className="scroll-mt-32 border-y border-charcoal/10 bg-sand-100 py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <Reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('province.detail.highlights_kicker')}
            </p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
              {t('province.detail.highlights_title')}
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-10 lg:grid-cols-3">
          {highlights.map((highlight, i) => {
            const { title, description } = getHighlightTitleAndDescription(
              highlight,
              lang,
              language,
            );
            const imgAlt = highlight.thumbnail?.alt?.trim() || title;

            return (
              <Reveal key={highlight.thumbnail?.url ?? `highlight-${i}`} delay={i * 0.06}>
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-charcoal/10 bg-sand-50 shadow-soft"
                >
                  {highlight.thumbnail?.url ? (
                    <div className="relative aspect-[16/11]">
                      <img
                        src={highlight.thumbnail.url}
                        alt={imgAlt}
                        className="size-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
                    <h3 className="font-display text-2xl text-charcoal">{title}</h3>
                    {description ? (
                      <p className="text-sm leading-relaxed text-mist md:text-[0.97rem]">{description}</p>
                    ) : null}
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

