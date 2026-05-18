import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';

interface BlogCategoryPillProps {
  slug: string;
  label: string;
}

export function BlogCategoryPill({ slug, label }: BlogCategoryPillProps) {
  return (
    <Link
      to={ROUTES.BLOG.CATEGORY.replace(':slug', slug)}
      className="inline-flex cursor-pointer items-center rounded-full border border-[rgba(28,26,20,0.12)] bg-[#faf7f2] px-2.5 py-1 text-xs font-semibold text-[#1c1a14] transition-colors duration-200 hover:border-[#c9922a]/45 hover:bg-[#f5e9d0]"
    >
      {label}
    </Link>
  );
}

