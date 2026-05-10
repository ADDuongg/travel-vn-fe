import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProvincesQuery } from '@/features/provinces/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Province } from '@/features/provinces/types';
import { Search } from 'lucide-react';

const ALL = '__all__';

export function TourListHeroSearch({
  onApply,
  className = '',
  initialSearch = '',
  initialDestinationId,
}: {
  onApply: (params: { search?: string; destinationId?: string }) => void;
  className?: string;
  /** Synced from URL / parent query (tour list editorial). */
  initialSearch?: string;
  initialDestinationId?: string;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: provinces } = useProvincesQuery();
  const [search, setSearch] = useState(initialSearch);
  const [destinationId, setDestinationId] = useState(
    initialDestinationId && initialDestinationId !== '' ? initialDestinationId : ALL,
  );

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setDestinationId(
      initialDestinationId && initialDestinationId !== '' ? initialDestinationId : ALL,
    );
  }, [initialDestinationId]);

  const getLabel = (p: Province) =>
    p.name?.[language as 'vi' | 'en'] ?? p.name?.vi ?? p.name?.en ?? p.slug;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      search: search.trim() || undefined,
      destinationId: destinationId === ALL ? undefined : destinationId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-8 w-full max-w-4xl rounded-xl border border-white/20 bg-white/10 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md motion-reduce:transition-none ${className}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
        <div className="min-w-0 flex-1 sm:border-r sm:border-white/15 sm:pr-2">
          <label className="sr-only" htmlFor="tour-hero-search">
            {t('tour.filter.search', 'Search')}
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50"
              aria-hidden
            />
            <Input
              id="tour-hero-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(
                'tour.filter.search_placeholder',
                'Tour name or code...',
              )}
              className="h-11 border-0 bg-white/10 pl-10 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-[#c8102e]/50"
            />
          </div>
        </div>
        <div className="w-full min-w-0 sm:max-w-[200px] sm:px-2">
          <span className="mb-1 block text-left text-[10px] font-semibold uppercase tracking-wider text-white/60 sm:sr-only">
            {t('tour.filter.destination', 'Destination')}
          </span>
          <Select value={destinationId} onValueChange={setDestinationId}>
            <SelectTrigger className="h-11 w-full border-0 bg-white/10 text-left text-sm text-white focus:ring-2 focus:ring-[#c8102e]/50 data-[placeholder]:text-white/50 [&>span]:text-white/90">
              <SelectValue
                placeholder={t(
                  'tour.filter.select_destination',
                  'Destination',
                )}
              />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value={ALL}>
                {t('common.all', 'All')}
              </SelectItem>
              {(provinces ?? []).map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {getLabel(p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="shrink-0 sm:pl-2">
          <Button
            type="submit"
            className="h-11 w-full min-w-[120px] cursor-pointer border-0 bg-[#c8102e] text-[15px] font-medium text-white shadow-[0_8px_24px_rgba(200,16,46,0.35)] transition-shadow duration-200 hover:bg-[#a50d25] sm:w-auto"
          >
            {t('buttons.search', 'Search')}
          </Button>
        </div>
      </div>
    </form>
  );
}
