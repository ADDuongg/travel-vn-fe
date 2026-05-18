import { ChatBotWidget } from '@components/chatbot';
import React from 'react';
import Footer from './Footer';
import Header from './Header';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 flex-col justify-between">
        <Header />
        <div>{children}</div>
        <Footer />
      </div>
      <ChatBotWidget />
    </div>
  );
};

export default MainLayout;

