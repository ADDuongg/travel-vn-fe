import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { TourGuide } from '@/features/tour-guide/types';
import { fmtMoney } from '@/utils';
import { FaFileLines, FaRepeat, FaReply, FaRoute } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

type TourGuideSidebarProps = {
  guide: TourGuide;
};

export function TourGuideSidebar({ guide }: TourGuideSidebarProps) {
  const { t } = useTranslation();

  return (
    <Card
      id="contact"
      className="sticky top-28 overflow-hidden rounded-2xl border border-slate-200 p-6 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-bold text-gray-900">
        {t('tour_guide.contact_info')}
      </h3>
      {((guide.responseRate ?? 0) > 0 ||
        (guide.completedTripsCount ?? 0) > 0 ||
        (guide.returningCustomerRate ?? 0) > 0) && (
        <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="mb-3 text-sm font-semibold text-gray-700">
            {t('tour_guide.activity_stats')}
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            {guide.responseRate != null && guide.responseRate > 0 && (
              <li className="flex items-center gap-2">
                <FaReply className="h-4 w-4 shrink-0 text-sky-500" />
                <span>
                  {t('tour_guide.response_rate')}:{' '}
                  <strong className="text-gray-900">{guide.responseRate}%</strong>
                </span>
              </li>
            )}
            {guide.completedTripsCount != null && guide.completedTripsCount > 0 && (
              <li className="flex items-center gap-2">
                <FaRoute className="h-4 w-4 shrink-0 text-violet-500" />
                <span>
                  {t('tour_guide.completed_trips')}:{' '}
                  <strong className="text-gray-900">
                    {guide.completedTripsCount}
                  </strong>
                </span>
              </li>
            )}
            {guide.returningCustomerRate != null &&
              guide.returningCustomerRate > 0 && (
                <li className="flex items-center gap-2">
                  <FaRepeat className="h-4 w-4 shrink-0 text-teal-500" />
                  <span>
                    {t('tour_guide.returning_customers')}:{' '}
                    <strong className="text-gray-900">
                      {guide.returningCustomerRate}%
                    </strong>
                  </span>
                </li>
              )}
          </ul>
        </div>
      )}
      {guide.dailyRate != null && guide.dailyRate > 0 && (
        <div className="mb-5">
          <p className="text-sm text-gray-500">{t('tour_guide.daily_rate')}</p>
          <p className="text-2xl font-bold text-primary">
            {fmtMoney(guide.dailyRate, guide.currency)}
          </p>
          <p className="text-xs text-gray-400">/ {t('tour_guide.per_day')}</p>
        </div>
      )}
      {guide.contactMethods?.length > 0 && (
        <div className="mb-5">
          <p className="mb-2 text-sm text-gray-500">{t('tour_guide.contact_via')}</p>
          <div className="flex flex-wrap gap-2">
            {guide.contactMethods.map((method) => (
              <Badge
                key={method}
                variant="secondary"
                className="bg-slate-100 px-3 py-1.5 capitalize"
              >
                {method}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {guide.cv?.url && (
        <a
          href={guide.cv.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-5 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <FaFileLines className="h-4 w-4" />
          {t('tour_guide.download_cv')}
        </a>
      )}
      <Button className="w-full" size="lg" disabled={!guide.isAvailable}>
        {t('tour_guide.contact_guide')}
      </Button>
    </Card>
  );
}
