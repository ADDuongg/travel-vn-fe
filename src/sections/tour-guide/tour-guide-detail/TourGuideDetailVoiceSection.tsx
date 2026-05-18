import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import type { Review } from '@/features/review/types';

type TourGuideDetailVoiceSectionProps = {
  featured: Review;
  attribution: string;
};

export function TourGuideDetailVoiceSection({
  featured,
  attribution,
}: TourGuideDetailVoiceSectionProps) {
  const { t } = useTranslation();

  if (!featured.comment?.trim()) {
    return null;
  }

  return (
    <section
      id="voice"
      className="scroll-mt-28 border-y border-charcoal/10 bg-charcoal py-20 text-sand-50 md:py-28"
    >
      <div className="mx-auto max-w-4xl px-4 text-center md:px-10">
        <Reveal className="space-y-8">
          <p className="text-[11px] uppercase tracking-[0.38em] text-sand-100/55">
            {t('tour_guide.detail.voice_kicker')}
          </p>
          <p className="font-display text-3xl italic leading-snug md:text-[2.35rem]">
            &ldquo;{featured.comment.trim()}&rdquo;
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-sand-100/55">
            {attribution}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

