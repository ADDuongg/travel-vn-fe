import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

type MagazineSectionHeadingProps = {
  kicker: string;
  title: string;
  revealDelay?: number;
  /** Spacing/stack for heading block + optional `children` (e.g. `space-y-8`) */
  className?: string;
  /** `responsive` bumps title at md (editorial sections); `flat` stays text-4xl */
  titleSize?: 'responsive' | 'flat';
  titleClassName?: string;
  children?: ReactNode;
};

/** Uppercase kicker + `font-display` title — shared editorial detail sections */
export function MagazineSectionHeading({
  kicker,
  title,
  revealDelay,
  className,
  titleSize = 'responsive',
  titleClassName,
  children,
}: MagazineSectionHeadingProps) {
  const titleTone =
    titleSize === 'flat'
      ? 'font-display text-4xl text-charcoal'
      : 'font-display text-4xl text-charcoal md:text-[2.75rem]';

  return (
    <Reveal delay={revealDelay} className={className}>
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">{kicker}</p>
        <h2 className={cn(titleTone, titleClassName)}>{title}</h2>
      </div>
      {children}
    </Reveal>
  );
}
