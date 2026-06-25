import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
    } catch (error) {
      console.error('PWA prompt error:', error);
    } finally {
      setDeferredPrompt(null);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-[var(--color-matic-gold)] text-black px-4 py-3 flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center font-bold text-[var(--color-matic-gold)]">
              M
            </div>
            <div>
              <h4 className="font-extrabold text-sm uppercase tracking-wider">Matic.Co</h4>
              <p className="text-xs opacity-80 font-medium">Install app for a better experience</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleInstallClick}
              className="bg-black text-[var(--color-matic-gold)] px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-black/60 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
