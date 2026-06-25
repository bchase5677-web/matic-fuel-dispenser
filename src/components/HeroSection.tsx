import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Cpu, Droplet } from 'lucide-react';
import { useSiteConfig } from '../SiteContext';
import heroImage from '../assets/images/luxury_fuel_dispenser_1782231192519.jpg';

export default function HeroSection() {
  const { config } = useSiteConfig();
  
  return (
    <div className="relative min-h-screen flex items-center bg-[var(--color-matic-dark)] pt-24 pb-12 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          <div className="w-full lg:w-1/2 pt-10">
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Luxury Fuel<br />
              <span className="text-[var(--color-matic-gold)] italic font-medium pr-4">Dispensers</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <h2 className="text-xl md:text-2xl text-white font-medium mb-4">
                Engineered for Performance.<br />
                Designed for Prestige.
              </h2>
              <p className="text-gray-400 max-w-md font-light leading-relaxed mb-10">
                Premium fuel dispensing solutions for a superior experience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#shop" className="inline-flex items-center justify-center gap-3 bg-[var(--color-matic-gold)] text-black px-8 py-4 font-bold tracking-wide hover:bg-[var(--color-matic-gold-hover)] transition-colors">
                  SHOP NOW
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href={`whatsapp://send?phone=${config?.whatsapp?.replace(/[^0-9]/g, '') || ''}&text=Hello,%20I%20am%20reaching%20out%20to%20request%20a%20repair%20service%20for%20my%20fuel%20dispenser.%20Please%20let%20me%20know%20the%20next%20steps.`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white px-8 py-4 font-bold tracking-wide hover:bg-white/20 transition-colors"
                >
                  REQUEST REPAIR
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
                 <span>Account (Optional):</span>
                 <a href="#login" className="text-white hover:text-[var(--color-matic-gold)] transition-colors">Login</a>
                 <span className="text-gray-600">|</span>
                 <a href="#login" className="text-white hover:text-[var(--color-matic-gold)] transition-colors">Sign Up</a>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-3 gap-4 mt-16 max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <div className="bg-[var(--color-matic-card)] border border-gray-800 p-6 rounded-xl flex flex-col items-center justify-center text-center group hover:border-[var(--color-matic-gold)] transition-colors">
                <ShieldCheck className="w-8 h-8 text-[var(--color-matic-gold)] mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white">Premium<br/>Quality</span>
              </div>
              <div className="bg-[var(--color-matic-card)] border border-gray-800 p-6 rounded-xl flex flex-col items-center justify-center text-center group hover:border-[var(--color-matic-gold)] transition-colors">
                <Cpu className="w-8 h-8 text-[var(--color-matic-gold)] mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white">Advanced<br/>Technology</span>
              </div>
              <div className="bg-[var(--color-matic-card)] border border-gray-800 p-6 rounded-xl flex flex-col items-center justify-center text-center group hover:border-[var(--color-matic-gold)] transition-colors">
                <Droplet className="w-8 h-8 text-[var(--color-matic-gold)] mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white">Reliable<br/>Performance</span>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2">
            <motion.div 
              className="relative rounded-2xl overflow-hidden aspect-[3/4] max-h-[800px] w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
                <img 
                src={config?.heroImageUrl || heroImage} 
                alt="Luxury Fuel Dispenser" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-matic-dark)] via-transparent to-transparent" />
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
