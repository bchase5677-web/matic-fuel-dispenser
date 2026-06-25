/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProductsSection from './components/ProductsSection';
import ShopSection from './components/ShopSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import MobileNav from './components/MobileNav';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import CartDrawer from './components/CartDrawer';
import InstallPwaBanner from './components/InstallPwaBanner';
import { io } from 'socket.io-client';

export default function App() {
  const [route, setRoute] = useState('#home');

  useEffect(() => {
    // Force home on initial load
    if (window.location.hash !== '#home' && window.location.hash !== '') {
      window.location.hash = '#home';
    }

    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      setRoute(hash);
      
      setTimeout(() => {
        const el = document.getElementById(hash.replace('#', ''));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial scroll on load
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.getElementById(window.location.hash.replace('#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    try {
      const s = io();
      s.emit('page_view', route.replace('#', '') || 'home');
      return () => { s.disconnect(); };
    } catch (e) {
      // Ignore socket errors
    }
  }, [route]);

  if (route === '#login') {
    return (
      <div className="font-sans antialiased text-white bg-[var(--color-matic-dark)] min-h-screen selection:bg-[var(--color-matic-gold)]/30 selection:text-[var(--color-matic-gold)]">
        <Login />
      </div>
    );
  }

  if (route === '#admin') {
    return (
      <div className="font-sans antialiased text-white bg-[var(--color-matic-dark)] min-h-screen selection:bg-[var(--color-matic-gold)]/30 selection:text-[var(--color-matic-gold)]">
        <AdminPanel />
        <AIAssistant />
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-white bg-[var(--color-matic-dark)] min-h-screen selection:bg-[var(--color-matic-gold)]/30 selection:text-[var(--color-matic-gold)]" id="home">
      <InstallPwaBanner />
      <Header />
      <main>
        {route === '#shop' ? (
          <div className="pt-24">
            <ShopSection />
          </div>
        ) : (
          <>
            <HeroSection />
            <AboutSection />
            <ProductsSection />
            <ServicesSection />
            <ProjectsSection />
            <ContactSection />
          </>
        )}
        <MobileNav />
      </main>
      <Footer />
      <CartDrawer />
      <AIAssistant />
    </div>
  );
}

