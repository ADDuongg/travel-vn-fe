import type { EditorJsBlock } from '@/features/blog/types';
import {
  CodeBlock,
  DelimiterBlock,
  EmbedBlock,
  HeaderBlock,
  ImageBlock,
  ListBlock,
  ParagraphBlock,
  QuoteBlock,
  TableBlock,
  WarningBlock,
} from './blocks';

interface BlogContentRendererProps {
  blocks: EditorJsBlock[];
}

export function BlogContentRenderer({ blocks }: BlogContentRendererProps) {
  if (!blocks.length) return null;

  return (
    <article className="space-y-5 rounded-2xl border border-[rgba(28,26,20,0.1)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      {blocks.map((block, index) => {
        if (block.type === 'paragraph') return <ParagraphBlock key={block.id || index} block={block} />;
        if (block.type === 'header') return <HeaderBlock key={block.id || index} block={block} />;
        if (block.type === 'image') return <ImageBlock key={block.id || index} block={block} />;
        if (block.type === 'list') return <ListBlock key={block.id || index} block={block} />;
        if (block.type === 'quote') return <QuoteBlock key={block.id || index} block={block} />;
        if (block.type === 'code') return <CodeBlock key={block.id || index} block={block} />;
        if (block.type === 'delimiter') return <DelimiterBlock key={block.id || index} />;
        if (block.type === 'table') return <TableBlock key={block.id || index} block={block} />;
        if (block.type === 'embed') return <EmbedBlock key={block.id || index} block={block} />;
        if (block.type === 'warning') return <WarningBlock key={block.id || index} block={block} />;
        return <ParagraphBlock key={block.id || index} block={block} />;
      })}
    </article>
  );
}

