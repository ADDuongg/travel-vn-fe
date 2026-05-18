import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/home-editorial/Reveal';
import { useLanguage } from '@/hooks/useLanguage';
import type { ProvinceDetail } from '@/features/provinces/types';
import { langKey } from '@/utils/addressOptions';
import { splitStoryParagraphs } from './provinceDetailStory';

type ProvinceStorySectionProps = {
  province: ProvinceDetail;
};

export function ProvinceStorySection({ province }: ProvinceStorySectionProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = langKey(language);
  const rawDescription =
    province.translations?.[lang]?.description ??
    province.translations?.vi?.description ??
    province.translations?.en?.description ??
    '';
  const description =
    rawDescription.trim() ||
    t('province.default_description', 'Explore this beautiful province of Vietnam.');
  const { paraA, paraB } = splitStoryParagraphs(description);

  return (
    <section id="story" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-20 md:px-10 md:py-24">
      <Reveal className="mb-12 max-w-xl space-y-3">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
          {t('province.detail.story_kicker')}
        </p>
        <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
          {t('province.detail.story_title')}
        </h2>
      </Reveal>
      <div
        className={`grid gap-12 ${paraB.trim() ? 'lg:grid-cols-2 lg:gap-16' : 'max-w-[58ch]'}`}
      >
        <Reveal>
          <p className="text-lg leading-[1.75] text-mist">{paraA}</p>
        </Reveal>
        {paraB.trim() ? (
          <Reveal delay={0.08}>
            <p className="text-lg leading-[1.75] text-mist">{paraB}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

