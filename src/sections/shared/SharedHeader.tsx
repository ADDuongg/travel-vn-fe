import React from 'react';
import { Ratings } from '@components/ui/rating';
import { ResponsiveH1 } from '@components/ui/typography';

interface DetailItem {
  icon: React.ReactNode;
  value: React.ReactNode;
}

interface SharedHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  rating?: number;
  reviewCount?: number;
  details?: DetailItem[];
  GalleryComponent?: React.ReactNode;
  ActionsComponent?: React.ReactNode;
}

const SharedHeader: React.FC<SharedHeaderProps> = ({
  title,
  subtitle,
  rating,
  reviewCount,
  details = [],
  GalleryComponent,
  ActionsComponent,
}) => {
  return (
    <section className="mt-20">
      <div className="grid gap-5 mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <ResponsiveH1 className="font-dm-serif-display">{title}</ResponsiveH1>
          {ActionsComponent && (
            <div className="flex shrink-0 items-center gap-2">
              {ActionsComponent}
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        )}
        {(rating || reviewCount) && (
          <div className="flex items-center gap-2 mb-1">
            {rating && (
              <Ratings
                rating={rating}
                variant="yellow"
                totalStars={5}
                readOnly
                size={12}
              />
            )}
            {reviewCount !== undefined && (
              <span className="text-gray-400 text-xs">
                {reviewCount} Review{reviewCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {details.length > 0 && (
          <div className="flex flex-wrap sm:flex-row flex-col gap-5 lg:gap-20 text-sm text-muted-foreground">
            {details.map((item, index) => (
              <div key={index} className="flex items-center gap-2 min-w-[50px]">
                {item.icon}
                {item.value}
              </div>
            ))}
          </div>
        )}
      </div>

      {GalleryComponent}
    </section>
  );
};

export default SharedHeader;
