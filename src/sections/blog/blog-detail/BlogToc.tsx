import { useTranslation } from 'react-i18next';
import type { TocItem } from '@/features/blog/types';

interface BlogTocProps {
  items: TocItem[];
}

export function BlogToc({ items }: BlogTocProps) {
  const { t } = useTranslation();
  if (!items.length) return null;

  return (
    <div className="rounded-2xl border border-[rgba(28,26,20,0.1)] bg-white p-4 shadow-[var(--shadow-card)]">
      <h3
        className="text-lg font-bold text-[#1c1a14]"
        style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
      >
        {t('blog.toc_title')}
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block cursor-pointer text-sm text-[rgba(28,26,20,0.75)] transition-colors hover:text-[#c8102e]"
              style={{ paddingLeft: `${Math.max(0, item.level - 1) * 12}px` }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
