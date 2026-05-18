import { stripHtmlTags } from '@/features/blog/utils';
import type { EditorJsBlock } from '@/features/blog/types';

interface HeaderBlockProps {
  block: EditorJsBlock;
}

export function HeaderBlock({ block }: HeaderBlockProps) {
  const level = Number(block.data?.level ?? 2);
  const text = stripHtmlTags(String(block.data?.text ?? ''));
  const classes =
    'font-bold text-[#1c1a14] scroll-mt-40';

  if (level <= 2) {
    return (
      <h2
        id={block.id}
        className={`${classes} mt-6 text-3xl`}
        style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
      >
        {text}
      </h2>
    );
  }

  return (
    <h3
      id={block.id}
      className={`${classes} mt-5 text-2xl`}
      style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
    >
      {text}
    </h3>
  );
}

