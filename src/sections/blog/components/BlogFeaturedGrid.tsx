import { BlogCard } from './BlogCard';
import type { BlogPostListItem } from '@/features/blog/types';

interface BlogFeaturedGridProps {
  items: BlogPostListItem[];
}

export function BlogFeaturedGrid({ items }: BlogFeaturedGridProps) {
  if (!items.length) return null;

  const [first, ...rest] = items;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <BlogCard item={first} />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
        {rest.slice(0, 2).map((item) => (
          <BlogCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

