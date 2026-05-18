import { stripHtmlTags } from '@/features/blog/utils';
import type { EditorJsBlock } from '@/features/blog/types';

interface TableBlockProps {
  block: EditorJsBlock;
}

export function TableBlock({ block }: TableBlockProps) {
  const content = (block.data?.content as string[][]) ?? [];
  if (!content.length) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-[rgba(28,26,20,0.1)]">
      <table className="min-w-full border-collapse bg-white text-sm">
        <tbody>
          {content.map((row, rowIndex) => (
            <tr key={`${block.id}-${rowIndex}`} className={rowIndex === 0 ? 'bg-[#faf7f2]' : undefined}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`${block.id}-${rowIndex}-${cellIndex}`}
                  className="border border-[rgba(28,26,20,0.1)] px-3 py-2 text-[rgba(28,26,20,0.85)]"
                >
                  {stripHtmlTags(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

