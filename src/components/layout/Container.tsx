import React from 'react';

const Container = ({ children }: React.PropsWithChildren) => {
  return <div className="container mx-auto">{children}</div>;
};

export default Container;
