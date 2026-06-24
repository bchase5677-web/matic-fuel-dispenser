import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SiteProvider } from './SiteContext';
import { CartProvider } from './CartContext';

window.addEventListener('error', (event) => {
  if (event.message === 'Script error.') {
    event.preventDefault();
    event.stopPropagation();
    return;
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

