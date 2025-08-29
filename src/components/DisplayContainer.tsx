import { EnumDisplayItem } from '@/constants/commons';
import clsx from 'clsx';

interface DisplayContainerProps {
  displayType: EnumDisplayItem;
  children: React.ReactNode;
  gridClassName?: string;
  flexClassName?: string;
  className?: string;
}

const DisplayContainer = ({
  displayType,
  children,
  gridClassName = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
  flexClassName = 'flex-col gap-6',
  className = '',
}: DisplayContainerProps) => {
  return (
    <div
      className={clsx(
        className,
        displayType === EnumDisplayItem.GRID
          ? clsx('grid', gridClassName)
          : clsx('flex', flexClassName),
      )}
    >
      {children}
    </div>
  );
};

export default DisplayContainer;
