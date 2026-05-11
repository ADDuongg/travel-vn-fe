import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/home-editorial/Reveal';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/router';
import { FaLink, FaShareNodes } from 'react-icons/fa6';

type TourGuideDetailShareRowProps = {
  guideId: string;
  guideName: string;
};

export function TourGuideDetailShareRow({
  guideId,
  guideName,
}: TourGuideDetailShareRowProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${ROUTES.TOUR_GUIDE.DETAIL.replace(':id', guideId)}`
      : '';

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [shareUrl]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: guideName,
          text: t('tour_guide.detail.share_text', { name: guideName }),
          url: shareUrl,
        });
      } catch {
        /* user cancelled or share failed */
      }
    } else {
      await handleCopy();
    }
  }, [guideName, handleCopy, shareUrl, t]);

  return (
    <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {typeof navigator !== 'undefined' && 'share' in navigator ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border-charcoal/15"
            onClick={() => void handleShare()}
          >
            <FaShareNodes className="me-2 h-3.5 w-3.5" aria-hidden />
            {t('tour_guide.detail.share_profile')}
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full border-charcoal/15"
          onClick={() => void handleCopy()}
        >
          <FaLink className="me-2 h-3.5 w-3.5" aria-hidden />
          {copied
            ? t('tour_guide.detail.link_copied')
            : t('tour_guide.detail.copy_link')}
        </Button>
      </div>
      <Link
        to={ROUTES.TOUR_GUIDE.INDEX}
        className="text-sm font-semibold text-forest underline-offset-4 hover:text-sunset-deep hover:underline"
      >
        {t('tour_guide.detail.back_to_list_inline')}
      </Link>
    </Reveal>
  );
}
