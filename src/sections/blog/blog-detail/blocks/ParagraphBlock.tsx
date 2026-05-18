import { stripHtmlTags } from '@/features/blog/utils';
import type { EditorJsBlock } from '@/features/blog/types';

interface ParagraphBlockProps {
  block: EditorJsBlock;
}

export function ParagraphBlock({ block }: ParagraphBlockProps) {
  const text = String(block.data?.text ?? '');
  return (
    <p className="text-base leading-8 text-[rgba(28,26,20,0.9)]">
      {stripHtmlTags(text)}
    </p>
  );
}

