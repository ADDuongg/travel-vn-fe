import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';

interface BlogTagPillProps {
  slug: string;
  label: string;
}

export function BlogTagPill({ slug, label }: BlogTagPillProps) {
  return (
    <Link
      to={ROUTES.BLOG.TAG.replace(':slug', slug)}
      className="inline-flex cursor-pointer items-center rounded-full border border-[rgba(28,26,20,0.08)] bg-white px-2.5 py-1 text-xs font-medium text-[rgba(28,26,20,0.8)] transition-colors duration-200 hover:border-[#2d6a4f]/35 hover:bg-[#d4eae0]/50"
    >
      #{label}
    </Link>
  );
}
