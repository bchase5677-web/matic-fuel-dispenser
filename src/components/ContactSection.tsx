import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSiteConfig } from '../SiteContext';

export default function ContactSection() {
  const { config } = useSiteConfig();

  return (
    <section id="contact" className="py-32 bg-[#0a0a0a] relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-[#D4AF37] uppercase tracking-[0.2em] text-sm font-semibold mb-4">Contact Us</h2>
          <h3 className="text-4xl md:text-5xl font-display text-white mb-6">Let's Discuss Your Fuel Station Requirements</h3>
          <p className="text-gray-400 font-light">Get in touch with our experts for purchases, installations, or immediate maintenance support.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#1A1A1A] border border-white/5 p-8 rounded-3xl"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] flex-shrink-0 bg-[#D4AF37]/5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Company Location</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {(config?.address || '33 Idimu Road, Olorun Adaba Bus Stop, Lagos, Nigeria').split(',').map((part, i, arr) => <span key={i}>{part.trim()}{i < arr.length - 1 ? <br/> : ''}</span>)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] flex-shrink-0 bg-[#D4AF37]/5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Phone & WhatsApp</h4>
                  <p className="text-gray-400 text-sm">
                    <a href={`tel:${config?.phone || '09028813221'}`} className="hover:text-[#D4AF37] transition-colors">{config?.phone || '0902 881 3221'}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] flex-shrink-0 bg-[#D4AF37]/5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Email inquiries</h4>
                  <p className="text-gray-400 text-sm">
                    <a href={`mailto:${config?.email || 'Maticlimited@gmail.com'}`} className="hover:text-[#D4AF37] transition-colors">{config?.email || 'Maticlimited@gmail.com'}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] flex-shrink-0 bg-[#D4AF37]/5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Business Hours</h4>
                  <p className="text-gray-400 text-sm">Monday - Saturday: 8:00 AM - 6:00 PM<br/>Emergency Support: 24/7</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <motion.form 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#111] border border-white/5 p-8 md:p-12 rounded-3xl h-full flex flex-col"
              onSubmit={(e) => e.preventDefault()}
            >
              <h3 className="text-2xl font-display text-white mb-8">Send us a Message</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input type="text" className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]/50 text-white transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone / WhatsApp</label>
                  <input type="tel" className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]/50 text-white transition-colors" placeholder={config?.phone || '09028813221'} />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input type="email" className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]/50 text-white transition-colors" placeholder="email@company.com" />
              </div>
              <div className="mb-8 flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-2">How can we help?</label>
                <textarea className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]/50 text-white transition-colors h-32 resize-none" placeholder="I am interested in..."></textarea>
              </div>
              <button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#E6C27A] text-black font-semibold uppercase tracking-wider py-4 rounded-xl transition-colors">
                Send Request
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}
