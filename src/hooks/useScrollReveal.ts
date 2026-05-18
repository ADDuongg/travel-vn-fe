import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(options?: { threshold?: number; rootMargin?: string }) {
  const { threshold = 0.15, rootMargin = '0px' } = options ?? {};
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}

