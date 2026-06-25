import { motion } from 'motion/react';
import { Fuel, ArrowUp } from 'lucide-react';
import { useSiteConfig } from '../SiteContext';

export default function Footer() {
  const { config } = useSiteConfig();

  const stats = [
    { value: "10+", label: "Years of\nExcellence" },
    { value: "500+", label: "Installations\nWorldwide" },
    { value: "30+", label: "Countries\nServed" },
    { value: "100%", label: "Customer\nSatisfaction" },
  ];

  return (
    <footer className="bg-[var(--color-matic-dark)] pb-24 md:pb-12 pt-12 border-t border-gray-900">
      <div className="container mx-auto px-6">
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 text-center">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-matic-gold)] mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400 whitespace-pre-line">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Logo and About */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <a href="#" className="flex items-center gap-3 mb-6">
            {config?.logoUrl ? (
              <img src={config.logoUrl} alt={config?.name || 'Matic Fueltec'} className="h-12 object-contain" />
            ) : (
              <>
                <div className="text-[var(--color-matic-gold)]">
                  <Fuel className="w-10 h-10" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-2xl tracking-widest leading-none uppercase">{config?.name || 'Matic Fueltec'}</div>
                  <div className="text-[var(--color-matic-gold)] text-xs uppercase font-medium tracking-[0.3em] mt-1">Fueling Excellence</div>
                </div>
              </>
            )}
          </a>
          <p className="text-gray-400 font-light mb-8">
            Premium fuel dispensers designed for performance, reliability and luxury.
          </p>
          <div className="flex items-center justify-center gap-4">
            {/* Social Icons Placeholders */}
            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[var(--color-matic-gold)] hover:border-[var(--color-matic-gold)] transition-colors">in</a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[var(--color-matic-gold)] hover:border-[var(--color-matic-gold)] transition-colors">f</a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[var(--color-matic-gold)] hover:border-[var(--color-matic-gold)] transition-colors">ig</a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[var(--color-matic-gold)] hover:border-[var(--color-matic-gold)] transition-colors">yt</a>
          </div>
        </div>

        {/* Links & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-900 pt-8 gap-6">
          <ul className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <li><a href="#" className="hover:text-[var(--color-matic-gold)] transition-colors">Home</a></li>
            <li><a href="#products" className="hover:text-[var(--color-matic-gold)] transition-colors">Products</a></li>
            <li><a href="#about" className="hover:text-[var(--color-matic-gold)] transition-colors">About Us</a></li>
            <li><a href="#projects" className="hover:text-[var(--color-matic-gold)] transition-colors">Projects</a></li>
            <li><a href="#contact" className="hover:text-[var(--color-matic-gold)] transition-colors">Contact</a></li>
          </ul>
          <p className="text-sm text-gray-500 text-center md:text-right">
            © {new Date().getFullYear()} {config?.name || 'MATIC FUELTEC'}. All Rights Reserved.
          </p>
        </div>
      </div>
      
      {/* Scroll to Top */}
      <button 
        onClick={() => window.scrollTo(0,0)}
        className="absolute bottom-8 right-8 w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[var(--color-matic-gold)] hover:border-[var(--color-matic-gold)] transition-colors hidden md:flex"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
