// layout/MainLayout.tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Container from '../components/Container';
import { ResponsiveH1, ResponsiveH6 } from '@components/ui/typography';
import { ChatBotWidget } from '@components/chatbot';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col ">
      <div className="flex-1 flex flex-col justify-between">
        <Header />
        <div className="pt-[136px]">{children}</div>
        <Footer />
      </div>
      <ChatBotWidget />
    </div>
  );
};

export default MainLayout;
