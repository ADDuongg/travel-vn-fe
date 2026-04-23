import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ProvinceRegion } from '@/sections/province/province-list-query';

const ALL = 'ALL';

interface ProvinceListHeroSearchProps {
  onApply: (params: { search?: string; region?: ProvinceRegion }) => void;
  className?: string;
}

export function ProvinceListHeroSearch({ onApply, className = '' }: ProvinceListHeroSearchProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<ProvinceRegion>(ALL);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply({
      search: search.trim() || undefined,
      region: region === ALL ? undefined : region,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-8 w-full max-w-4xl rounded-xl border border-white/20 bg-white/10 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md motion-reduce:transition-none ${className}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
        <div className="min-w-0 flex-1 sm:border-r sm:border-white/15 sm:pr-2">
          <label className="sr-only" htmlFor="province-hero-search">
            {t('province.search', 'Search')}
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50"
              aria-hidden
            />
            <Input
              id="province-hero-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('province.search_placeholder', 'Search province name...')}
              className="h-11 border-0 bg-white/10 pl-10 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-[#c8102e]/50"
            />
          </div>
        </div>

        <div className="w-full min-w-0 sm:max-w-[220px] sm:px-2">
          <span className="mb-1 block text-left text-[10px] font-semibold uppercase tracking-wider text-white/60 sm:sr-only">
            {t('province.region', 'Region')}
          </span>
          <Select value={region} onValueChange={(value) => setRegion(value as ProvinceRegion)}>
            <SelectTrigger className="h-11 w-full border-0 bg-white/10 text-left text-sm text-white focus:ring-2 focus:ring-[#c8102e]/50 data-[placeholder]:text-white/50 [&>span]:text-white/90">
              <SelectValue placeholder={t('province.region', 'Region')} />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value={ALL}>{t('common.all', 'All')}</SelectItem>
              <SelectItem value="NORTH">{t('province.region_north', 'North')}</SelectItem>
              <SelectItem value="CENTRAL">{t('province.region_central', 'Central')}</SelectItem>
              <SelectItem value="SOUTH">{t('province.region_south', 'South')}</SelectItem>
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
