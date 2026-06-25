import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SiteProvider } from './SiteContext';
import { CartProvider } from './CartContext';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

window.addEventListener('error', (event) => {
  if (event.message === 'Script error.' || event.message.includes('Script error')) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message === 'Script error.') {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </SiteProvider>
  </StrictMode>,
);

