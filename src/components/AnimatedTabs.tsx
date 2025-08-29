import { useEffect, useRef, useState, type JSX } from 'react';
import { cn } from '@/lib/utils';
import Container from './Container';

type Tab = {
  id: string;
  label: string;
};

const tabs: Tab[] = [
  { id: 'detail', label: 'Detail' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'map', label: 'Map' },
  { id: 'faq', label: 'FAQ' },
  { id: 'reviews', label: 'Reviews' },
];

export function AnimatedTabs(): JSX.Element {
  const [active, setActive] = useState<string>('detail');
  const [hovered, setHovered] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left?: number;
    width?: number;
  }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      {
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0,
      },
    );

    tabs.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // update indicator khi active hoặc hovered đổi
  useEffect(() => {
    const id = hovered || active;
    const container = containerRef.current;
    const el = container?.querySelector<HTMLButtonElement>(`[data-id="${id}"]`);
    if (el && container) {
      setIndicatorStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [active, hovered]);

  const handleClick = (id: string) => {
    setActive(id);
    const section = document.getElementById(id);
    if (section) {
      const y = section.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <Container>
      <div ref={containerRef} className="relative flex gap-8 py-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            data-id={t.id}
            onClick={() => handleClick(t.id)}
            onMouseEnter={() => setHovered(t.id)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              'relative pb-2 text-sm font-medium transition-colors hover:text-black cursor-pointer',
              active === t.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}

        <span
          className="absolute bottom-0 h-[2px] bg-primary transition-all duration-300 ease-in-out"
          style={indicatorStyle}
        />
      </div>
    </Container>
  );
}
