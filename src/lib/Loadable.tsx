import { LoadingScreen } from '@components/LoadingScreen';
import {
  Suspense,
  lazy,
  type ComponentType,
  type JSX,
  type LazyExoticComponent,
} from 'react';

type ImportFunc<T extends ComponentType<any>> = () => Promise<{
  default: T;
}>;

function Loadable<T extends ComponentType<any>>(
  importFunc: ImportFunc<T>,
  loadingComponent = <LoadingScreen />,
): (props: React.ComponentProps<T>) => JSX.Element {
  const LazyComp: LazyExoticComponent<T> = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={loadingComponent}>
      <LazyComp {...props} />
    </Suspense>
  );
}

export default Loadable;
