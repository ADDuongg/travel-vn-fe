import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface BlogShareBarProps {
  slug: string;
}

export function BlogShareBar({ slug }: BlogShareBarProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/blog/${slug}`;

  const shareLinks = [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  return (
    <div className="rounded-2xl border border-[rgba(28,26,20,0.1)] bg-white p-4 shadow-[var(--shadow-card)]">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[rgba(28,26,20,0.65)]">
        {t('blog.share')}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          {copied ? t('common.copied') : 'Copy link'}
        </Button>
        {shareLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex cursor-pointer items-center rounded-md border border-[rgba(28,26,20,0.15)] px-3 py-1.5 text-xs font-medium text-[#1c1a14] hover:bg-[#faf7f2]"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
