import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Wifi, WifiOff } from 'lucide-react';
import type { Message } from '../types';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    try {
      const saved = localStorage.getItem('chatHistory');
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages([{
          id: '1',
          role: 'model',
          parts: [{ text: "Welcome to Matic FUELTEC Ltd. How can I assist you with our premium fuel dispensers or services today?" }]
        }]);
      }
    } catch (e) {
      setMessages([{
        id: '1',
        role: 'model',
        parts: [{ text: "Welcome to Matic FUELTEC Ltd. How can I assist you with our premium fuel dispensers or services today?" }]
      }]);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    } catch (e) {}
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (input.trim().toLowerCase() === 'admin') {
      const userMsg: Message = { id: Date.now().toString(), role: 'user', parts: [{ text: input.trim() }] };
      const adminMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', parts: [{ text: 'Admin access requested. Click the button below to open the Admin Panel.' }], isAction: 'admin' };
      setMessages([...messages, userMsg, adminMsg]);
      setInput('');
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', parts: [{ text: input.trim() }] };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    if (isOnline) {
      try {
        const historyForApi = messages.map(m => ({ role: m.role, parts: m.parts }));
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMsg.parts[0].text, history: historyForApi })
        });

        if (response.ok) {
          const data = await response.json();
          setMessages([...newMessages, {
            id: (Date.now() + 1).toString(),
            role: 'model',
            parts: [{ text: data.reply }]
          }]);
        } else {
          fallbackOffline(newMessages, userMsg.parts[0].text);
        }
      } catch (error) {
        fallbackOffline(newMessages, userMsg.parts[0].text);
      }
    } else {
      fallbackOffline(newMessages, userMsg.parts[0].text);
    }
    
    setIsTyping(false);
  };

  const fallbackOffline = (currentMessages: Message[], userText: string) => {
    let replyText = "I am currently offline, but I can still help you! You can reach us at 09028813221 or email Maticlimited@gmail.com for immediate assistance.";
    const lowerInput = userText.toLowerCase();
    
    if (lowerInput.includes('product') || lowerInput.includes('dispenser')) {
      replyText = "We offer premium Matic Fuel Dispensers, available in Single, Double, and Multi-nozzle options for Petrol, Diesel, and LPG. Would you like to request a quote?";
    } else if (lowerInput.includes('service') || lowerInput.includes('repair') || lowerInput.includes('maintenance')) {
      replyText = "Our certified technicians provide nationwide installation, maintenance, calibration, and swift repairs. Call 09028813221 to book an appointment.";
    } else if (lowerInput.includes('contact') || lowerInput.includes('location')) {
      replyText = "We are located at 33 Idimu Road, Olorun Adaba Bus Stop, Lagos, Nigeria. You can call or WhatsApp us at 09028813221.";
    } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
      replyText = "Our pricing depends on the specific model and your requirements. Please call us at 09028813221 or fill out the contact form for a tailored quote.";
    }

    setMessages([...currentMessages, {
      id: (Date.now() + 1).toString(),
      role: 'model',
      parts: [{ text: replyText }]
    }]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[350px] h-[500px] max-w-[calc(100vw-48px)] bg-[#111]/90 backdrop-blur-xl border border-[#D4AF37]/30 rounded-2xl shadow-2xl shadow-[#D4AF37]/10 flex flex-col overflow-hidden z-50 text-white"
          >
            <div className="bg-[#1A1A1A] border-b border-[#D4AF37]/30 p-4 flex justify-between items-center relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center border border-[#D4AF37]/50">
                  <Bot className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#D4AF37]">Matic AI Assistant</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    {isOnline ? (
                      <><Wifi className="w-3 h-3 text-green-400" /> Online</>
                    ) : (
                      <><WifiOff className="w-3 h-3 text-red-400" /> Offline Mode</>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close chat window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-[#D4AF37] text-black rounded-tr-sm' 
                      : 'bg-[#1A1A1A] text-gray-200 border border-white/5 rounded-tl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
                    {msg.isAction === 'admin' && (
                      <button
                        onClick={() => {
                          window.location.hash = '#admin';
                          setIsOpen(false);
                        }}
                        className="mt-3 w-full bg-[var(--color-matic-gold)] text-black px-4 py-2 rounded-lg font-bold hover:bg-[var(--color-matic-gold-hover)] transition-colors"
                      >
                        Open Admin Panel
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-2xl bg-[#1A1A1A] border border-white/5 rounded-tl-sm">
                    <div className="flex gap-1">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-[#1A1A1A] bg-[#111]">
              <div className="flex gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about products, services..."
                  className="flex-1 bg-[#1A1A1A] border border-white/5 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all text-white placeholder-gray-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                  className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-black hover:bg-[#E6C27A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        drag="y"
        dragConstraints={{ 
          top: typeof window !== 'undefined' ? -window.innerHeight + 100 : 0, 
          bottom: 0 
        }}
        dragElastic={0}
        dragMomentum={false}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1.5 cursor-grab active:cursor-grabbing pointer-events-auto"
      >
        <motion.button
          animate={!isOpen ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[48px] h-[48px] bg-black rounded-full shadow-[0_0_20px_rgba(200,169,81,0.3)] border-2 border-[var(--color-matic-gold)] flex items-center justify-center hover:bg-gray-900 transition-colors overflow-hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Assistant"
        >
          {isOpen ? <X className="w-5 h-5 text-[var(--color-matic-gold)]" /> : (
            <img 
              src="https://api.dicebear.com/7.x/bottts/svg?seed=Matic&backgroundColor=111111&primaryColor=D4AF37" 
              alt="AI Bot"
              className="w-full h-full object-cover p-1"
            />
          )}
        </motion.button>
        {!isOpen && (
          <span className="text-[10px] font-bold text-[var(--color-matic-gold)] bg-black/80 px-3 py-1 rounded-full border border-[var(--color-matic-gold)]/30 backdrop-blur-sm uppercase tracking-wider">
            Ask Agent
          </span>
        )}
      </motion.div>
    </>
  );
}
