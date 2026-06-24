import { PhoneCall, Home, ShoppingBag, ShoppingCart, CreditCard, User } from 'lucide-react';
import { useCart } from '../CartContext';

export default function MobileNav() {
  const { cart, setIsCartOpen } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Contact Banner above mobile nav */}
      <div className="md:hidden bg-gradient-to-r from-[#C8A951] to-[#b89741] p-4 flex items-center justify-between mb-[72px]">
        <div className="flex items-center gap-3 text-black">
          <PhoneCall className="w-6 h-6" />
          <div>
            <div className="font-bold">Need Help?</div>
            <div className="text-sm font-medium">Talk to our expert</div>
          </div>
        </div>
        <a href="tel:09028813221" className="bg-black text-white text-sm font-bold px-4 py-2 rounded">
          CONTACT US
        </a>
      </div>

      {/* Desktop Contact Banner */}
      <div className="container mx-auto px-6">
        <div className="hidden md:flex bg-gradient-to-r from-[#C8A951] to-[#b89741] p-8 items-center justify-between rounded-2xl -translate-y-1/2 relative z-20">
          <div className="flex items-center gap-6 text-black">
          <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center">
            <PhoneCall className="w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-bold">Need Help?</div>
            <div className="text-lg font-medium">Talk to our expert</div>
          </div>
        </div>
        <a href="tel:09028813221" className="bg-black text-white font-bold px-8 py-4 rounded-lg hover:bg-gray-900 transition-colors">
          CONTACT US
        </a>
        </div>
      </div>

      {/* Sticky Bottom Nav for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-gray-800 z-40 flex justify-around items-center h-[72px] pb-safe">
        <a href="#" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-[var(--color-matic-gold)] transition-colors">
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-medium">Home</span>
        </a>
        <a href="#shop" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-[var(--color-matic-gold)] transition-colors">
          <ShoppingBag className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-medium">Shop</span>
        </a>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-[var(--color-matic-gold)] transition-colors relative"
        >
          <ShoppingCart className="w-5 h-5 mb-1" />
          {cartItemCount > 0 && (
            <span className="absolute top-2 right-[20%] w-4 h-4 bg-[var(--color-matic-gold)] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
          <span className="text-[10px] uppercase font-medium">Cart</span>
        </button>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-[var(--color-matic-gold)] transition-colors"
        >
          <CreditCard className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-medium">Checkout</span>
        </button>
      </div>
    </>
  );
}
