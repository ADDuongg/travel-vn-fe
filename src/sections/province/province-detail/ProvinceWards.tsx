import type { CSSProperties } from 'react';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Reveal, RevealItem, Stagger } from '@/components/home-editorial/Reveal';
import { useLanguage } from '@/hooks/useLanguage';
import type { ProvinceDetail } from '@/features/provinces/types';
import { pickLocale } from '@/features/provinces/locale';
import { AtlasPagination } from '@/shared/pagination/AtlasPagination';
import { scrollToProvinceDetailSection } from './provinceDetailScroll';

interface ProvinceWardsProps {
  province: ProvinceDetail;
}

const PIN_SHOWN = 3;
/** Same page size as province atlas list for consistent atlas/folio rhythm */
const WARDS_PAGE_SIZE = 9;

function pinStyle(index: number, total: number): CSSProperties {
  if (total <= 1) {
    return { left: '50%', top: '44%', transform: 'translateX(-50%)' };
  }
  if (total === 2) {
    return index === 0
      ? { left: '30%', top: '42%' }
      : { left: '70%', top: '50%', transform: 'translateX(-50%)' };
  }
  return {
    insetInlineStart: `${28 + index * 22}%`,
    insetBlockStart: `${40 + index * 8}%`,
  };
}

export function ProvinceWards({ province }: ProvinceWardsProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const wards = province.wards ?? [];
  const name = pickLocale(province.name, language) ?? province.slug;
  const pinWards = wards.slice(0, PIN_SHOWN);
  const total = wards.length;
  const showPinNote = total > PIN_SHOWN;
  const totalPages = Math.max(1, Math.ceil(total / WARDS_PAGE_SIZE));

  const [page, setPage] = useState(1);
  const [scrollTargetSlug, setScrollTargetSlug] = useState<string | null>(null);

  const safePage = Math.min(Math.max(page, 1), totalPages);

  useEffect(() => {
    setPage(1);
  }, [province._id]);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const paginatedWards = useMemo(() => {
    const start = (safePage - 1) * WARDS_PAGE_SIZE;
    return wards.slice(start, start + WARDS_PAGE_SIZE);
  }, [wards, safePage]);

  const showingFrom = total > 0 ? (safePage - 1) * WARDS_PAGE_SIZE + 1 : 0;
  const showingTo = Math.min(safePage * WARDS_PAGE_SIZE, total);

  useLayoutEffect(() => {
    if (!scrollTargetSlug) return;
    scrollToProvinceDetailSection(`ward-${scrollTargetSlug}`);
    setScrollTargetSlug(null);
  }, [scrollTargetSlug, safePage]);

  const atlasPaginationLabels = useMemo(
    () => ({
      showingRange: t('province.detail.wards_pagination_showing', {
        from: showingFrom,
        to: showingTo,
        total,
      }),
      folioLabel: t('province.pagination.atlas_folio_prefix', 'Folio'),
      prevSpread: t('province.pagination.prev_spread', 'Previous spread'),
      nextSpread: t('province.pagination.next_spread', 'Next spread'),
      spreadNavLabel: t('province.detail.wards_spread_nav'),
    }),
    [showingFrom, showingTo, t, total],
  );

  const handlePinClick = (wardSlug: string, globalIndex: number) => {
    const targetPage = Math.floor(globalIndex / WARDS_PAGE_SIZE) + 1;
    setScrollTargetSlug(wardSlug);
    if (targetPage !== safePage) {
      setPage(targetPage);
    }
  };

  if (wards.length === 0) {
    return (
      <section id="wards" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-16 md:px-10 md:py-20">
        <p className="max-w-2xl text-center text-base leading-relaxed text-mist md:text-lg">
          {t('province.detail.wards_empty')}
        </p>
      </section>
    );
  }

  return (
    <section id="wards" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-20 md:px-10 md:py-24">
      <Reveal className="mb-10 max-w-2xl space-y-3 md:mb-12">
        <p className="text-[11px] uppercase tracking-[0.32em] text-forest">
          {t('province.detail.wards_kicker')}
        </p>
        <h2 className="font-display text-4xl text-charcoal md:text-[2.75rem]">
          {t('province.detail.wards_title')}
        </h2>
        <p className="text-base leading-relaxed text-mist md:text-[1.05rem]">
          {t('province.detail.wards_lead', { count: total, province: name })}
        </p>
      </Reveal>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <Reveal className="w-full shrink-0 lg:max-w-[360px]">
          <div className="relative mx-auto flex aspect-[3/4] max-h-[380px] w-full max-w-[340px] items-center justify-center overflow-hidden rounded-[2rem] border border-charcoal/10 bg-sand-100 shadow-inner lg:mx-0 lg:max-h-[420px]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_35%,oklch(88%_0.02_85/0.5),transparent_55%)]" />
            <div className="absolute inset-[18%] rounded-[40%_60%_45%_55%] border border-charcoal/12 bg-charcoal/[0.04] blur-[0.5px]" />
            {pinWards.map((w, idx) => {
              const wardName = pickLocale(w.name, language) ?? w.slug;
              return (
                <motion.button
                  key={w.code}
                  type="button"
                  onClick={() => handlePinClick(w.slug, idx)}
                  className="absolute z-10 flex size-14 items-center justify-center rounded-full border border-charcoal/10 bg-sand-50/90 shadow-soft backdrop-blur-sm md:size-16"
                  style={pinStyle(idx, pinWards.length)}
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: 'spring', stiffness: 320 }}
                  aria-label={t('province.detail.ward_pin_label', { name: wardName })}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-forest">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </motion.button>
              );
            })}
            <div className="absolute bottom-4 left-4 right-4 space-y-2 text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-charcoal/45">
                {t('province.detail.wards_atlas_caption')}
              </p>
              {showPinNote ? (
                <p className="text-xs leading-snug text-charcoal/55">
                  {t('province.detail.wards_atlas_pins_note', {
                    shown: PIN_SHOWN,
                    total,
                  })}
                </p>
              ) : null}
            </div>
          </div>
        </Reveal>

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          {/* key remounts when page changes — Stagger uses whileInView once:true; without this,
              replaced ward cards stay at opacity 0 (hidden variant). */}
          <Stagger
            key={`wards-page-${safePage}`}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {paginatedWards.map((w, i) => {
              const wardName = pickLocale(w.name, language) ?? w.slug;
              const globalIndex = (safePage - 1) * WARDS_PAGE_SIZE + i;
              return (
                <RevealItem key={`${w.code}-${globalIndex}`}>
                  <article
                    id={`ward-${w.slug}`}
                    className="scroll-mt-36 flex h-full flex-col rounded-[1.25rem] border border-charcoal/10 bg-sand-50 p-5 shadow-soft md:p-6"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-forest">
                      {t('province.detail.ward_vignette_label', {
                        index: String(globalIndex + 1).padStart(2, '0'),
                      })}
                    </p>
                    <h3 className="mt-3 font-display text-xl leading-snug text-charcoal md:text-2xl">
                      {wardName}
                    </h3>
                  </article>
                </RevealItem>
              );
            })}
          </Stagger>

          <AtlasPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            labels={atlasPaginationLabels}
            className="pt-2"
          />
        </div>
      </div>
    </section>
  );
}
