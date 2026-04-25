import { stripHtmlTags } from '@/features/blog/utils';
import type { EditorJsBlock } from '@/features/blog/types';

interface QuoteBlockProps {
  block: EditorJsBlock;
}

export function QuoteBlock({ block }: QuoteBlockProps) {
  const text = stripHtmlTags(String(block.data?.text ?? ''));
  const caption = stripHtmlTags(String(block.data?.caption ?? ''));

  return (
    <blockquote className="rounded-r-2xl border-l-4 border-[#c8102e] bg-[#fff7f7] px-5 py-4">
      <p
        className="text-xl italic text-[#1c1a14]"
        style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
      >
        {text}
      </p>
      {!!caption && <footer className="mt-2 text-sm text-[rgba(28,26,20,0.7)]">- {caption}</footer>}
    </blockquote>
  );
}
