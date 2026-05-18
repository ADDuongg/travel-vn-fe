import { ROUTES } from '@/constants/router';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const hotspots: {
  labelKey: string;
  searchQuery: string;
  cx: number;
  cy: number;
}[] = [
  {
    labelKey: 'editorial.map.hotspots.hanoi',
    searchQuery: 'Ha Noi',
    cx: 52,
    cy: 26,
  },
  {
    labelKey: 'editorial.map.hotspots.danang',
    searchQuery: 'Da Nang',
    cx: 54,
    cy: 52,
  },
  {
    labelKey: 'editorial.map.hotspots.hoian',
    searchQuery: 'Hoi An',
    cx: 56,
    cy: 54,
  },
  {
    labelKey: 'editorial.map.hotspots.hcmc',
    searchQuery: 'Ho Chi Minh',
    cx: 46,
    cy: 76,
  },
  {
    labelKey: 'editorial.map.hotspots.dalat',
    searchQuery: 'Da Lat',
    cx: 49,
    cy: 69,
  },
];

function provincesSearchLink(searchQuery: string) {
  const q = new URLSearchParams();
  q.set('search', searchQuery);
  return `${ROUTES.PROVINCE.INDEX}?${q.toString()}`;
}

export function VietnamMap() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const go = (searchQuery: string) => {
    navigate(provincesSearchLink(searchQuery));
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-charcoal/10 bg-gradient-to-br from-sand-50 via-sand-100 to-sand-200 p-6 shadow-soft md:p-10">
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-sunset/35 opacity-60 blur-3xl" />
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="relative">
          <svg
            viewBox="0 0 100 120"
            role="img"
            aria-label={t('editorial.map.aria_map')}
            className="w-full drop-shadow-[0_28px_70px_rgba(26,26,26,0.18)]"
          >
            <defs>
              <linearGradient id="land" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(94% 0.03 82)" />
                <stop offset="100%" stopColor="oklch(88% 0.04 160)" />
              </linearGradient>
            </defs>
            <path
              fill="url(#land)"
              stroke="oklch(28% 0.045 165 / 0.35)"
              strokeWidth="0.6"
              d="M52 8 C58 15 63 22 66 30 C68 38 70 46 69 54 C67 62 63 70 58 78 C54 86 48 94 44 102 C40 108 36 112 32 114 C28 116 24 114 22 110 C20 104 22 98 26 92 C30 84 34 76 36 68 C38 58 40 48 42 40 C44 30 46 22 48 16 C49 12 50 9 52 8 Z"
            />
            {hotspots.map((h) => (
              <g
                key={h.searchQuery}
                role="link"
                tabIndex={0}
                className="cursor-pointer outline-none"
                onClick={() => go(h.searchQuery)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    go(h.searchQuery);
                  }
                }}
              >
                <circle cx={h.cx} cy={h.cy} r="6" fill="transparent" />
                <circle
                  cx={h.cx}
                  cy={h.cy}
                  r="2.4"
                  className="fill-sunset stroke-charcoal/40"
                  strokeWidth="0.35"
                />
              </g>
            ))}
          </svg>
          <p className="mt-4 text-center text-[11px] uppercase tracking-[0.26em] text-charcoal/45">
            {t('editorial.map.tap_hint')}
          </p>
        </div>
        <div className="space-y-6">
          <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
            {t('editorial.map.side_eyebrow')}
          </p>
          <h3 className="font-display text-4xl leading-tight text-charcoal md:text-[2.75rem]">
            {t('editorial.map.side_title')}
          </h3>
          <p className="text-sm leading-relaxed text-mist md:text-base">
            {t('editorial.map.side_body')}
          </p>
          <div className="flex flex-wrap gap-3">
            {hotspots.map((h) => (
              <button
                key={h.searchQuery}
                type="button"
                onClick={() => go(h.searchQuery)}
                className="rounded-full border border-charcoal/10 bg-sand-50 px-4 py-2 text-xs font-medium text-charcoal transition hover:border-forest/40 hover:text-forest"
              >
                {t(h.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

