import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/router';
import { authUtils } from '@/lib/auth-token';
import { cn } from '@/lib/utils';
import { Heart, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToggleFavoriteMutation } from './hooks';
import type { FavoriteEntityType } from './types';

export type FavoriteButtonProps = {
  entityType: FavoriteEntityType;
  entityId: string;
  initialIsFavorited?: boolean;
  className?: string;
  /**
   * When true, prevents parent Link navigation (use on cards wrapped by <Link />).
   */
  stopNavigation?: boolean;
  size?: 'icon' | 'sm' | 'default';
};

export function FavoriteButton({
  entityType,
  entityId,
  initialIsFavorited,
  className,
  stopNavigation = false,
  size = 'icon',
}: FavoriteButtonProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mutation = useToggleFavoriteMutation();

  const [isFavorited, setIsFavorited] = useState<boolean>(
    initialIsFavorited ?? false,
  );

  useEffect(() => {
    if (typeof initialIsFavorited === 'boolean') {
      setIsFavorited(initialIsFavorited);
    }
  }, [initialIsFavorited]);

  const canToggle = useMemo(() => {
    if (!entityId) return false;
    return true;
  }, [entityId]);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (stopNavigation) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (!canToggle) return;

      const token = authUtils.getAccessToken();
      if (!token) {
        navigate(ROUTES.LOGIN);
        return;
      }

      const prev = isFavorited;
      setIsFavorited(!prev);

      try {
        const res = await mutation.mutateAsync({ entityType, entityId });
        setIsFavorited(res.isFavorited);
      } catch {
        setIsFavorited(prev);
      }
    },
    [
      stopNavigation,
      canToggle,
      navigate,
      isFavorited,
      mutation,
      entityType,
      entityId,
    ],
  );

  const label = isFavorited
    ? t('favorites.unfavorite')
    : t('favorites.favorite');

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      disabled={!canToggle || mutation.isPending}
      aria-pressed={isFavorited}
      aria-label={label}
      onClick={handleClick}
      className={cn(
        'cursor-pointer rounded-xl border-slate-200/90 bg-white/90 shadow-sm backdrop-blur-sm transition-colors',
        'hover:bg-white',
        'focus-visible:ring-[#3B82F6]/20',
        className,
      )}
    >
      {mutation.isPending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Heart
          className={cn(
            'size-4',
            isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600',
          )}
          aria-hidden
        />
      )}
    </Button>
  );
}

