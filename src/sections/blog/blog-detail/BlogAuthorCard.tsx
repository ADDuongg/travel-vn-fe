import { useTranslation } from 'react-i18next';
import type { BlogAuthor } from '@/features/blog/types';

interface BlogAuthorCardProps {
  author?: BlogAuthor;
}

export function BlogAuthorCard({ author }: BlogAuthorCardProps) {
  const { t } = useTranslation();
  if (!author) return null;

  const name = author.fullName ?? author.name ?? 'Admin';

  return (
    <div className="rounded-2xl border border-[rgba(28,26,20,0.1)] bg-white p-4 shadow-[var(--shadow-card)]">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[rgba(28,26,20,0.65)]">
        {t('blog.by_author', { name })}
      </h3>
      <div className="mt-3 flex items-center gap-3">
        <img
          src={author.avatar || '/images/logox1.png'}
          alt={name}
          className="size-12 rounded-full border border-[rgba(28,26,20,0.12)] object-cover"
        />
        <div>
          <p className="text-base font-semibold text-[#1c1a14]">{name}</p>
          <p className="text-xs text-[rgba(28,26,20,0.6)]">VN Travel Editorial</p>
        </div>
      </div>
    </div>
  );
}

