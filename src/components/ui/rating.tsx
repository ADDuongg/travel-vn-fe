import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const ratingVariants = {
  default: {
    star: 'text-foreground',
    emptyStar: 'text-muted-foreground',
  },
  destructive: {
    star: 'text-red-500',
    emptyStar: 'text-red-200',
  },
  yellow: {
    star: 'text-yellow-500',
    emptyStar: 'text-yellow-200',
  },
};

interface RatingsProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  totalStars?: number;
  size?: number;
  fill?: boolean;
  Icon?: React.ReactElement<{ size?: number; className?: string }>;
  variant?: keyof typeof ratingVariants;
  onRate?: (value: number) => void;
  allowHalf?: boolean;
  readOnly?: boolean;
}

export const Ratings: React.FC<RatingsProps> = ({
  rating,
  totalStars = 5,
  size = 20,
  fill = true,
  Icon = <Star />,
  variant = 'yellow',
  onRate,
  allowHalf = true,
  className,
  readOnly = false,
  ...props
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const getDisplayRating = () => hovered ?? rating;

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (readOnly) return;
    if (!allowHalf) {
      setHovered(index + 1);
      return;
    }
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const isHalf = x < width / 2;
    setHovered(index + (isHalf ? 0.5 : 1));
  };

  const handleClick = (index: number, e: React.MouseEvent) => {
    if (readOnly) return;
    if (!onRate) return;

    if (!allowHalf) {
      onRate(index + 1);
      return;
    }

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const isHalf = x < width / 2;
    onRate(index + (isHalf ? 0.5 : 1));
  };

  const displayRating = getDisplayRating();
  const fullStars = Math.floor(displayRating);
  const hasHalfStar = allowHalf && displayRating % 1 >= 0.5;

  return (
    <div
      className={cn('flex items-center gap-1 max-h-[20px]', className)}
      {...props}
    >
      {[...Array(totalStars)].map((_, i) => {
        let starElement: React.ReactNode;

        if (i < fullStars) {
          // full star
          starElement = React.cloneElement(Icon, {
            size,
            className: cn(
              fill ? 'fill-current' : 'fill-transparent',
              ratingVariants[variant].star,
              'cursor-pointer transition-colors',
            ),
            style: { display: 'block', width: size, height: size },
          });
        } else if (i === fullStars && hasHalfStar) {
          // half star
          starElement = (
            <PartialStar
              key={i}
              fillPercentage={0.5}
              size={size}
              className={cn(ratingVariants[variant].star, 'cursor-pointer')}
              Icon={Icon}
            />
          );
        } else {
          // empty star
          starElement = React.cloneElement(Icon, {
            size,
            className: cn(
              'fill-transparent',
              ratingVariants[variant].emptyStar,
              'cursor-pointer transition-colors',
            ),
            style: { display: 'block', width: size, height: size },
          });
        }

        return (
          <div
            key={i}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => handleClick(i, e)}
          >
            {starElement}
          </div>
        );
      })}
    </div>
  );
};

interface PartialStarProps {
  fillPercentage: number; // 0.5 for half
  size: number;
  className?: string;
  Icon: React.ReactElement<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
}

const PartialStar: React.FC<PartialStarProps> = ({
  fillPercentage,
  size,
  className,
  Icon,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: size,
        height: size,
        verticalAlign: 'middle',
        overflow: 'hidden',
      }}
    >
      {React.cloneElement(Icon, {
        size,
        className: cn('fill-transparent', className),
        style: { display: 'block', width: size, height: size },
      })}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${fillPercentage * 100}%`,
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {React.cloneElement(Icon, {
          size,
          className: cn('fill-current', className),
          style: { display: 'block', width: size, height: size },
        })}
      </div>
    </div>
  );
};
