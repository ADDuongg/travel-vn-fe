import { useTranslation } from 'react-i18next';
import {
  FloatingSectionNav,
  type FloatingSectionNavItem,
} from '@/components/home-editorial/FloatingSectionNav';
import { scrollToProvinceDetailSection } from './provinceDetailScroll';

export type ProvinceDetailNavItem = FloatingSectionNavItem;

type ProvinceDetailFloatingNavProps = {
  visible: boolean;
  items: ProvinceDetailNavItem[];
};

export function ProvinceDetailFloatingNav({
  visible,
  items,
}: ProvinceDetailFloatingNavProps) {
  const { t } = useTranslation();

  return (
    <FloatingSectionNav
      visible={visible}
      items={items}
      ariaLabel={t('province.detail.nav_aria')}
      onNavigate={scrollToProvinceDetailSection}
      navClassName="bg-sand-50/82"
      buttonsRowClassName="max-h-[52vh] px-2 md:gap-1.5"
      buttonClassName="sm:text-[10px]"
    />
  );
}
