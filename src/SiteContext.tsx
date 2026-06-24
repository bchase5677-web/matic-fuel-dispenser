import React, { createContext, useContext, useState, useEffect } from 'react';

interface SiteConfig {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
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
      .then(setConfig)
      .catch(console.error);
  };

  useEffect(() => {
    fetchConfig();
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
