import Container from '@components/Container';
import { services } from '@/mock';
import React from 'react';
import { useTranslation } from 'react-i18next';

const serviceKeys = ['destinations', 'best_price', 'support'] as const;

export const OurService: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full">
      <Container>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {services.map((s, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-8 text-center shadow-sm sm:px-8 sm:py-10"
            >
              <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10 sm:size-[4.5rem]">
                <img
                  src={s.icon}
                  alt=""
                  className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                  loading="lazy"
                />
              </div>
              <h3 className="mb-2 text-pretty font-dm-serif-display text-xl font-bold leading-snug text-foreground sm:text-2xl">
                {t(`services.${serviceKeys[idx]}_title`)}
              </h3>
              <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t(`services.${serviceKeys[idx]}_desc`)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
