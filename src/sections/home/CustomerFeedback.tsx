import React, { useState } from 'react';
import { Ratings } from '@/components/ui/rating';
import useMediaQuery from '@/hooks/useMediaQuery';
import { feedbacks } from '@/mock';
import { useTranslation } from 'react-i18next';
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
    className={`mx-auto flex max-w-[420px] min-h-[260px] cursor-pointer flex-col items-start gap-4 rounded-2xl border border-border/60 bg-card p-8 shadow-sm transition-all duration-500 ${
      highlight
        ? 'scale-105 z-10 opacity-100 shadow-md'
        : faded
        ? 'opacity-40'
        : 'opacity-70'
    } ${animation}`}
    onClick={onClick}
  >
    <div className="flex items-center gap-4 mb-2">
      <img
        src={feedback.avatar}
        alt={feedback.name}
        className="h-12 w-12 rounded-full object-cover"
        loading="lazy"
      />
      <div>
        <div className="text-base font-semibold text-foreground">{feedback.name}</div>
        <div className="text-sm text-muted-foreground">{feedback.role}</div>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Ratings
          rating={feedback.rating}
          variant="yellow"
          totalStars={5}
          readOnly
          size={18}
        />
      </div>
    </div>
    <div className="text-base leading-relaxed text-muted-foreground">
      {feedback.feedback}
    </div>
  </div>
);

export const CustomerFeedback: React.FC = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(1); // center index
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const isPC = useMediaQuery('(min-width: 1280px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1279px)');

  // Determine how many cards to show
  const getVisible = () => {
    if (isPC) {
      // 3 cards
      const left = (selected - 1 + feedbacks.length) % feedbacks.length;
      const right = (selected + 1) % feedbacks.length;
      return [feedbacks[left], feedbacks[selected], feedbacks[right]];
    } else if (isTablet) {
      // 2 cards
      const right = (selected + 1) % feedbacks.length;
      return [feedbacks[selected], feedbacks[right]];
    } else {
      // 1 card
      return [feedbacks[selected]];
    }
  };

  const visible = getVisible();

  const handleSnapClick = (idx: number) => {
    if (idx === selected) return;
    setDirection(idx > selected ? 'right' : 'left');
    setSelected(idx);
    setTimeout(() => setDirection(null), 500);
  };

  // Animation classes
  const getAnimation = (pos: number) => {
    if (!direction) return '';
    if (isPC && visible.length === 3 && pos === 1) {
      return direction === 'right'
        ? 'animate-slide-in-right'
        : 'animate-slide-in-left';
    }
    if (isTablet && visible.length === 2 && pos === 0) {
      return direction === 'right'
        ? 'animate-slide-in-right'
        : 'animate-slide-in-left';
    }
    if (!isPC && !isTablet && pos === 0) {
      return direction === 'right'
        ? 'animate-slide-in-right'
        : 'animate-slide-in-left';
    }
    return '';
  };

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-16">
        <h2 className="mb-12 text-center font-dm-serif-display text-3xl font-bold text-foreground md:text-4xl">
          {t('home_page.customer_feedback_title')}
        </h2>
        <div
          className={`flex gap-4 md:gap-8 w-full justify-center mb-8 ${
            visible.length === 1 ? 'justify-center' : ''
          }`}
        >
          {visible.map((fb, idx) => (
            <FeedbackCard
              key={idx}
              feedback={fb}
              highlight={isPC && visible.length === 3 && idx === 1}
              faded={isPC && visible.length === 3 && idx !== 1}
              onClick={() =>
                handleSnapClick(
                  (selected + idx - (isPC ? 1 : 0)) % feedbacks.length,
                )
              }
              animation={getAnimation(idx)}
            />
          ))}
        </div>
        <div className="flex gap-3 justify-center mt-2">
          {feedbacks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSnapClick(idx)}
              className={`w-3 h-3 rounded-full transition-colors border border-primary ${
                selected === idx ? 'bg-primary' : 'bg-muted/50'
              }`}
              aria-label={`Go to feedback ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerFeedback;
