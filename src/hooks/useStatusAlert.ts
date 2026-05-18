import type { StatusAlertPosition, StatusAlertVariant } from '@/components/StatusAlert';
import { useCallback, useState } from 'react';

export interface StatusAlertState {
  variant: StatusAlertVariant;
  title: React.ReactNode;
  description?: React.ReactNode;
  position?: StatusAlertPosition;
}

export interface UseStatusAlertOptions {
  position?: StatusAlertPosition;
  duration?: number;
}

export function useStatusAlert(options: UseStatusAlertOptions = {}) {
  const { position = 'top-right', duration = 2000 } = options;
  const [alertState, setAlertState] = useState<StatusAlertState | null>(null);

  const clear = useCallback(() => {
    setAlertState(null);
  }, []);

  const show = useCallback(
    (variant: StatusAlertVariant, title: React.ReactNode, description?: React.ReactNode) => {
      setAlertState({ variant, title, description, position });
      if (duration > 0) {
        const id = window.setTimeout(clear, duration);
        return () => window.clearTimeout(id);
      }
    },
    [position, duration, clear],
  );

  const showSuccess = useCallback(
    (title: React.ReactNode = 'Thành công', description?: React.ReactNode) => {
      show('success', title, description);
    },
    [show],
  );

  const showError = useCallback(
    (title: React.ReactNode = 'Lỗi', description?: React.ReactNode) => {
      show('error', title, description);
    },
    [show],
  );

  const showWarning = useCallback(
    (title: React.ReactNode = 'Cảnh báo', description?: React.ReactNode) => {
      show('warning', title, description);
    },
    [show],
  );

  const showInfo = useCallback(
    (title: React.ReactNode = 'Thông tin', description?: React.ReactNode) => {
      show('info', title, description);
    },
    [show],
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clear,
    alertState,
  };
}

