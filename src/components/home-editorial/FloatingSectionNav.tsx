import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type FloatingSectionNavItem = {
  id: string;
  label: string;
};

type FloatingSectionNavProps = {
  visible: boolean;
  items: FloatingSectionNavItem[];
  ariaLabel: string;
  onNavigate: (sectionId: string) => void;

  stickyTopClassName?: string;

  navClassName?: string;

  buttonsRowClassName?: string;
  buttonClassName?: string;
};

const OUTER_SHELL =
  'pointer-events-none fixed inset-x-0 z-30 flex justify-center px-4';

const DEFAULT_STICKY_TOP = 'top-24 md:top-[93px]';

const DEFAULT_NAV =
  'pointer-events-auto max-w-4xl rounded-full border border-charcoal/10 bg-sand-50/85 px-2 py-2 shadow-soft backdrop-blur-md';

const DEFAULT_ROW =
  'flex max-h-[44vh] flex-wrap justify-center gap-1 overflow-y-auto md:max-h-none md:gap-2';

const DEFAULT_BUTTON_BASE =
  'rounded-full px-2.5 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-charcoal/70 transition hover:bg-sand-100 hover:text-forest';

export function FloatingSectionNav({
  visible,
  items,
  ariaLabel,
  onNavigate,
  stickyTopClassName,
  navClassName,
  buttonsRowClassName,
  buttonClassName,
}: FloatingSectionNavProps) {
  if (items.length === 0) return null;

  return (
    <motion.div
      initial={false}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className={cn(OUTER_SHELL, stickyTopClassName ?? DEFAULT_STICKY_TOP)}
    >
      <nav aria-label={ariaLabel} className={cn(DEFAULT_NAV, navClassName)}>
        <div className={cn(DEFAULT_ROW, buttonsRowClassName)}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(DEFAULT_BUTTON_BASE, buttonClassName)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </motion.div>
  );
}

