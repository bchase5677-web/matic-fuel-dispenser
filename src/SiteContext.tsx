import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, doc, onSnapshot } from './firebase';

interface SiteConfig {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  logoUrl?: string;
  heroImageUrl?: string;
  productsImageUrl?: string;
}

interface SiteContextType {
  config: SiteConfig | null;
  refreshConfig: () => void;
}

const SiteContext = createContext<SiteContextType>({ config: null, refreshConfig: () => {} });

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  const fetchConfig = () => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (!config) setConfig(data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchConfig();
    
    // Listen to Firebase for realtime updates
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig(prev => ({ ...prev, ...docSnap.data() as SiteConfig }));
      }
    }, (error) => {
      console.error("Error listening to config:", error);
    });

    return () => unsub();
  }, []);

  return (
    <SiteContext.Provider value={{ config, refreshConfig: fetchConfig }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteContext);
}
