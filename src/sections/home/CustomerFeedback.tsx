import React, { useState } from 'react';
import { Ratings } from '@/components/ui/rating';
import useMediaQuery from '@/hooks/useMediaQuery';
import { feedbacks } from '@/mock';
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
    className={`bg-white rounded-2xl shadow-md p-8 flex flex-col items-start gap-4 transition-all duration-500 mx-auto cursor-pointer ${
      highlight
        ? 'scale-105 z-10 opacity-100'
        : faded
        ? 'opacity-40'
        : 'opacity-70'
    } ${animation}`}
    style={{ maxWidth: 420, minHeight: 260 }}
    onClick={onClick}
  >
    <div className="flex items-center gap-4 mb-2">
      <img
        src={feedback.avatar}
        alt={feedback.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <div className="font-bold text-base text-gray-900">{feedback.name}</div>
        <div className="text-gray-400 text-sm">{feedback.role}</div>
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
    <div className="text-gray-600 text-base leading-relaxed">
      {feedback.feedback}
    </div>
  </div>
);

export const CustomerFeedback: React.FC = () => {
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
    <section className="w-full py-16 px-2 md:px-8 bg-[#F6F6F6]">
      <h2 className="text-center text-3xl md:text-4xl font-dm-serif-display font-bold mb-12 text-[#231942]">
        What our customers are
        <br />
        saying about us
      </h2>
      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
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
      <style>{`
        .animate-slide-in-right {
          animation: slideInRight 0.5s;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.5s;
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px) translateY(20px); }
          to { opacity: 1; transform: translateX(0) translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px) translateY(20px); }
          to { opacity: 1; transform: translateX(0) translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default CustomerFeedback;
