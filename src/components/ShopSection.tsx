import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../CartContext';
import { db, collection, onSnapshot, addDoc } from '../firebase';

const sampleProducts = [
  {
    name: "Golden Flow Pro Dispenser",
    price: 12500,
    category: "Dispensers",
    label: "Best Seller",
    description: "High-end luxury fuel dispenser with dual nozzles and premium golden finish.",
    imageUrl: "https://images.unsplash.com/photo-1545464333-9cbd1f263054?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    name: "Matic Silver Line Single",
    price: 8500,
    category: "Dispensers",
    label: "Standard",
    description: "Reliable single nozzle dispenser with advanced metering capabilities.",
    imageUrl: "https://images.unsplash.com/photo-1600868884976-9694e9766ee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    name: "Pro-Flow Meter 5000",
    price: 1200,
    category: "Spare Parts",
    label: "Essential",
    description: "Precision fuel meter replacement for accurate delivery.",
    imageUrl: "https://images.unsplash.com/photo-1530983821817-482a033ce3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    name: "Heavy Duty Nozzle XL",
    price: 350,
    category: "Spare Parts",
    label: "New",
    description: "Durable fuel nozzle with splash guard and ergonomic grip.",
    imageUrl: "https://images.unsplash.com/photo-1621619856624-42fd193a0661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    name: "Digital Display Module",
    price: 850,
    category: "Spare Parts",
    label: "Electronics",
    description: "Replacement high-contrast LED display module for Matic dispensers.",
    imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    name: "Premium Steel Hose 5m",
    price: 220,
    category: "Spare Parts",
    label: "Durable",
    description: "Reinforced 5-meter fuel delivery hose, weather resistant.",
    imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  }
];

function AddToCartButton({ product }: { product: any }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening when clicking button in a grid card
    setAdded(true);
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || '',
      image_url: product.imageUrl || product.image
    });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={added}
      className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-[11px] font-extrabold uppercase tracking-wider rounded-md transition-all duration-300 active:scale-95 ${
        added 
          ? 'bg-green-600 text-white'
          : 'bg-[var(--color-matic-gold)] hover:bg-[var(--color-matic-gold-hover)] text-black font-extrabold'
      }`}
    >
      {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
      {added ? 'ADDED' : 'ADD TO CART'}
    </button>
  );
}

export default function ShopSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      if (snap.empty) {
        // Seed once
        sampleProducts.forEach(async (p) => {
          try {
            await addDoc(collection(db, 'products'), p);
          } catch (e) {
            console.error(e);
          }
        });
      }
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    });
    return () => unsub();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category || p.label).filter(Boolean));
    return ['All', 'Dispensers', 'Spare Parts', ...Array.from(cats).filter(c => c !== 'Dispensers' && c !== 'Spare Parts')];
  }, [products]);

  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'All') return true;
    const itemCat = p.category || p.label || 'Uncategorized';
    // Let's do a simple includes check to catch 'Spare Parts' etc.
    return itemCat.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[var(--color-matic-dark)] py-24" id="products">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h3 className="text-sm font-bold text-[var(--color-matic-gold)] uppercase tracking-[0.2em] mb-4">Shop</h3>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Our Products
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category 
                    ? 'bg-[var(--color-matic-gold)] text-black' 
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[var(--color-matic-card)] border border-gray-800 rounded-xl md:rounded-2xl overflow-hidden group hover:border-[var(--color-matic-gold)] transition-colors flex flex-col"
            >
              <button onClick={() => setSelectedProduct(product)} className="h-32 sm:h-36 md:h-48 overflow-hidden relative bg-black p-0 flex items-center justify-center w-full block">
                 {product.category || product.label ? (
                   <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 bg-[var(--color-matic-gold)] text-black text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded uppercase tracking-wider">
                     {product.category || product.label}
                   </div>
                 ) : null}
                 {product.imageUrl || product.image ? (
                   <img src={product.imageUrl || product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90" />
                 ) : (
                   <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-white/10" />
                 )}
              </button>
              <div className="p-3 md:p-5 flex flex-col flex-1">
                <h4 className="text-sm md:text-lg font-bold text-white mb-1 line-clamp-1">{product.name}</h4>
                <div className="text-[var(--color-matic-gold)] text-base md:text-xl font-bold mb-3 md:mb-4">₦{Number(product.price || 0).toLocaleString()}</div>
                <div className="mt-auto">
                  <AddToCartButton product={product} />
                </div>
              </div>
            </motion.div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No products found in this category. Please check back later.
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--color-matic-dark)] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative min-h-[300px]">
                {selectedProduct.imageUrl || selectedProduct.image ? (
                  <img src={selectedProduct.imageUrl || selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingCart className="w-20 h-20 text-white/10" />
                )}
                {selectedProduct.category && (
                  <div className="absolute top-4 left-4 bg-[var(--color-matic-gold)] text-black text-xs font-bold px-3 py-1 rounded uppercase tracking-wider shadow-lg">
                    {selectedProduct.category}
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                {selectedProduct.label && (
                  <div className="text-[var(--color-matic-gold)] text-xs font-bold tracking-[0.2em] uppercase mb-2">
                    {selectedProduct.label}
                  </div>
                )}
                <h3 className="text-3xl font-bold text-white mb-2">{selectedProduct.name}</h3>
                <div className="text-[var(--color-matic-gold)] text-2xl font-bold mb-6">
                  ₦{Number(selectedProduct.price || 0).toLocaleString()}
                </div>
                
                <div className="prose prose-invert prose-sm mb-8 flex-1">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {selectedProduct.description || "No description provided."}
                  </p>
                  
                  {selectedProduct.note && (
                    <div className="bg-white/5 border border-[var(--color-matic-gold)]/20 rounded-xl p-4 mt-6">
                      <h4 className="text-[var(--color-matic-gold)] text-xs font-bold uppercase tracking-wider mb-2">Editor's Note</h4>
                      <p className="text-gray-400 text-sm italic m-0">"{selectedProduct.note}"</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10 mt-auto">
                  <AddToCartButton product={selectedProduct} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
