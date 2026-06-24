import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import heroImage from '../assets/images/luxury_fuel_dispenser_1782231192519.jpg';

export default function ProductsSection() {
  return (
    <section id="products" className="py-24 bg-[var(--color-matic-dark)]">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h3 className="text-sm font-bold text-[var(--color-matic-gold)] uppercase tracking-[0.2em] mb-4">Our Dispensers</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Designed to Stand Out.<br/>Built to Perform.
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="bg-[var(--color-matic-card)] rounded-2xl overflow-hidden border border-gray-800 flex flex-col md:flex-row max-w-5xl mx-auto"
        >
          <div className="w-full md:w-1/2 bg-black relative min-h-[400px]">
            <img 
              src={heroImage} 
              alt="Matic LFX Series Dispenser" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent" />
          </div>
          
          <div className="w-full md:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-white mb-4">Matic Series</h3>
            <p className="text-gray-400 font-light mb-8 leading-relaxed">
              The perfect blend of elegance and efficiency. Premium single and double nozzle dispensers for Petrol, Diesel, and LPG.
            </p>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-center text-gray-300 font-light">
                <Check className="w-5 h-5 text-[var(--color-matic-gold)] mr-3 flex-shrink-0" />
                Sleek & Modern Design
              </li>
              <li className="flex items-center text-gray-300 font-light">
                <Check className="w-5 h-5 text-[var(--color-matic-gold)] mr-3 flex-shrink-0" />
                High Accuracy Metering
              </li>
              <li className="flex items-center text-gray-300 font-light">
                <Check className="w-5 h-5 text-[var(--color-matic-gold)] mr-3 flex-shrink-0" />
                User Friendly Interface
              </li>
            </ul>
            
            <div>
              <a href="#shop" className="inline-flex items-center justify-center gap-2 text-[var(--color-matic-gold)] font-bold tracking-wide hover:text-white transition-colors">
                SHOP NOW
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
