import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import AppRouter from './AppRouter.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';
import './i18n.ts';
import './index.css';
import { StrictMode } from 'react';
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      {/* <AuthProvider> */}
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <Toaster richColors position="top-right" closeButton />
      </QueryClientProvider>
      {/* </AuthProvider> */}
      {/* <App /> */}
    </ThemeProvider>
    , //{' '}
  </StrictMode>,
);
