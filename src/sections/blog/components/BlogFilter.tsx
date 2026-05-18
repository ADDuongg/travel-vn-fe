import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { BlogCategory, BlogTag } from '@/features/blog/types';
import type { BlogListQuery } from '../blog-list-query';

interface BlogFilterProps {
  value: BlogListQuery;
  categories: BlogCategory[];
  tags: BlogTag[];
  onChange: (value: BlogListQuery) => void;
  onReset: () => void;
}

export function BlogFilter({ value, categories, tags, onChange, onReset }: BlogFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-[rgba(28,26,20,0.1)] bg-white p-4 shadow-[var(--shadow-card)]">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <select
          value={value.category}
          onChange={(e) => onChange({ ...value, category: e.target.value })}
          className="h-10 rounded-xl border border-[rgba(28,26,20,0.15)] bg-white px-3 text-sm"
        >
          <option value="">{t('blog.filter.all_categories')}</option>
          {categories.map((item) => (
            <option key={item._id} value={item.slug}>
              {item.slug}
            </option>
          ))}
        </select>
        <select
          value={value.tag}
          onChange={(e) => onChange({ ...value, tag: e.target.value })}
          className="h-10 rounded-xl border border-[rgba(28,26,20,0.15)] bg-white px-3 text-sm"
        >
          <option value="">{t('blog.filter.all_tags')}</option>
          {tags.map((item) => (
            <option key={item._id} value={item.slug}>
              {item.slug}
            </option>
          ))}
        </select>
        <select
          value={value.sort}
          onChange={(e) =>
            onChange({ ...value, sort: e.target.value as BlogListQuery['sort'] })
          }
          className="h-10 rounded-xl border border-[rgba(28,26,20,0.15)] bg-white px-3 text-sm"
        >
          <option value="latest">{t('blog.filter.sort_latest')}</option>
          <option value="popular">{t('blog.filter.sort_popular')}</option>
          <option value="oldest">{t('blog.filter.sort_oldest')}</option>
        </select>
        <Button
          variant="outline"
          onClick={onReset}
          className="h-10 cursor-pointer rounded-xl border-[rgba(28,26,20,0.2)]"
        >
          {t('blog.list.clear_cta')}
        </Button>
      </div>
    </div>
  );
}

