import { cn } from '@lib/utils';
import React from 'react';

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

const Container: React.FC<ContainerProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div
      className={cn(`max-w-[1400px] px-8 lg:px-16 mx-auto`, className)}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Container;
