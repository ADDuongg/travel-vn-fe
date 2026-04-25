import type { EditorJsBlock } from '@/features/blog/types';

interface EmbedBlockProps {
  block: EditorJsBlock;
}

export function EmbedBlock({ block }: EmbedBlockProps) {
  const embed = String(block.data?.embed ?? '');
  if (!embed) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.1)] bg-white">
      <div className="aspect-video w-full">
        <iframe
          src={embed}
          title={String(block.data?.caption ?? 'Embedded media')}
          className="h-full w-full border-0"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
  );
}
