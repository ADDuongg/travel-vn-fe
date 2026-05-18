import React, { useState } from 'react';
import { Ratings } from '@/components/ui/rating';
import useMediaQuery from '@/hooks/useMediaQuery';
import { feedbacks } from '@/mock';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionReveal } from './SectionReveal';

const FeedbackCard = ({
  feedback,
  highlight,
  faded,
  onClick,
  animation,
}: {
  feedback: (typeof feedbacks)[0];
  highlight?: boolean;
  faded?: boolean;
  onClick?: () => void;
  animation?: string;
}) => (
  <div
    className={cn(
      'mx-auto flex min-h-[260px] max-w-[420px] cursor-pointer flex-col items-start gap-4 rounded-2xl border border-border/50 bg-card p-8',
      'shadow-[var(--shadow-card)] transition-all duration-500',
      'hover:shadow-[var(--shadow-elevated)]',
      highlight
        ? 'z-10 scale-105 border-primary/20 opacity-100 shadow-md'
        : faded
          ? 'opacity-40'
          : 'opacity-80',
      animation,
    )}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    }}
    role="button"
    tabIndex={0}
  >
    <div className="mb-2 flex w-full items-center gap-4">
      <img
        src={feedback.avatar}
        alt=""
        className="h-12 w-12 rounded-full object-cover ring-2 ring-hoi-an-gold/30"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <div className="text-base font-semibold text-foreground">{feedback.name}</div>
        <div className="text-sm text-muted-foreground">{feedback.role}</div>
        {feedback.location && (
          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden />
            {feedback.location}
          </div>
        )}
      </div>
      <div className="shrink-0">
        <Ratings
          rating={feedback.rating}
          variant="yellow"
          totalStars={5}
          readOnly
          size={18}
        />
      </div>
    </div>
    <p className="text-base leading-relaxed text-muted-foreground">{feedback.feedback}</p>
  </div>
);

export const CustomerFeedback: React.FC = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(1);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const isPC = useMediaQuery('(min-width: 1280px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1279px)');

  const getVisible = () => {
    if (isPC) {
      const left = (selected - 1 + feedbacks.length) % feedbacks.length;
      const right = (selected + 1) % feedbacks.length;
      return [feedbacks[left], feedbacks[selected], feedbacks[right]];
    }
    if (isTablet) {
      const right = (selected + 1) % feedbacks.length;
      return [feedbacks[selected], feedbacks[right]];
    }
    return [feedbacks[selected]];
  };

  const visible = getVisible();

  const handleSnapClick = (idx: number) => {
    if (idx === selected) return;
    setDirection(idx > selected ? 'right' : 'left');
    setSelected(idx);
    setTimeout(() => setDirection(null), 500);
  };

  const getAnimation = (pos: number) => {
    if (!direction) return '';
    if (isPC && visible.length === 3 && pos === 1) {
      return direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left';
    }
    if (isTablet && visible.length === 2 && pos === 0) {
      return direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left';
    }
    if (!isPC && !isTablet && pos === 0) {
      return direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left';
    }
    return '';
  };

  return (
    <section className="w-full" aria-labelledby="social-proof-heading">
      <SectionReveal>
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <h2
            id="social-proof-heading"
            className="mb-3 text-center font-dm-serif-display text-3xl font-bold text-foreground md:mb-4 md:text-4xl"
          >
            {t('home_page.social_proof_title')}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-base text-muted-foreground">
            {t('home_page.social_proof_subtitle')}
          </p>

          <ul className="mb-10 flex flex-wrap items-center justify-center gap-3 md:gap-6" role="list">
            <li className="flex min-w-[140px] flex-1 flex-col items-center rounded-2xl border border-border/50 bg-surface-100 px-4 py-3 text-center sm:flex-initial sm:px-5">
              <span className="font-dm-serif-display text-2xl font-bold text-foreground">2,000+</span>
              <span className="text-xs text-muted-foreground sm:text-sm">{t('home_page.stat_travelers')}</span>
            </li>
            <li className="flex min-w-[140px] flex-1 flex-col items-center rounded-2xl border border-hoi-an-gold/30 bg-gold-soft/50 px-4 py-3 text-center sm:flex-initial sm:px-5">
              <span className="font-dm-serif-display text-2xl font-bold text-hoi-an-gold">4.8</span>
              <span className="text-xs text-muted-foreground sm:text-sm">{t('home_page.stat_rating')}</span>
            </li>
            <li className="flex min-w-[140px] flex-1 flex-col items-center rounded-2xl border border-border/50 bg-surface-100 px-4 py-3 text-center sm:flex-initial sm:px-5">
              <span className="font-dm-serif-display text-2xl font-bold text-foreground">500+</span>
              <span className="text-xs text-muted-foreground sm:text-sm">{t('home_page.stat_reviews')}</span>
            </li>
          </ul>

          <div
            className={cn('flex w-full flex-wrap justify-center gap-4 md:gap-8', visible.length === 1 && 'justify-center')}
          >
            {visible.map((fb, idx) => (
              <FeedbackCard
                key={`${fb.name}-${idx}`}
                feedback={fb}
                highlight={isPC && visible.length === 3 && idx === 1}
                faded={isPC && visible.length === 3 && idx !== 1}
                onClick={() => {
                  const n = feedbacks.length;
                  const next = (selected + idx - (isPC ? 1 : 0) + n) % n;
                  handleSnapClick(next);
                }}
                animation={getAnimation(idx)}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-3" role="tablist" aria-label={t('home_page.reviews_nav_aria')}>
            {feedbacks.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSnapClick(idx)}
                className={cn(
                  'h-3 w-3 cursor-pointer rounded-full border-2 border-primary/40 transition-colors',
                  selected === idx ? 'bg-primary' : 'bg-muted/60',
                )}
                aria-label={t('home_page.review_dot', { n: idx + 1 })}
                aria-current={selected === idx}
              />
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
};

export default CustomerFeedback;

