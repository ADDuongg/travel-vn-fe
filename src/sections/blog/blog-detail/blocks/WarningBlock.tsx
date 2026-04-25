import { stripHtmlTags } from '@/features/blog/utils';
import type { EditorJsBlock } from '@/features/blog/types';

interface WarningBlockProps {
  block: EditorJsBlock;
}

export function WarningBlock({ block }: WarningBlockProps) {
  const title = stripHtmlTags(String(block.data?.title ?? ''));
  const message = stripHtmlTags(String(block.data?.message ?? ''));
  if (!title && !message) return null;

  return (
    <div className="rounded-2xl border border-[#c9922a]/35 bg-[#f5e9d0] p-4">
      {!!title && (
        <div className="text-sm font-semibold uppercase tracking-wider text-[#7b5110]">{title}</div>
      )}
      {!!message && <p className="mt-1 text-sm text-[#5f4b24]">{message}</p>}
    </div>
  );
}
