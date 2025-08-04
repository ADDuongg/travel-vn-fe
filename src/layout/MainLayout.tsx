// layout/MainLayout.tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Container from './Container';
import { ResponsiveH1, ResponsiveH6 } from '@components/ui/typography';
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col ">
      <div className="flex-1">
        <Header />
        <div className="lg:pt-[156px] pt-[136px]">{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
