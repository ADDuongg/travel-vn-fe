import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useState, type RefObject } from 'react';

/** Show floating section nav once hero scroll-progress passes `revealThreshold` (0–1). */
export function useHeroScrollNavReveal(
  heroRef: RefObject<HTMLElement | null>,
  revealThreshold: number = 0.5,
) {
  const [visible, setVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setVisible(v >= revealThreshold);
  });

  return visible;
}
