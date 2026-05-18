import type { EditorJsBlock } from '@/features/blog/types';

interface CodeBlockProps {
  block: EditorJsBlock;
}

export function CodeBlock({ block }: CodeBlockProps) {
  const code = String(block.data?.code ?? '');
  return (
    <pre className="overflow-x-auto rounded-2xl border border-[rgba(28,26,20,0.14)] bg-[#f5f0e8] p-4 text-sm text-[#1c1a14]">
      <code>{code}</code>
    </pre>
  );
}

