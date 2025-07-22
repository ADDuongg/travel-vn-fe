import React from 'react';

const Container = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="max-w-[1400px] px-4 md:px-8 lg:px-16 mx-auto">
      {children}
    </div>
  );
};

export default Container;
