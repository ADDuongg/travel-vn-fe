import Container from '@components/Container';
import { services } from '@/mock';
import React from 'react';
import { useTranslation } from 'react-i18next';

const serviceKeys = ['destinations', 'best_price', 'support'] as const;

export const OurService: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full py-12 bg-white">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {services.map((s, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-center gap-4 md:gap-6"
            >
              <img
                src={s.icon}
                alt={t(`services.${serviceKeys[idx]}_title`)}
                className="w-16 h-16 object-contain mb-2 md:mb-0"
              />
              <div>
                <h3 className="font-dm-serif-display text-lg md:text-xl font-bold text-gray-900 mb-2">
                  {t(`services.${serviceKeys[idx]}_title`)}
                </h3>
                <p className="text-gray-500 text-base md:text-[17px] leading-relaxed">
                  {t(`services.${serviceKeys[idx]}_desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
