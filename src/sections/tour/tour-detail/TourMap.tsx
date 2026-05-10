import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';

type TourMapProps = {
  /** When true, omit outer section + id (parent supplies scroll target). */
  embedded?: boolean;
  omitHeading?: boolean;
};

const TourMap: React.FC<TourMapProps> = ({ embedded, omitHeading }) => {
  const { t } = useTranslation();
  const inner = (
      <Card className="overflow-hidden border border-[rgba(28,26,20,0.1)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        {!omitHeading ? (
          <h2
            className="mb-4 font-['Playfair_Display',serif] text-2xl font-bold text-[#1c1a14]"
            style={{ fontFamily: 'var(--font-dm-serif-display, Georgia, serif)' }}
          >
            {t('tour.detail.map_title', 'Journey route')}
          </h2>
        ) : null}
        <div className="overflow-hidden rounded-xl border border-[rgba(28,26,20,0.1)] bg-[#faf7f2] shadow-inner">
          <iframe
            src="https://www.google.com/maps/d/embed?mid=xxxx"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title={t('tour.detail.map_iframe_title', 'Journey route map')}
            className="min-h-[280px] w-full sm:min-h-[400px]"
          />
        </div>
      </Card>
  );

  if (embedded) {
    return inner;
  }

  return (
    <section id="map" className="scroll-mt-40">
      {inner}
    </section>
  );
};

export default TourMap;
