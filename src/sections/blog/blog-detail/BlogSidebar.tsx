import type { BlogAuthor, TocItem } from '@/features/blog/types';
import { BlogAuthorCard } from './BlogAuthorCard';
import { BlogShareBar } from './BlogShareBar';
import { BlogToc } from './BlogToc';

interface BlogSidebarProps {
  slug: string;
  toc: TocItem[];
  author?: BlogAuthor;
}

export function BlogSidebar({ slug, toc, author }: BlogSidebarProps) {
  return (
    <div className="sticky top-52 space-y-4">
      <BlogToc items={toc} />
      <BlogShareBar slug={slug} />
      <BlogAuthorCard author={author} />
    </div>
  );
}
