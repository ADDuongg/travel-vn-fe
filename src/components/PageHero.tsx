import { cn } from '@/lib/utils';
import { ResponsiveH1 } from '@components/ui/typography';
import type { ReactNode } from 'react';

export type PageHeroProps = {
  title: string;
  subtitle: string;

  badge?: string;
  backgroundImage: string;

  id?: string;
  className?: string;

  contentClassName?: string;

  footerSlot?: ReactNode;
  children?: ReactNode;
};

export function PageHero({
  title,
  subtitle,
  badge,
  backgroundImage,
  id = 'page-hero-heading',
  className,
  contentClassName,
  footerSlot,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn('relative w-full overflow-hidden', className)}
      aria-labelledby={id}
    >
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt=""
          className="h-full min-h-[min(100vh,520px)] w-full object-cover"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#1c1a14]/85 via-[#1c1a14]/45 to-[#1c1a14]/25"
          aria-hidden
        />
      </div>
      <div
        className={cn(
          'relative z-[1] mx-auto flex min-h-[min(100vh,520px)] max-w-7xl flex-col items-center justify-end px-4 pb-16 pt-32 text-center md:px-6 md:pb-24 md:pt-40',
          contentClassName,
        )}
      >
        {badge && (
          <p className="mb-4 inline-flex max-w-2xl rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm md:text-sm">
            {badge}
          </p>
        )}
        <ResponsiveH1
          id={id}
          className="font-dm-serif-display max-w-4xl text-balance text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white drop-shadow-sm sm:text-5xl md:text-6xl"
        >
          {title}
        </ResponsiveH1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">{subtitle}</p>
        {children}
      </div>
      {footerSlot}
    </section>
  );
}

