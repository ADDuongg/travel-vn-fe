import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { ReactNode } from 'react';

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
};

export function SectionReveal({ children, className }: SectionRevealProps) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={cn('scroll-reveal w-full', isVisible && 'is-visible', className)}>
      {children}
    </div>
  );
}

