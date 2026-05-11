import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import { splitBioToParagraphs } from './helpers';

type TourGuideDetailStorySectionProps = {
  bio?: string;
  quote?: string;
};

export function TourGuideDetailStorySection({
  bio,
  quote,
}: TourGuideDetailStorySectionProps) {
  const { t } = useTranslation();
  const paragraphs = splitBioToParagraphs(bio);
  const showQuote = !!quote?.trim();

  if (!paragraphs.length && !showQuote) {
    return null;
  }

  const quoteBlock = showQuote ? (
    <Reveal>
      <blockquote className="relative overflow-hidden rounded-[2rem] border border-charcoal/10 bg-charcoal px-8 py-10 text-sand-50 shadow-[var(--shadow-soft)] md:px-12 md:py-12">
        <p className="font-display text-2xl italic leading-snug md:text-3xl">
          &ldquo;{quote}&rdquo;
        </p>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.35em] text-sand-100/55">
          {t('tour_guide.detail.story_quote_caption')}
        </p>
      </blockquote>
    </Reveal>
  ) : null;

  if (!paragraphs.length && showQuote) {
    return (
      <section id="story" className="mx-auto max-w-6xl scroll-mt-28 px-4 pt-20 md:px-10 md:pt-28">
        <div className="mx-auto max-w-3xl space-y-8">
          <Reveal className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
              {t('tour_guide.detail.story_kicker')}
            </p>
            <h2 className="font-display text-4xl text-charcoal md:text-[2.85rem]">
              {t('tour_guide.detail.story_title')}
            </h2>
          </Reveal>
          {quoteBlock}
        </div>
      </section>
    );
  }

  return (
    <section id="story" className="mx-auto max-w-6xl scroll-mt-28 px-4 pt-20 md:px-10 md:pt-28">
      <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <Reveal className="space-y-8">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('tour_guide.detail.story_kicker')}
          </p>
          <h2 className="font-display text-4xl text-charcoal md:text-[2.85rem]">
            {t('tour_guide.detail.story_title')}
          </h2>
          {paragraphs.map((para) => (
            <p
              key={para.slice(0, 48)}
              className="text-lg leading-relaxed text-mist md:text-xl"
            >
              {para}
            </p>
          ))}
        </Reveal>
        {quoteBlock ?? <div className="hidden lg:block" aria-hidden />}
      </div>
    </section>
  );
}
