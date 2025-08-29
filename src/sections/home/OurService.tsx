import Container from '@components/Container';
import { services } from '@/mock';
import React from 'react';

export const OurService: React.FC = () => (
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
              alt={s.title}
              className="w-16 h-16 object-contain mb-2 md:mb-0"
            />
            <div>
              <h3 className="font-dm-serif-display text-lg md:text-xl font-bold text-gray-900 mb-2">
                {s.title}
              </h3>
              <p className="text-gray-500 text-base md:text-[17px] leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
