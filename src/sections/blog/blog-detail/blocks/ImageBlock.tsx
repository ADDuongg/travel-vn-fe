import type { EditorJsBlock } from '@/features/blog/types';

interface ImageBlockProps {
  block: EditorJsBlock;
}

export function ImageBlock({ block }: ImageBlockProps) {
  const file = block.data?.file as { url?: string } | undefined;
  const url = file?.url ?? String(block.data?.url ?? '');
  const caption = String(block.data?.caption ?? '');
  if (!url) return null;

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-[rgba(28,26,20,0.1)] bg-white">
      <img src={url} alt={caption || 'Blog image'} className="max-h-[540px] w-full object-cover" loading="lazy" />
      {!!caption && <figcaption className="px-4 py-3 text-sm text-[rgba(28,26,20,0.6)]">{caption}</figcaption>}
    </figure>
  );
}

