import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BlogHeroSearchProps {
  initialSearch?: string;
  onApply: (payload: { search: string }) => void;
}

export function BlogHeroSearch({ initialSearch = '', onApply }: BlogHeroSearchProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(initialSearch);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onApply({ search: search.trim() });
      }}
      className="mx-auto mt-6 flex w-full max-w-3xl items-center gap-2 rounded-2xl border border-white/40 bg-white/90 p-2 shadow-[var(--shadow-card)] backdrop-blur"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
        <Search className="size-4 text-[rgba(28,26,20,0.5)]" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('blog.filter.search_placeholder')}
          className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
      </div>
      <Button type="submit" className="cursor-pointer rounded-xl px-5">
        {t('search')}
      </Button>
    </form>
  );
}
