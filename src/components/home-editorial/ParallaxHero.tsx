import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MutableRefObject, ReactNode, Ref } from 'react';
import { forwardRef, useCallback, useRef } from 'react';

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (ref == null) return;
      if (typeof ref === 'function') {
        ref(value);
      } else {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
}

type ParallaxHeroProps = {
  image: string;
  heightClass?: string;
  overlayClass?: string;
  children?: ReactNode;
};

export const ParallaxHero = forwardRef<HTMLElement, ParallaxHeroProps>(function ParallaxHero(
  { image, heightClass = 'min-h-[92vh]', overlayClass, children },
  forwardedRef,
) {
  const innerRef = useRef<HTMLElement>(null);
  const setRef = useCallback(mergeRefs(innerRef, forwardedRef), [forwardedRef]);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: innerRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);

  return (
    <section ref={setRef} className={`relative isolate overflow-hidden ${heightClass}`}>
      <motion.div
        style={reduceMotion ? undefined : { y }}
        className="absolute inset-0 -top-[15%] h-[125%] will-change-transform"
      >
        <img
          src={image}
          alt=""
          className="h-full w-full scale-[1.03] object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>
      <div
        className={
          overlayClass ??
          'absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/15'
        }
      />
      <div className="relative z-[1] flex h-full flex-col">{children}</div>
    </section>
  );
});

