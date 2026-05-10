import { useTranslation } from 'react-i18next';
import {
  FloatingSectionNav,
  type FloatingSectionNavItem,
} from '@/components/home-editorial/FloatingSectionNav';
import { scrollToSectionAnchor } from '@/lib/scrollToSectionAnchor';

export type TourGuideDetailNavItem = FloatingSectionNavItem;

type TourGuideDetailFloatingNavProps = {
  visible: boolean;
  items: TourGuideDetailNavItem[];
};

export function TourGuideDetailFloatingNav({
  visible,
  items,
}: TourGuideDetailFloatingNavProps) {
  const { t } = useTranslation();

  return (
    <FloatingSectionNav
      visible={visible}
      items={items}
      ariaLabel={t('tour_guide.detail.nav_aria')}
      onNavigate={scrollToSectionAnchor}
      navClassName="bg-sand-50/82"
      buttonsRowClassName="max-h-[52vh] px-2 md:gap-1.5"
      buttonClassName="sm:text-[10px]"
    />
  );
}
