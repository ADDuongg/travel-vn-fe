import { useState } from 'react';
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

export function RoomListHeroSearch({
  onApply,
  className = '',
}: {
  onApply: (params: { search?: string; provinceId?: string }) => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: provinces } = useProvincesQuery();
  const [search, setSearch] = useState('');
  const [provinceId, setProvinceId] = useState(ALL);

  const getLabel = (p: Province) =>
    p.name?.[language as 'vi' | 'en'] ?? p.name?.vi ?? p.name?.en ?? p.slug;

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply({
      search: search.trim() || undefined,
      provinceId: provinceId === ALL ? undefined : provinceId,
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`mt-8 w-full max-w-4xl rounded-xl border border-white/20 bg-white/10 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md ${className}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
        <div className="min-w-0 flex-1 sm:border-r sm:border-white/15 sm:pr-2">
          <label htmlFor="room-hero-search" className="sr-only">
            {t('room.filter.search', 'Search')}
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50"
              aria-hidden
            />
            <Input
              id="room-hero-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('room.filter.search_placeholder', 'Room name...')}
              className="h-11 border-0 bg-white/10 pl-10 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-[#c8102e]/50"
            />
          </div>
        </div>
        <div className="w-full min-w-0 sm:max-w-[220px] sm:px-2">
          <Select value={provinceId} onValueChange={setProvinceId}>
            <SelectTrigger className="h-11 w-full border-0 bg-white/10 text-left text-sm text-white focus:ring-2 focus:ring-[#c8102e]/50 data-[placeholder]:text-white/50 [&>span]:text-white/90">
              <SelectValue
                placeholder={t('room.filter.select_province', 'Province')}
              />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value={ALL}>{t('common.all', 'All')}</SelectItem>
              {(provinces ?? []).map((province) => (
                <SelectItem key={province._id} value={province._id}>
                  {getLabel(province)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="shrink-0 sm:pl-2">
          <Button
            type="submit"
            className="h-11 w-full min-w-[120px] cursor-pointer border-0 bg-[#c8102e] text-[15px] font-medium text-white shadow-[0_8px_24px_rgba(200,16,46,0.35)] hover:bg-[#a50d25] sm:w-auto"
          >
            {t('buttons.search', 'Search')}
          </Button>
        </div>
      </div>
    </form>
  );
}

