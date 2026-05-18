import { stripHtmlTags } from '@/features/blog/utils';
import type { EditorJsBlock } from '@/features/blog/types';

interface ListBlockProps {
  block: EditorJsBlock;
}

export function ListBlock({ block }: ListBlockProps) {
  const items = (block.data?.items as Array<string | { content?: string }>) ?? [];
  const style = String(block.data?.style ?? 'unordered');
  const ordered = style === 'ordered';
  const ListTag = ordered ? 'ol' : 'ul';

  return (
    <ListTag className={ordered ? 'list-decimal space-y-2 pl-6' : 'list-disc space-y-2 pl-6'}>
      {items.map((item, index) => {
        const text = stripHtmlTags(typeof item === 'string' ? item : String(item?.content ?? ''));
        return (
          <li key={`${block.id}-${index}`} className="text-base leading-7 text-[rgba(28,26,20,0.9)]">
            {text}
          </li>
        );
      })}
    </ListTag>
  );
}

