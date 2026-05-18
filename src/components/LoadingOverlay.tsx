import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { createPortal } from 'react-dom';

export interface LoadingOverlayProps {
  visible: boolean;
  label?: React.ReactNode;
  usePortal?: boolean;
  className?: string;
}

export function LoadingOverlay({
  visible,
  label = 'Đang xử lý...',
  usePortal = true,
  className,
}: LoadingOverlayProps) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      aria-busy={visible}
      className={className}
      style={{
        position: usePortal ? 'fixed' : 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(2px)',
      }}
    >
      <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
      {label && (
        <p className="text-sm font-medium text-white drop-shadow-sm">{label}</p>
      )}
    </div>
  );

  if (!visible) return null;

  if (usePortal && typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
}

