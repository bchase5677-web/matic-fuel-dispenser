import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingCart, Trash2, Loader2, Check } from 'lucide-react';
import { useCart } from '../CartContext';
import { db, collection, addDoc } from '../firebase';
import { useSiteConfig } from '../SiteContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();
  const { config } = useSiteConfig();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '' });
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  const total = cart.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);

  const handleCheckout = async () => {
    if (!customerInfo.name) {
      return alert('Please enter your name.');
    }
    
    setIsCheckingOut(true);
    try {
      const orderData = {
        customerName: customerInfo.name,
        items: cart,
        total: total,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      // Also save/update customer
      await addDoc(collection(db, 'customers'), {
        name: customerInfo.name,
        totalOrders: 1,
        totalSpent: total,
        createdAt: new Date().toISOString()
      });

      // Prepare WhatsApp message
      let msg = `Hello Matic Fueltec, I would like to place an order.\n\n*Customer:* ${customerInfo.name}\n*Order Summary:*\n`;
      cart.forEach(item => {
        msg += `- ${item.quantity}x ${item.name} (₦${Number(item.price || 0).toLocaleString()})\n`;
      });
      msg += `\n*Total:* ₦${total.toLocaleString()}`;

      const whatsappNumber = config?.whatsapp?.replace(/[^0-9]/g, '') || '09028813221';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');

      clearCart();
      setStep('success');
    } catch (err) {
      console.error(err);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const resetAndClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setStep('cart');
      setCustomerInfo({ name: '' });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--color-matic-dark)] border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-[var(--color-matic-gold)]" />
                <h2 className="text-xl font-bold">
                  {step === 'checkout' ? 'Checkout' : step === 'success' ? 'Order Confirmed' : 'Your Cart'}
                </h2>
                {step === 'cart' && (
                  <span className="bg-[var(--color-matic-gold)] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={resetAndClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {step === 'success' ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Thank You!</h3>
                  <p className="text-gray-400">Your order has been placed successfully. We will contact you shortly.</p>
                  <button 
                    onClick={resetAndClose}
                    className="mt-8 bg-[var(--color-matic-gold)] text-black font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : step === 'checkout' ? (
                <div className="space-y-6">
                  <div className="bg-[#141414] p-4 rounded-xl border border-white/5 space-y-4 mb-8">
                    <h3 className="font-bold text-white border-b border-white/5 pb-2">Contact Information</h3>
                    <input type="text" placeholder="Full Name" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full bg-[#0F0F0F] border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-matic-gold)]" />
                  </div>
                  
                  <div className="bg-[#141414] p-4 rounded-xl border border-white/5">
                    <h3 className="font-bold text-white mb-4">Order Summary</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-400">{item.quantity}x {item.name}</span>
                          <span className="text-white">₦{(Number(item.price) * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t border-white/5">
                      <span className="text-white font-bold">Total</span>
                      <span className="font-bold text-[var(--color-matic-gold)]">₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50 space-y-4">
                  <ShoppingCart className="w-16 h-16 opacity-20" />
                  <p>Your cart is empty.</p>
                  <button 
                    onClick={resetAndClose}
                    className="text-[var(--color-matic-gold)] hover:underline mt-2 font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="w-20 h-20 bg-black/30 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingCart className="w-8 h-8 text-white/20" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold line-clamp-2 leading-tight">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-white/40 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-end justify-between mt-2">
                          <div className="text-[var(--color-matic-gold)] font-bold">
                            ₦{Number(item.price || 0).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && step !== 'success' && (
              <div className="p-6 border-t border-white/10 bg-black/20 space-y-4">
                {step === 'cart' ? (
                  <>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-white/60 font-medium">Subtotal</span>
                      <span className="font-bold text-2xl">₦{total.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => setStep('checkout')}
                      className="w-full py-4 bg-[var(--color-matic-gold)] text-black font-bold rounded-xl hover:bg-[#D4AF37]/90 active:scale-[0.98] transition-all"
                    >
                      PROCEED TO CHECKOUT
                    </button>
                  </>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep('cart')}
                      className="py-4 px-6 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                    >
                      BACK
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="flex-1 py-4 bg-[var(--color-matic-gold)] text-black font-bold rounded-xl hover:bg-[#D4AF37]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : 'PLACE ORDER'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
