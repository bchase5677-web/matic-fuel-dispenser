import { useState } from 'react';
import { Fuel, Menu, ShoppingCart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteConfig } from '../SiteContext';
import { useCart } from '../CartContext';

export default function Header() {
  const { config } = useSiteConfig();
  const { cart, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-40 bg-transparent">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="text-[var(--color-matic-gold)]">
              <Fuel className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div>
              <div className="text-white font-bold text-xl md:text-2xl tracking-widest leading-none uppercase">{config?.name || 'Matic Fueltec'}</div>
              <div className="text-[var(--color-matic-gold)] text-[10px] md:text-xs uppercase font-medium tracking-[0.3em] mt-1">Fueling Excellence</div>
            </div>
          </a>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-[var(--color-matic-gold)] transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6 md:w-8 md:h-8" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-matic-gold)] text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-white hover:text-[var(--color-matic-gold)] transition-colors"
            >
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col"
          >
            <div className="container mx-auto px-6 h-24 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-[var(--color-matic-gold)]">
                  <Fuel className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div>
                  <div className="text-white font-bold text-xl md:text-2xl tracking-widest leading-none uppercase">{config?.name || 'Matic Fueltec'}</div>
                </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-[var(--color-matic-gold)] transition-colors p-2"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col justify-center px-12 py-8 space-y-8">
              <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-4xl font-bold text-white hover:text-[var(--color-matic-gold)] transition-colors uppercase tracking-widest">Home</a>
              <a href="#products" onClick={() => setIsMenuOpen(false)} className="text-4xl font-bold text-white hover:text-[var(--color-matic-gold)] transition-colors uppercase tracking-widest">Shop</a>
              <a href="#admin" onClick={() => setIsMenuOpen(false)} className="text-4xl font-bold text-white hover:text-[var(--color-matic-gold)] transition-colors uppercase tracking-widest">Admin</a>
            </nav>
            
            <div className="p-12 border-t border-white/10">
              <div className="text-gray-500 uppercase tracking-widest text-sm mb-4">Contact</div>
              <a href={`mailto:${config?.email || 'Maticlimited@gmail.com'}`} className="block text-xl text-white hover:text-[var(--color-matic-gold)] transition-colors mb-2">
                {config?.email || 'Maticlimited@gmail.com'}
              </a>
              <a href={`tel:${config?.phone || '09028813221'}`} className="block text-xl text-white hover:text-[var(--color-matic-gold)] transition-colors">
                {config?.phone || '09028813221'}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
