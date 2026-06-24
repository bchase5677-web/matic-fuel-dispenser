import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import projectImage from '../assets/images/luxury_gas_station_1782231212172.jpg';

export default function ProjectsSection() {
  return (
    <section className="py-24 bg-[var(--color-matic-dark)] border-t border-gray-900">
      <div className="container mx-auto px-6">
        
        {/* Projects */}
        <div className="mb-24">
          <div className="mb-12">
            <h3 className="text-sm font-bold text-[var(--color-matic-gold)] uppercase tracking-[0.2em] mb-4">Our Projects</h3>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Trusted by Leaders<br/>Worldwide
            </h2>
          </div>
          
          <motion.div 
            className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-black max-w-5xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={projectImage} 
              alt="Luxury Gas Station Canopy at Night" 
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </motion.div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-3xl mx-auto py-12">
          <h3 className="text-sm font-bold text-[var(--color-matic-gold)] uppercase tracking-[0.2em] mb-4">Ready to Elevate Your Station?</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Let's Build the Future<br/>of Fueling Together
          </h2>
          <p className="text-gray-400 text-lg font-light mb-10">
            Get a customized solution that matches your vision.
          </p>
          <a href="#shop" className="inline-flex items-center justify-center gap-3 bg-[var(--color-matic-gold)] text-black px-8 py-4 font-bold tracking-wide hover:bg-[var(--color-matic-gold-hover)] transition-colors">
            SHOP NOW
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

      </div>
    </section>
  );
}
