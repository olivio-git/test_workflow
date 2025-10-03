import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { TooltipProvider } from './components/atoms/tooltip.tsx';
import './index.css';
import Navigation from './navigation/Navigation.tsx';
// import { Toaster as Sonner } from "./components/atoms/sonner.tsx";
import '@/config/zodI18nConfig.ts';
import { HotkeysProvider } from 'react-hotkeys-hook';
import { Toaster } from './components/atoms/toaster.tsx';
import { KeybindingProvider } from './contexts/KeybindingContext.tsx';
import { WebSocketProvider } from './contexts/WebSocketContext.tsx';
import { queryClient } from './lib/reactQueryConfig.ts';

// Prevenir F5 y Ctrl+R SOLO en Tauri (no afecta desarrollo web)
if (typeof window !== 'undefined' && '__TAURI__' in window) {
  document.addEventListener('keydown', (e) => {
    // F5 o Ctrl+R
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
      e.preventDefault();
      console.warn('Recarga del navegador deshabilitada en Tauri');
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <WebSocketProvider>
      <QueryClientProvider client={queryClient}>
        <HotkeysProvider initiallyActiveScopes={['default', 'esc-key']}>
          <TooltipProvider>
            <Toaster />
            {/* <Sonner /> */}
    <KeybindingProvider>
            <BrowserRouter>
              {/* <SidebarProvider> */}
              <Navigation />
              {/* </SidebarProvider> */}
            </BrowserRouter>
    </KeybindingProvider>
          </TooltipProvider>
        </HotkeysProvider>
      </QueryClientProvider>
  </WebSocketProvider>
);
