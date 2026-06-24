import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[var(--color-matic-light)] text-black">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-sm font-bold text-[#b89741] uppercase tracking-[0.2em] mb-4">About Matic Fueltec</h3>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black leading-tight">
              Where Luxury<br/>Meets Innovation
            </h2>
            <p className="text-gray-700 text-lg font-light leading-relaxed mb-8 max-w-2xl">
              Matic FUELTEC fuel dispensers are crafted with precision, built with advanced technology, and designed to elevate your fueling experience. We supply premium dispensers, equipment, genuine spare parts, and offer professional installation, maintenance, and repairs for filling stations nationwide.
            </p>
            
            <a href="#services" className="inline-flex items-center justify-center gap-3 border border-black text-black px-8 py-4 font-bold tracking-wide hover:bg-black hover:text-white transition-colors">
              LEARN MORE
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
