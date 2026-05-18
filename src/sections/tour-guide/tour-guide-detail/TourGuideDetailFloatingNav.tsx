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

  stickyTopClassName?: string;
};

export function TourGuideDetailFloatingNav({
  visible,
  items,
  stickyTopClassName,
}: TourGuideDetailFloatingNavProps) {
  const { t } = useTranslation();

  return (
    <FloatingSectionNav
      visible={visible}
      items={items}
      ariaLabel={t('tour_guide.detail.nav_aria')}
      onNavigate={scrollToSectionAnchor}
      stickyTopClassName={
        stickyTopClassName ?? 'top-[4.5rem] md:top-[5.5rem]'
      }
      navClassName="bg-sand-50/85"
      buttonsRowClassName="max-h-[44vh] px-2 md:gap-2"
      buttonClassName="md:px-3 md:text-[10px]"
    />
  );
}

