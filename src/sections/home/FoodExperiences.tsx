import { foodExperiences, type FoodCategory } from '@/mock';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/router';
import { cn } from '@/lib/utils';
import { SectionReveal } from './SectionReveal';

const formatVnd = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(
    n,
  );

const categoryClass: Record<FoodCategory, string> = {
  street: 'bg-primary/90 text-primary-foreground',
  signature: 'bg-sapa-green/90 text-white',
  hidden: 'bg-hoi-an-gold/90 text-[#1c1a14]',
};

export const FoodExperiences = () => {
  const { t } = useTranslation();

  return (
    <SectionReveal>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 text-center md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-sapa-green">
            {t('home_page.food_badge')}
          </p>
          <h2 className="mt-2 font-dm-serif-display text-3xl font-bold text-foreground md:text-4xl">
            {t('home_page.food_title')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
            {t('home_page.food_subtitle')}
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {foodExperiences.map((item) => (
            <li key={item.id}>
              <Link
                to={`${ROUTES.FOOD.INDEX}?focus=${item.id}`}
                className={cn(
                  'group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/50',
                  'bg-surface-100 transition-all duration-300',
                  'hover:-translate-y-0.5 hover:border-border hover:shadow-[var(--shadow-elevated)]',
                )}
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span
                    className={cn(
                      'absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
                      categoryClass[item.category],
                    )}
                  >
                    {t(`home_page.food_cat_${item.category}`)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4 md:p-5">
                  <h3 className="font-dm-serif-display text-xl font-bold text-foreground">{item.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3">
                    <span className="text-xs font-medium text-muted-foreground">{item.city}</span>
                    <span className="text-sm font-semibold text-foreground">{formatVnd(item.priceVnd)}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <Link
            to={ROUTES.FOOD.INDEX}
            className="cursor-pointer rounded-full border-2 border-foreground/15 bg-transparent px-6 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
          >
            {t('home_page.see_all_food')}
          </Link>
        </div>
      </div>
    </SectionReveal>
  );
};
