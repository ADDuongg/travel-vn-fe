// hooks/useInitAuth.ts
import { useRefresh } from '@/features/auth/hooks';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';

export function useInitAuth() {
  const clearUser = useAuthStore((s) => s.clearUser);
  const setStatus = useAuthStore((s) => s.setStatus);
  const { refresh } = useRefresh();
  useEffect(() => {
    const init = async () => {
      try {
        refresh();
      } catch {
        clearUser();
      } finally {
        setStatus('unauthenticated');
      }
    };

    init();
  }, []);
}
