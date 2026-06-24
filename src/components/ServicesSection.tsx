import { motion } from 'motion/react';
import { ArrowRight, MonitorSmartphone, Target, ShieldCheck, Leaf } from 'lucide-react';

export default function ServicesSection() {
  const features = [
    {
      title: "Advanced Display",
      description: "High visibility display for seamless operation.",
      icon: <MonitorSmartphone className="w-8 h-8 text-[var(--color-matic-gold)]" />
    },
    {
      title: "High Accuracy",
      description: "Precision measurement for every drop.",
      icon: <Target className="w-8 h-8 text-[var(--color-matic-gold)]" />
    },
    {
      title: "Durable & Reliable",
      description: "Built with premium materials for long lasting performance.",
      icon: <ShieldCheck className="w-8 h-8 text-[var(--color-matic-gold)]" />
    },
    {
      title: "Eco Friendly",
      description: "Designed to reduce emissions and protect the environment.",
      icon: <Leaf className="w-8 h-8 text-[var(--color-matic-gold)]" />
    }
  ];

  return (
    <section id="services" className="py-24 bg-[var(--color-matic-dark)]">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h3 className="text-sm font-bold text-[var(--color-matic-gold)] uppercase tracking-[0.2em] mb-4">Premium Features</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Luxury in Every Detail
          </h2>
        </div>

        <div className="max-w-4xl space-y-8 mb-16">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex gap-6 items-start"
            >
              <div className="w-20 h-20 rounded-full border border-gray-800 bg-[var(--color-matic-card)] flex items-center justify-center flex-shrink-0">
                {feature.icon}
              </div>
              <div className="pt-3">
                <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-400 font-light max-w-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <a href="#contact" className="inline-flex items-center justify-center gap-3 bg-[var(--color-matic-gold)] text-black px-8 py-4 font-bold tracking-wide hover:bg-[var(--color-matic-gold-hover)] transition-colors">
            VIEW ALL FEATURES
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
