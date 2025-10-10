import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n.ts';
import App from './App.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';
import AppRouter from './AppRouter.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
      {/* <App /> */}
    </ThemeProvider>
  </StrictMode>,
);
